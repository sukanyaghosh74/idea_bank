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
}

const STORAGE_KEY = 'idea-bank-items'

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


