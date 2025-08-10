import { useMemo, useState, type ReactElement } from 'react'
import IdeaTable from '../components/IdeaTable'
import Modal from '../components/Modal'
import IdeaForm, { type IdeaDraft } from '../components/IdeaForm'
import { exportIdeasToJson, generateId, loadIdeas, saveIdeas, type Idea } from '../utils/storage'

export default function Home(): ReactElement {
  const [ideas, setIdeas] = useState<Idea[]>(() => loadIdeas())
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Idea | null>(null)

  const title = useMemo(() => (editing ? 'Edit Idea' : 'Add New Idea'), [editing])

  function handleAddClick() {
    setEditing(null)
    setOpen(true)
  }

  function handleSubmit(draft: IdeaDraft) {
    if (editing) {
      const updated: Idea = {
        ...editing,
        ...draft,
        updatedAt: Date.now(),
      }
      const next = ideas.map((it) => (it.id === editing.id ? updated : it))
      setIdeas(next)
      saveIdeas(next)
    } else {
      const now = Date.now()
      const created: Idea = {
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        ...draft,
      }
      const next = [created, ...ideas]
      setIdeas(next)
      saveIdeas(next)
    }
    setOpen(false)
  }

  function handleEdit(idea: Idea) {
    setEditing(idea)
    setOpen(true)
  }

  function handleDelete(id: string) {
    const next = ideas.filter((it) => it.id !== id)
    setIdeas(next)
    saveIdeas(next)
  }

  const [dark, setDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  if (dark) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')

  return (
    <div className="app-root">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="navbar-title">💡 Idea Bank</div>
          <div className="navbar-actions">
            {ideas.length > 0 && (
              <button onClick={() => exportIdeasToJson(ideas)} className="btn">Export JSON</button>
            )}
            <button onClick={() => setDark((d) => !d)} className="btn" aria-label="Toggle dark mode" title="Toggle dark mode">
              {dark ? '🌙' : '☀️'}
            </button>
            <button onClick={handleAddClick} className="btn btn-gradient">+ Add Idea</button>
          </div>
        </div>
      </nav>

      <main className="container" style={{ marginTop: '1.5rem' }}>
        <IdeaTable ideas={ideas} onEdit={handleEdit} onDelete={handleDelete} search={search} setSearch={setSearch} />
      </main>

      <Modal open={open} onClose={() => setOpen(false)} title={title}>
        <IdeaForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}


