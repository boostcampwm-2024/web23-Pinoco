import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
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
      ],
    },
  },
});
