import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { nanoid } from 'nanoid'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-please-change'

app.use(express.json())
app.use(cookieParser())

// CORS is optional if using Vite proxy. Enable for direct access.
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

const dbFile = path.join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter, { users: [], ideas: [] })
await db.read()
db.data ||= { users: [], ideas: [] }
await db.write()

function sign(userId) {
  return jwt.sign({ uid: userId }, JWT_SECRET, { expiresIn: '30d' })
}

function authMiddleware(req, _res, next) {
  const token = req.cookies?.token
  if (!token) return next()
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db.data.users.find((u) => u.id === payload.uid)
    if (user) req.user = user
  } catch {}
  next()
}

app.use(authMiddleware)

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  const { name, email } = req.body ?? {}
  if (!name || !email) return res.status(400).json({ error: 'name and email required' })
  let user = db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) {
    user = { id: nanoid(), name, email, createdAt: Date.now() }
    db.data.users.push(user)
    await db.write()
  } else if (user.name !== name) {
    user.name = name
    await db.write()
  }
  const token = sign(user.id)
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 })
  res.json({ user })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

app.get('/api/me', (req, res) => {
  if (!req.user) return res.json({ user: null })
  res.json({ user: req.user })
})

// Ideas CRUD
app.get('/api/ideas', async (_req, res) => {
  await db.read()
  const ideas = [...db.data.ideas].sort((a, b) => b.updatedAt - a.updatedAt)
  res.json({ ideas })
})

app.post('/api/ideas', async (req, res) => {
  const draft = req.body ?? {}
  const now = Date.now()
  const idea = {
    id: nanoid(),
    name: draft.name ?? '',
    problem: draft.problem ?? '',
    description: draft.description ?? '',
    tech: draft.tech ?? '',
    feasibility: draft.feasibility ?? 'Medium',
    marketPotential: draft.marketPotential ?? 'Medium',
    nextSteps: draft.nextSteps ?? '',
    createdAt: now,
    updatedAt: now,
    userId: req.user?.id,
    authorName: req.user?.name,
  }
  db.data.ideas.unshift(idea)
  await db.write()
  res.status(201).json({ idea })
})

app.put('/api/ideas/:id', async (req, res) => {
  const { id } = req.params
  const idx = db.data.ideas.findIndex((i) => i.id === id)
  if (idx === -1) return res.status(404).json({ error: 'not found' })
  const existing = db.data.ideas[idx]
  const patch = req.body ?? {}
  const updated = { ...existing, ...patch, updatedAt: Date.now() }
  db.data.ideas[idx] = updated
  await db.write()
  res.json({ idea: updated })
})

app.delete('/api/ideas/:id', async (req, res) => {
  const { id } = req.params
  const before = db.data.ideas.length
  db.data.ideas = db.data.ideas.filter((i) => i.id !== id)
  if (db.data.ideas.length === before) return res.status(404).json({ error: 'not found' })
  await db.write()
  res.json({ ok: true })
})

app.get('/api/export', async (_req, res) => {
  await db.read()
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Content-Disposition', `attachment; filename=idea-bank-${new Date().toISOString().slice(0,10)}.json`)
  res.end(JSON.stringify(db.data.ideas, null, 2))
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})


