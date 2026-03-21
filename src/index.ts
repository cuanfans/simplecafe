// src/index.ts

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import apiRoutes from './routes/api'
import adminViews from './routes/adminViews'
import publicViews from './routes/publicViews'
import { handleWebSocketUpgrade } from './services/websocketService'

export type Bindings = {
  DB: D1Database
  CACHE_KV: KVNamespace
  JWT_SECRET: string
  CLOUDINARY_API_KEY: string
  CLOUDINARY_API_SECRET: string
}

type Variables = {
  db: D1Database
}

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>()

// Middleware CORS
app.use('*', cors())

// Middleware: Menginjeksi koneksi Native D1 Database ke dalam context Hono
app.use('*', async (c, next) => {
  c.set('db', c.env.DB)
  await next()
})

// Mendaftarkan grup rute REST API
app.route('/api', apiRoutes)

// Mendaftarkan rute Tampilan Admin Area (Dilindungi JWT secara internal)
app.route('/admin', adminViews)

// Mendaftarkan rute khusus WebSocket (Real-time Engine KDS/POS)
app.get('/ws', handleWebSocketUpgrade)

// Mendaftarkan rute Tampilan Publik (Menggantikan fallback text sebelumnya)
app.route('/', publicViews)

export default app