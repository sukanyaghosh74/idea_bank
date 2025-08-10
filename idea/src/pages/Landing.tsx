import type { ReactElement } from 'react'

export default function Landing(): ReactElement {
  return (
    <div className="landing">
      <header className="landing-nav">
        <div className="container landing-nav-inner">
          <div className="landing-brand">💡 Idea Bank</div>
          <div className="landing-actions">
            <a href="#app" className="btn btn-gradient">Open App</a>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="aurora" aria-hidden="true" />
        <div className="container hero-inner">
          <h1 className="hero-title">Turn Ideas into Action</h1>
          <p className="hero-sub">Collect, refine, and prioritize ideas with a beautiful, modern workspace.
          </p>
          <div className="hero-ctas">
            <a href="#app" className="btn btn-gradient">Get Started</a>
            <a href="#app" className="btn">Live Demo</a>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          {[
            {
              title: 'Collect',
              desc: 'Quickly add ideas with a clean, focused form and tags.'
            },
            {
              title: 'Manage',
              desc: 'Search and sort through a responsive card grid with badges.'
            },
            {
              title: 'Measure',
              desc: 'Export your ideas to JSON and track updates over time.'
            },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">✦</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">Built with React + TypeScript • Local-first or API-backed</div>
      </footer>
    </div>
  )
}


