import { useMemo, useState } from 'react'
import './App.css'

const roles = {
  member: {
    icon: 'B',
    name: 'Member',
    description: 'Browse and borrow books',
    badge: 'Member Portal',
    title: 'Welcome back',
    subtitle: 'Sign in to access your borrowing dashboard and catalog.',
    access: 'Standard access - Borrow up to 5 books',
    email: 'jane@uni.edu',
    password: 'pass123',
    button: 'Sign in as Member',
    staffId: false,
    successTitle: 'Welcome back, Reader!',
    redirect: '/dashboard/member',
  },
  staff: {
    icon: 'S',
    name: 'Librarian / Staff',
    description: 'Manage catalog and circulation',
    badge: 'Staff Portal',
    title: 'Staff sign in',
    subtitle: 'Access the circulation desk, inventory, and member management tools.',
    access: 'Staff access - Catalog and circulation management',
    email: 'staff@library.com',
    password: 'pass123',
    button: 'Sign in as Staff',
    staffId: true,
    successTitle: 'Welcome, Librarian!',
    redirect: '/dashboard/staff',
  },
  admin: {
    icon: 'A',
    name: 'Administrator',
    description: 'Full system access',
    badge: 'Administrator Portal',
    title: 'Admin sign in',
    subtitle: 'Manage users, roles, fine types, and system settings.',
    access: 'Administrator access - Full system control',
    email: 'admin@library.com',
    password: 'admin123',
    button: 'Sign in as Administrator',
    staffId: true,
    successTitle: 'Welcome, Administrator!',
    redirect: '/dashboard/admin',
  },
}

const mockUsers = [
  { email: 'jane@uni.edu', password: 'pass123', role: 'member', name: 'Jane Doe' },
  { email: 'bob@uni.edu', password: 'pass123', role: 'member', name: 'Bob Smith' },
  { email: 'staff@library.com', password: 'pass123', role: 'staff', name: 'Alex Johnson', staffId: 'STAFF-001' },
  { email: 'admin@library.com', password: 'admin123', role: 'admin', name: 'System Admin', staffId: 'ADMIN-001' },
]

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

function App() {
  const [path, setPath] = useState(window.location.pathname)

  const navigate = (to) => {
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isSignin = path === '/signin' || path === '/login'

  return isSignin ? <SignInPage navigate={navigate} /> : <LandingPage navigate={navigate} />
}

function LandingPage({ navigate }) {
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
          <button className="btn primary" type="button" onClick={() => navigate('/signin')}>Get started</button>
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
              <button className="btn primary large" type="button" onClick={() => navigate('/signin')}>Start exploring</button>
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
        <button className="btn primary" type="button" onClick={() => navigate('/signin')}>Create free account</button>
      </footer>
    </div>
  )
}

function SignInPage({ navigate }) {
  const [role, setRole] = useState('member')
  const [email, setEmail] = useState(roles.member.email)
  const [password, setPassword] = useState('')
  const [staffId, setStaffId] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  const config = roles[role]
  const roleEntries = useMemo(() => Object.entries(roles), [])

  const selectRole = (nextRole) => {
    setRole(nextRole)
    setEmail(roles[nextRole].email)
    setPassword('')
    setStaffId('')
    setError('')
    setSuccess(null)
  }

  const fillDemo = () => {
    setEmail(config.email)
    setPassword(config.password)
    setStaffId(role === 'staff' ? 'STAFF-001' : role === 'admin' ? 'ADMIN-001' : '')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!email.trim()) return setError('Please enter your email address.')
    if (!password) return setError('Please enter your password.')
    if (config.staffId && !staffId.trim()) return setError('Please enter your Staff ID.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.')

    const user = mockUsers.find((item) => item.email === email && item.password === password && item.role === role)
    if (!user) return setError('Invalid email, password, or selected role.')
    if (config.staffId && user.staffId?.toLowerCase() !== staffId.toLowerCase()) {
      return setError('Staff ID does not match our records.')
    }

    setSuccess(user)
  }

  return (
    <main className="signin-page">
      <section className="signin-left">
        <button className="brand-link inverted" type="button" onClick={() => navigate('/')}>
          <span className="brand-mark">L</span>
          <span>Lehket Library</span>
        </button>
        <div>
          <h1>Sign in to your <em>library account.</em></h1>
          <p>Select your role below to access the right portal and permissions.</p>
        </div>
        <div className="role-selector">
          {roleEntries.map(([key, item]) => (
            <button className={`role-option ${role === key ? 'selected' : ''}`} type="button" key={key} onClick={() => selectRole(key)}>
              <span className="role-avatar">{item.icon}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}
        </div>
        <blockquote>"A library is not a luxury but one of the necessities of life."</blockquote>
      </section>

      <section className="signin-right">
        <button className="back-link" type="button" onClick={() => navigate('/')}>Back to home</button>
        <div className="form-shell">
          {success ? (
            <div className="success-panel">
              <span className="success-mark">OK</span>
              <h2>{config.successTitle}</h2>
              <p>Welcome back, {success.name}. In production, this would redirect to {config.redirect}.</p>
              <button className="btn primary" type="button" onClick={() => setSuccess(null)}>Sign in again</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className={`portal-badge ${role}`}>{config.badge}</span>
              <h2>{config.title}</h2>
              <p className="form-subtitle">{config.subtitle}</p>
              <div className={`access-note ${role}`}>{config.access}</div>
              <button className="demo-hint" type="button" onClick={fillDemo}>
                Demo: {config.email} / {config.password}
              </button>

              {error && <div className="error-msg">{error}</div>}

              <label>
                Email address
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" />
              </label>
              <label>
                Password
                <div className="password-row">
                  <input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              {config.staffId && (
                <label>
                  Staff ID
                  <input value={staffId} onChange={(event) => setStaffId(event.target.value)} type="text" placeholder={role === 'admin' ? 'ADMIN-001' : 'STAFF-001'} />
                </label>
              )}

              <div className="form-row">
                <label className="checkbox-row">
                  <input checked={remember} onChange={(event) => setRemember(event.target.checked)} type="checkbox" />
                  Remember me
                </label>
                <a href="/forgot-password">Forgot password?</a>
              </div>

              <button className={`submit-btn ${role}`} type="submit">{config.button}</button>
              {role !== 'admin' && <p className="register-prompt">Do not have an account? <a href="/register">Register now</a></p>}
            </form>
          )}
        </div>
      </section>
    </main>
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
      <button className="btn primary" type="button" onClick={() => navigate('/signin')}>{action}</button>
    </article>
  )
}

export default App
