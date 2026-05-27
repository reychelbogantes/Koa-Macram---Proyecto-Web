import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BASE = '/Koa-Macram---Proyecto-Web/';

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    {
      name: 'rewrite-public-paths',
      transformIndexHtml(html) {
        return html;
      },
      transform(code, id) {
        if (id.endsWith('.jsx') || id.endsWith('.js')) {
          return code.replace(/src="\/(?!\/)/g, `src="${BASE}`);
        }
      }
    }
  ],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
