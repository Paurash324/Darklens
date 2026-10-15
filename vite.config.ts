import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const rootPath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: rootPath('./popup.html'),
        sidepanel: rootPath('./sidepanel.html'),
        options: rootPath('./options.html'),
        background: rootPath('./src/background/index.ts'),
        content: rootPath('./src/content/index.ts')
      },
      output: { entryFileNames: (chunk) => chunk.name === 'background' || chunk.name === 'content' ? 'src/[name]/index.js' : 'assets/[name]-[hash].js' }
    },
    emptyOutDir: true
  }
});
