import { useState, type ReactElement } from 'react'

interface AuthFormProps {
  onSubmit: (name: string, email: string) => void
}

export default function AuthForm({ onSubmit }: AuthFormProps): ReactElement {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const valid = name.trim().length > 0 && /.+@.+\..+/.test(email)

  function handle(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onSubmit(name.trim(), email.trim())
  }

  return (
    <form onSubmit={handle} className="vspace-4">
      <div>
        <label className="label">Your Name</label>
        <input className="input focus-ring transition-soft" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input focus-ring transition-soft" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={!valid} className="btn btn-gradient focus-ring transition-soft">Continue</button>
      </div>
    </form>
  )
}


