import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'KlangQuest',
        short_name: 'KlangQuest',
        start_url: '.',
        display: 'standalone',
        background_color: '#f5f3f4',
        icons: [
          {
            src: 'images/logo-klangquest-square-konturlos.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/logo-klangquest-square-konturlos.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 3000,  // Port für Vite Dev Server (Frontend)
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Pfad bleibt gleich
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules']
      }
    }
  }
})
