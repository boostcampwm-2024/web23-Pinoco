import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  optimizeDeps: {
    include: ['react-tooltip'],
  },
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'resolve-svg',
          resolveId(source) {
            if (source.endsWith('.svg')) return source;
            return null;
          },
          load(id) {
            if (id.endsWith('.svg')) {
              return `export default ${JSON.stringify(id)}`;
            }
            return null;
          },
        },
        removeConsole({
          includes: ['log', 'warn', 'error'],
        }),
      ],
    },
  },
});
