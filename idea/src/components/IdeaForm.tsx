import { useEffect, useMemo, useState, type ReactElement } from 'react'
import Badge from './Badge'
import type { Feasibility, Idea, MarketPotential } from '../utils/storage'

export interface IdeaDraft {
  name: string
  problem: string
  description: string
  tech: string
  feasibility: Feasibility
  marketPotential: MarketPotential
  nextSteps: string
}

interface IdeaFormProps {
  initial?: Partial<Idea>
  onSubmit: (draft: IdeaDraft) => void
  onCancel: () => void
}

const feasibilityOptions: Array<{ value: Feasibility; tone: Parameters<typeof Badge>[0]['tone'] }> = [
  { value: 'Easy', tone: 'green' },
  { value: 'Medium', tone: 'yellow' },
  { value: 'Hard', tone: 'red' },
]

const marketOptions: Array<{ value: MarketPotential; tone: Parameters<typeof Badge>[0]['tone'] }> = [
  { value: 'Low', tone: 'gray' },
  { value: 'Medium', tone: 'blue' },
  { value: 'High', tone: 'green' },
]

export default function IdeaForm({ initial, onSubmit, onCancel }: IdeaFormProps): ReactElement {
  const [name, setName] = useState(initial?.name ?? '')
  const [problem, setProblem] = useState(initial?.problem ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [tech, setTech] = useState(initial?.tech ?? '')
  const [feasibility, setFeasibility] = useState<Feasibility>(initial?.feasibility ?? 'Medium')
  const [marketPotential, setMarketPotential] = useState<MarketPotential>(initial?.marketPotential ?? 'Medium')
  const [nextSteps, setNextSteps] = useState(initial?.nextSteps ?? '')

  const isValid = useMemo(() => name.trim().length > 0, [name])

  useEffect(() => {
    setName(initial?.name ?? '')
    setProblem(initial?.problem ?? '')
    setDescription(initial?.description ?? '')
    setTech(initial?.tech ?? '')
    setFeasibility(initial?.feasibility ?? 'Medium')
    setMarketPotential(initial?.marketPotential ?? 'Medium')
    setNextSteps(initial?.nextSteps ?? '')
  }, [initial])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    onSubmit({ name, problem, description, tech, feasibility, marketPotential, nextSteps })
  }

  return (
    <form onSubmit={handleSubmit} className="vspace-4">
      <div className="grid-2">
        <div>
          <label className="label">Idea Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input focus-ring transition-soft"
            placeholder="e.g., AI Meal Planner"
          />
        </div>
        <div>
          <label className="label">Tech Needed</label>
          <input
            value={tech}
            onChange={(e) => setTech(e.target.value)}
            className="input focus-ring transition-soft"
            placeholder="e.g., React, Node, OpenAI"
          />
        </div>
      </div>
      <div className="grid-2">
        <div>
          <label className="label">Problem It Solves</label>
          <input
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="input focus-ring transition-soft"
            placeholder="e.g., Saves time planning meals"
          />
        </div>
        <div className="grid-2-compact">
          <div>
            <label className="label">Feasibility</label>
            <select
              value={feasibility}
              onChange={(e) => setFeasibility(e.target.value as Feasibility)}
              className="select focus-ring transition-soft"
            >
              {feasibilityOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Market Potential</label>
            <select
              value={marketPotential}
              onChange={(e) => setMarketPotential(e.target.value as MarketPotential)}
              className="select focus-ring transition-soft"
            >
              {marketOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.value}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="textarea focus-ring transition-soft"
          placeholder="Briefly describe the idea"
        />
      </div>

      <div>
        <label className="label">Next Steps</label>
        <textarea
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          rows={2}
          className="textarea focus-ring transition-soft"
          placeholder="e.g., Validate with 5 users, build MVP"
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn focus-ring transition-soft"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="btn btn-gradient focus-ring transition-soft"
        >
          Save Idea
        </button>
      </div>
    </form>
  )
}


