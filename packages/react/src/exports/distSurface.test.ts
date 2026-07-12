import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const distDir = join(dirname(fileURLToPath(import.meta.url)), '../../dist');
const hasDist = existsSync(join(distDir, 'index.js'));

function importSpecifiers(source: string): string[] {
  // Covers static `from '...'`, dynamic `import('...')`, and bare
  // side-effect `import '...'` forms.
  const patterns = [
    /from\s*['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]/g,
    /(?:^|[;\s])import\s+['"]([^'"]+)['"]/g,
  ];
  return patterns.flatMap((pattern) =>
    [...source.matchAll(pattern)].map((match) => match[1] ?? ''),
  );
}

function walletPackages(specifiers: string[]): string[] {
  return specifiers.filter(
    (specifier) =>
      specifier === 'viem' ||
      specifier.startsWith('viem/') ||
      specifier === 'wagmi' ||
      specifier.startsWith('wagmi/') ||
      specifier.startsWith('@wagmi/'),
  );
}

// Locks in the entrypoint separation. Requires a build: CI runs `pnpm build`
// before `pnpm test`; locally run `pnpm build` once if this suite is skipped.
describe.skipIf(!hasDist)('built entrypoint surface', () => {
  const read = (file: string) => readFileSync(join(distDir, file), 'utf8');

  it('root entry imports no wallet packages', () => {
    expect(walletPackages(importSpecifiers(read('index.js')))).toEqual([]);
  });

  it('query entry imports no react and no wallet packages', () => {
    const specifiers = importSpecifiers(read('query.js'));
    const reactImports = specifiers.filter(
      (specifier) => specifier === 'react' || specifier.startsWith('react/'),
    );
    expect(reactImports).toEqual([]);
    expect(walletPackages(specifiers)).toEqual([]);
  });

  it('viem entry does not import undeclared @wagmi/core', () => {
    const specifiers = importSpecifiers(read('viem.js'));
    expect(specifiers).not.toContain('@wagmi/core');
  });

  it('hook entries start with a use client banner; query stays server-safe', () => {
    expect(read('index.js').startsWith("'use client';")).toBe(true);
    expect(read('viem.js').startsWith("'use client';")).toBe(true);
    expect(read('query.js')).not.toContain("'use client'");
  });
});
