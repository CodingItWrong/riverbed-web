import path from 'node:path';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(import.meta.dirname, './node_modules/react'),
      'react-dom': path.resolve(
        import.meta.dirname,
        './node_modules/react-dom',
      ),
    },
  },
});
