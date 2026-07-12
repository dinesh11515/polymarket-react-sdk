import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  root: './',
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'react',
          include: [
            'packages/react/src/**/*.test.ts',
            'packages/react/src/**/*.test.tsx',
          ],
          exclude: [...configDefaults.exclude],
          environment: 'jsdom',
          setupFiles: ['packages/react/src/test/setup.ts'],
          typecheck: {
            enabled: true,
            include: ['packages/react/src/**/*.test-d.ts'],
            tsconfig: 'packages/react/tsconfig.json',
          },
        },
      },
    ],
  },
});
