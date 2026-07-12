// tsup's `banner` option is lost when the rollup treeshake pass rewrites the
// output, so the directive is prepended post-build. The query entry is
// intentionally excluded — it must stay importable from React Server
// Components.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const banner = "'use client';\n";

for (const name of ['index', 'viem']) {
  const jsPath = fileURLToPath(new URL(`../dist/${name}.js`, import.meta.url));
  if (!existsSync(jsPath)) {
    throw new Error(`Missing build output: ${jsPath}`);
  }

  const code = readFileSync(jsPath, 'utf8');
  if (code.startsWith(banner)) {
    continue;
  }
  writeFileSync(jsPath, banner + code);

  const mapPath = `${jsPath}.map`;
  if (existsSync(mapPath)) {
    const map = JSON.parse(readFileSync(mapPath, 'utf8'));
    // One prepended output line = one leading ';' in the mappings.
    map.mappings = `;${map.mappings}`;
    writeFileSync(mapPath, JSON.stringify(map));
  }
}
