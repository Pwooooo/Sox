import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import os from 'os'

function getStudioProjectsFile(): string {
  const appData = process.env.APPDATA || os.tmpdir()
  return path.join(appData, 'Novelo', 'studio_projects.json')
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'novelo-studio-projects-api',
      configureServer(server) {
        server.middlewares.use('/api/studio-projects', (req, res) => {
          const filePath = getStudioProjectsFile()
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            if (fs.existsSync(filePath)) {
              res.end(fs.readFileSync(filePath, 'utf-8'))
            } else {
              res.end('[]')
            }
            return
          }
          if (req.method === 'POST') {
            let body = ''
            req.on('data', (chunk) => {
              body += chunk
            })
            req.on('end', () => {
              try {
                fs.mkdirSync(path.dirname(filePath), { recursive: true })
                fs.writeFileSync(filePath, body || '[]', 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.end('{"ok":true}')
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: String(err) }))
              }
            })
            return
          }
          res.statusCode = 405
          res.end()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@engine': path.resolve(__dirname, './Novelo Engine'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        studio: path.resolve(__dirname, 'studio.html'),
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/catroot2/**', 'C:\\Windows\\**', '**/src-tauri/target/**'],
    },
  },
})
