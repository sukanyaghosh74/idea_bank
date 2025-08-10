import { useEffect, useMemo, useState, type ReactElement } from 'react'
import IdeaTable from '../components/IdeaTable'
import Modal from '../components/Modal'
import IdeaForm, { type IdeaDraft } from '../components/IdeaForm'
import AuthForm from '../components/AuthForm'
import { exportIdeasToJson, generateId, loadIdeas, saveIdeas, type Idea, getCurrentUser, setCurrentUser, logout, findOrCreateUser, type User } from '../utils/storage'
import { apiCreateIdea, apiDeleteIdea, apiGetMe, apiListIdeas, apiLogin, apiLogout, apiUpdateIdea, apiExportUrl } from '../utils/api'

export default function Home(): ReactElement {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Idea | null>(null)
  const [openAuth, setOpenAuth] = useState(false)
  const [saving, setSaving] = useState(false)

  const title = useMemo(() => (editing ? 'Edit Idea' : 'Add New Idea'), [editing])

  function handleAddClick() {
    setEditing(null)
    setOpen(true)
  }

  async function bootstrap() {
    try {
      const me = await apiGetMe()
      setUser(me)
    } catch {}
    try {
      const list = await apiListIdeas()
      setIdeas(list)
    } catch {}
  }

  useEffect(() => {
    void bootstrap()
  }, [])

  async function handleSubmit(draft: IdeaDraft) {
    try {
      setSaving(true)
      if (editing) {
        const updated = await apiUpdateIdea(editing.id, draft)
        setIdeas((prev) => prev.map((it) => (it.id === updated.id ? updated : it)))
      } else {
        const created = await apiCreateIdea(draft)
        setIdeas((prev) => [created, ...prev])
      }
      setOpen(false)
    } catch (err) {
      console.error('Failed to save idea', err)
      alert('Failed to save idea. Please ensure the API server is running (npm run server).')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(idea: Idea) {
    setEditing(idea)
    setOpen(true)
  }

  async function handleDelete(id: string) {
    await apiDeleteIdea(id)
    setIdeas((prev) => prev.filter((i) => i.id !== id))
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
            {user ? (
              <>
                <span style={{ opacity: 0.85 }}>Hi, {user.name}</span>
                <button onClick={() => { logout(); setUser(null) }} className="btn">Logout</button>
              </>
            ) : (
              <button onClick={() => setOpenAuth(true)} className="btn">Login</button>
            )}
            {ideas.length > 0 && (
              <a href={apiExportUrl()} className="btn">Export JSON</a>
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

      <Modal open={openAuth} onClose={() => setOpenAuth(false)} title="Sign in to save ideas">
        <AuthForm
          onSubmit={(name, email) => {
            apiLogin(name, email).then((u) => {
              setUser(u)
              setOpenAuth(false)
            })
          }}
        />
      </Modal>
    </div>
  )
}


