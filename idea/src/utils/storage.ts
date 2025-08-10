export type Feasibility = 'Easy' | 'Medium' | 'Hard'
export type MarketPotential = 'Low' | 'Medium' | 'High'

export interface Idea {
  id: string
  name: string
  problem: string
  description: string
  tech: string
  feasibility: Feasibility
  marketPotential: MarketPotential
  nextSteps: string
  createdAt: number
  updatedAt: number
  userId?: string
  authorName?: string
}

const STORAGE_KEY = 'idea-bank-items'
const USERS_KEY = 'idea-bank-users'
const SESSION_KEY = 'idea-bank-session'

export function loadIdeas(): Idea[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as Idea[]
    if (!Array.isArray(data)) return []
    return data
  } catch (err) {
    console.error('Failed to load ideas from localStorage', err)
    return []
  }
}

export function saveIdeas(ideas: Idea[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas))
  } catch (err) {
    console.error('Failed to save ideas to localStorage', err)
  }
}

export function generateId(): string {
  const now = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${now}-${rand}`
}

export function exportIdeasToJson(ideas: Idea[]): void {
  const dataStr = JSON.stringify(ideas, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `idea-bank-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// Simple auth (local-only)
export interface User {
  id: string
  name: string
  email: string
  createdAt: number
}

export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as User[]
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Failed to load users', err)
    return []
  }
}

export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.error('Failed to save users', err)
  }
}

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const id = JSON.parse(raw) as string
    return loadUsers().find((u) => u.id === id) ?? null
  } catch {
    return null
  }
}

export function setCurrentUser(userId: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(userId))
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function findOrCreateUser(name: string, email: string): User {
  const users = loadUsers()
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existing) return existing
  const user: User = { id: generateId(), name, email, createdAt: Date.now() }
  const next = [...users, user]
  saveUsers(next)
  return user
}


