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

export interface User {
  id: string
  name: string
  email: string
  createdAt: number
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<T>
}

export async function apiGetMe(): Promise<User | null> {
  const data = await request<{ user: User | null }>('/api/me')
  return data.user
}

export async function apiLogin(name: string, email: string): Promise<User> {
  const data = await request<{ user: User }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  })
  return data.user
}

export async function apiLogout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' })
}

export async function apiListIdeas(): Promise<Idea[]> {
  const data = await request<{ ideas: Idea[] }>('/api/ideas')
  return data.ideas
}

export async function apiCreateIdea(draft: Partial<Idea>): Promise<Idea> {
  const data = await request<{ idea: Idea }>('/api/ideas', {
    method: 'POST',
    body: JSON.stringify(draft),
  })
  return data.idea
}

export async function apiUpdateIdea(id: string, patch: Partial<Idea>): Promise<Idea> {
  const data = await request<{ idea: Idea }>(`/api/ideas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch),
  })
  return data.idea
}

export async function apiDeleteIdea(id: string): Promise<void> {
  await request(`/api/ideas/${id}`, { method: 'DELETE' })
}

export function apiExportUrl(): string {
  return '/api/export'
}


