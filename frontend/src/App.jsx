import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import MemberDashboard from './pages/MemberDashboard'
import './App.css'

const features = [
  ['Smart Catalog Search', 'Search by title, author, ISBN, or genre and filter by availability in seconds.'],
  ['Seamless Borrowing', 'Reserve, borrow, and renew books online with real-time availability tracking.'],
  ['Reservation System', 'Place holds on unavailable titles and get notified when they are ready.'],
  ['Member Dashboard', 'Track borrowing history, due dates, active reservations, and outstanding fines.'],
  ['Staff Tools', 'Manage inventory, returns, damage reports, and library circulation workflows.'],
  ['Fine Tracking', 'Automated overdue calculations with clear payment history and balances.'],
]

const steps = [
  ['Create your account', 'Register with your email and get the right experience for your role.'],
  ['Browse the catalog', 'Explore titles by author, genre, language, or availability.'],
  ['Borrow or reserve', 'Check out available copies or place a reservation for later.'],
  ['Return and repeat', 'Return on time, settle fines, and choose your next read.'],
]

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="site-page">
      <nav className="nav">
        <button className="brand-link" type="button" onClick={() => navigate('/')}>
          <span className="brand-mark">L</span>
          <span>Lehket <strong>Library</strong></span>
        </button>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#for-you">For you</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <button className="btn ghost" type="button" onClick={() => navigate('/signin')}>Sign in</button>
          <button className="btn primary" type="button" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Now open to all readers</p>
            <h1>Where <em>knowledge</em> finds its permanent home.</h1>
            <p className="hero-text">
              Lehket Library brings the timeless experience of a great library into the digital age - browse
              thousands of titles, manage borrowings, and rediscover the joy of reading.
            </p>
            <div className="hero-actions">
              <button className="btn primary large" type="button" onClick={() => navigate('/register')}>Start exploring</button>
              <a className="btn ghost large" href="#how-it-works">See how it works</a>
            </div>
            <div className="stats">
              <Stat value="12k+" label="Books catalogued" />
              <Stat value="4k+" label="Active readers" />
              <Stat value="98%" label="Satisfaction rate" />
            </div>
          </div>

          <div className="book-visual" aria-hidden="true">
            <div className="book-stack">
              {['The Republic', 'War & Peace', 'Cosmos', 'Crime', 'Meditations', 'Dune'].map((book, index) => (
                <span className={`book b${index + 1}`} key={book}>{book}</span>
              ))}
              <span className="shelf" />
            </div>
            <span className="floating-note note-left">24 new arrivals this week</span>
            <span className="floating-note note-right">Available now</span>
          </div>
        </section>

        <section className="section" id="features">
          <p className="section-label">What we offer</p>
          <h2>Everything a great library should have.</h2>
          <p className="section-sub">Lehket Library handles the details so readers and staff can focus on the books.</p>
          <div className="feature-grid">
            {features.map(([title, description], index) => (
              <article className="feature-card" key={title}>
                <span className="feature-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section toned" id="how-it-works">
          <p className="section-label">Simple by design</p>
          <h2>From registration to reading in minutes.</h2>
          <div className="steps-grid">
            {steps.map(([title, description], index) => (
              <article className="step-card" key={title}>
                <span>{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="for-you">
          <p className="section-label">Designed for everyone</p>
          <h2>Your role in the library.</h2>
          <div className="role-grid">
            <RoleCard
              title="Library Members"
              label="For readers"
              action="Join as a member"
              navigate={navigate}
              items={['Browse and search the complete catalog', 'Borrow up to your allowed limit', 'Reserve unavailable books', 'View due dates, fines, and history']}
            />
            <RoleCard
              title="Library Staff"
              label="For librarians"
              action="Staff sign in"
              navigate={navigate}
              items={['Manage catalog and inventory', 'Process returns and reports', 'Manage member accounts', 'Issue fines and payments']}
            />
          </div>
        </section>

        <section className="section testimonials" id="about">
          <p className="section-label">Reader voices</p>
          <h2>Loved by our community.</h2>
          <div className="quote-grid">
            <blockquote>The reservation system has been a game changer. I always know when a book is ready.</blockquote>
            <blockquote>The staff tools make circulation faster and keep our catalog accurate.</blockquote>
            <blockquote>The fine tracker is clear and transparent. No surprises at the desk anymore.</blockquote>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>Lehket Library</strong>
          <p>A modern library management system built for readers and librarians.</p>
        </div>
        <button className="btn primary" type="button" onClick={() => navigate('/register')}>Create free account</button>
      </footer>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function RoleCard({ title, label, items, action, navigate }) {
  return (
    <article className="role-card">
      <span>{label}</span>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <button className="btn primary" type="button" onClick={() => navigate(label === 'For readers' ? '/register' : '/signin')}>{action}</button>
    </article>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard/member" element={<MemberDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
