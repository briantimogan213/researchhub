import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    outDir: path.resolve(__dirname, 'jsxDist'),
    lib: {
      entry: './src/Views/react/src/main.tsx',
      name: 'ReactApp',
      fileName: 'react-app',
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      // output: {
      //   globals: {
      //     react: 'React',        // Global variable for React (only if marked as external)
      //     'react-dom': 'ReactDOM', // Global variable for ReactDOM (only if marked as external)
      //     './home': "Home"
      //   },
      // },
    },
    target: 'es2015', // Set ES2015 for browser compatibility
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'), // Replace process.env.NODE_ENV
  },
});
