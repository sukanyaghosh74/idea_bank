import { useMemo, useState, type ReactElement } from 'react'
import Badge from './Badge'
import type { Idea } from '../utils/storage'

export type SortKey = keyof Pick<Idea, 'name' | 'feasibility' | 'marketPotential' | 'createdAt' | 'updatedAt'>
type SortDir = 'asc' | 'desc'

interface IdeaTableProps {
  ideas: Idea[]
  onEdit: (idea: Idea) => void
  onDelete: (id: string) => void
  search: string
  setSearch: (q: string) => void
}

const feasibilityTone: Record<Idea['feasibility'], Parameters<typeof Badge>[0]['tone']> = {
  Easy: 'green',
  Medium: 'yellow',
  Hard: 'red',
}

const marketTone: Record<Idea['marketPotential'], Parameters<typeof Badge>[0]['tone']> = {
  Low: 'gray',
  Medium: 'blue',
  High: 'purple',
}

export default function IdeaTable({ ideas, onEdit, onDelete, search, setSearch }: IdeaTableProps): ReactElement {
  const [sortKey] = useState<SortKey>('updatedAt')
  const [sortDir] = useState<SortDir>('desc')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const list = q
      ? ideas.filter((it) =>
          [it.id, it.name, it.problem, it.description, it.tech, it.nextSteps]
            .join(' ')
            .toLowerCase()
            .includes(q),
        )
      : ideas
    const sorted = [...list].sort((a, b) => {
      const getVal = (x: Idea) => x[sortKey]
      const av = getVal(a) as unknown as string | number
      const bv = getVal(b) as unknown as string | number
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [ideas, search, sortKey, sortDir])

  return (
    <div>
      {/* Floating search bar */}
      <div className="search-wrap">
        <div className="relative" style={{ width: '100%', maxWidth: 672 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas..."
            className="search-input focus-ring transition-soft"
          />
          <span className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
            </svg>
          </span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="cards-grid" style={{ overflow: 'hidden' }}>
        {filtered.map((it) => (
          <div
            key={it.id}
            className="idea-card group"
          >
            {/* Edit/Delete icons */}
            <div className="actions">
              <button
                onClick={() => onEdit(it)}
                className="icon-btn focus-ring"
                aria-label="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.75 20.9 3 21.75l.85-3.75L16.862 4.487z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(it.id)}
                className="icon-btn focus-ring"
                aria-label="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m1 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h10z" />
                </svg>
              </button>
            </div>

            <div className="idea-name">{it.name}</div>
            <div className="idea-problem">{it.problem}</div>

            <div className="idea-badges">
              <Badge tone={feasibilityTone[it.feasibility]}>{it.feasibility}</Badge>
              <Badge tone={marketTone[it.marketPotential]}>{it.marketPotential}</Badge>
            </div>

            <div className="idea-description">
              <p className="line-clamp-3">{it.description}</p>
              {it.description.length > 160 && (
                <button className="btn" style={{ padding: '0.25rem 0.5rem' }}>See more</button>
              )}
            </div>

            <div className="idea-tech">Tech: {it.tech || '—'}</div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1' }}>
            <div className="idea-card" style={{ textAlign: 'center', borderStyle: 'dashed', padding: '3rem' }}>
              <div className="mb-3 text-6xl">✨</div>
              <div className="idea-name">No ideas yet. Let’s get creative!</div>
              <div className="idea-problem" style={{ fontStyle: 'normal' }}>Click the “+ Add Idea” button to add your first idea.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


