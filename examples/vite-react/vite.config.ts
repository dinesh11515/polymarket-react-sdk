import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'polymarket-react-sdk/query': path.resolve(
        dirname,
        '../../packages/react/src/exports/query.ts',
      ),
      'polymarket-react-sdk/viem': path.resolve(
        dirname,
        '../../packages/react/src/exports/viem.ts',
      ),
      'polymarket-react-sdk': path.resolve(
        dirname,
        '../../packages/react/src/exports/index.ts',
      ),
    },
  },
  server: {
    port: 5173,
  },
});
