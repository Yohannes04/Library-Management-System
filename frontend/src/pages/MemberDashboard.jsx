import { useNavigate } from 'react-router-dom';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Unauthorized Access</h2>
        <button className="btn primary" onClick={() => navigate('/signin')}>Go to Sign In</button>
      </div>
    );
  }

  return (
    <div className="site-page">
      <nav className="nav">
        <button className="brand-link" type="button" onClick={() => navigate('/')}>
          <span className="brand-mark">L</span>
          <span>Lehket <strong>Library</strong></span>
        </button>
        <div className="nav-actions">
          <button className="btn ghost" type="button" onClick={handleLogout}>Log out</button>
        </div>
      </nav>
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <section className="hero-section" style={{ textAlign: 'left', minHeight: 'auto', paddingTop: '2rem' }}>
          <div className="hero-copy">
            <h1>Welcome, <em>{user.FullName}</em>!</h1>
            <p className="hero-text">
              This is your member dashboard. From here, you can manage your borrowing history, 
              view reservations, and explore the catalog.
            </p>
            <div className="stats" style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
              <div>
                <strong style={{ fontSize: '2rem', display: 'block' }}>{user.MaxBooksAllowed}</strong>
                <span>Max Books Allowed</span>
              </div>
              <div>
                <strong style={{ fontSize: '2rem', display: 'block' }}>Member</strong>
                <span>Role Status</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
