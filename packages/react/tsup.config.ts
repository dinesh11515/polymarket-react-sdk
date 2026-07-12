import { defineConfig } from 'tsup';

const sharedExternals = [
  '@polymarket/client',
  '@polymarket/client/actions',
  '@tanstack/react-query',
  'react',
  'react/jsx-runtime',
];

const queryExternals = [
  '@polymarket/client',
  '@polymarket/client/actions',
  '@tanstack/react-query',
];

// The 'use client' directive for the index and viem entries is prepended by
// scripts/addUseClientBanner.mjs after the build — tsup's `banner` option is
// dropped by the rollup treeshake pass.

export default defineConfig(() => [
  {
    entry: ['src/exports/index.ts'],
    outDir: 'dist',
    sourcemap: true,
    treeshake: true,
    clean: true,
    tsconfig: 'tsconfig.build.json',
    bundle: true,
    minify: false,
    dts: true,
    platform: 'neutral',
    format: ['esm'],
    external: sharedExternals,
  },
  {
    entry: ['src/exports/query.ts'],
    outDir: 'dist',
    sourcemap: true,
    treeshake: true,
    clean: false,
    tsconfig: 'tsconfig.build.json',
    bundle: true,
    minify: false,
    dts: true,
    platform: 'neutral',
    format: ['esm'],
    external: queryExternals,
  },
  {
    entry: ['src/exports/viem.ts'],
    outDir: 'dist',
    sourcemap: true,
    treeshake: true,
    clean: false,
    tsconfig: 'tsconfig.build.json',
    bundle: true,
    minify: false,
    dts: true,
    platform: 'neutral',
    format: ['esm'],
    external: [
      ...sharedExternals,
      '@polymarket/client/viem',
      'viem',
      'viem/chains',
      'wagmi',
      'wagmi/actions',
      'wagmi/connectors',
    ],
  },
]);
