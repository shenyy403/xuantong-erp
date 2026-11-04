import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const app = new Hono()
app.use('/*', cors())

// 1. 托管前端打包后的静态文件
app.use('/*', serveStatic({ root: './dist' }))

// 2. 解决 React 路由刷新 404 问题（把所有非 API 请求都指回 index.html）
app.get('*', serveStatic({ path: './dist/index.html' }))

// --- 以下是你原来的 API 接口 ---

// 初始化数据库表
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nickname TEXT
    );
    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      module_id INTEGER REFERENCES modules(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      task_date DATE NOT NULL,
      done BOOLEAN DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS countdowns (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      label TEXT NOT NULL,
      target_date DATE NOT NULL
    );
  `)
}
initDB().catch(console.error)

app.post('/api/register', async (c) => {
  const { email, password, nickname } = await c.req.json()
  try {
    const res = await pool.query('INSERT INTO users (email, password, nickname) VALUES ($1, $2, $3) RETURNING id, email, nickname', [email, password, nickname])
    return c.json(res.rows[0])
  } catch (e) { return c.json({ error: '邮箱已存在' }, 400) }
})

app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json()
  const res = await pool.query('SELECT id, email, nickname, role FROM users WHERE email = $1 AND password = $2', [email, password])
  if (res.rows.length === 0) return c.json({ error: '邮箱或密码错误' }, 401)
  return c.json(res.rows[0])
})

const handleCRUD = (table) => {
  app.get(`/api/${table}/:userId`, async (c) => {
    const res = await pool.query(`SELECT * FROM ${table} WHERE user_id = $1 ORDER BY id DESC`, [c.req.param('userId')])
    return c.json(res.rows)
  })
  app.post(`/api/${table}`, async (c) => {
    const data = await c.req.json()
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ')
    const res = await pool.query(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`, values)
    return c.json(res.rows[0])
  })
  app.put(`/api/${table}/:id`, async (c) => {
    const data = await c.req.json()
    const keys = Object.keys(data)
    const values = Object.values(data)
    const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(', ')
    await pool.query(`UPDATE ${table} SET ${sets} WHERE id = $${keys.length + 1}`, [...values, c.req.param('id')])
    return c.json({ success: true })
  })
  app.delete(`/api/${table}/:id`, async (c) => {
    await pool.query(`DELETE FROM ${table} WHERE id = $1`, [c.req.param('id')])
    return c.json({ success: true })
  })
}

handleCRUD('modules')
handleCRUD('tasks')
handleCRUD('countdowns')

const port = process.env.PORT || 3000
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Server running on port ${info.port}`)
})
