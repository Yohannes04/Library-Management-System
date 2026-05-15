import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const roles = {
  member: {
    icon: 'B',
    name: 'Member',
    description: 'Browse and borrow books',
    badge: 'Member Portal',
    title: 'Welcome back',
    subtitle: 'Sign in to access your borrowing dashboard and catalog.',
    access: 'Standard access - Borrow up to 5 books',
    email: '',
    password: '',
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
    email: '',
    password: '',
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
    email: '',
    password: '',
    button: 'Sign in as Administrator',
    staffId: true,
    successTitle: 'Welcome, Administrator!',
    redirect: '/dashboard/admin',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const config = roles[role];
  const roleEntries = useMemo(() => Object.entries(roles), []);

  const selectRole = (nextRole) => {
    setRole(nextRole);
    setEmail('');
    setPassword('');
    setStaffId('');
    setError('');
    setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim()) return setError('Please enter your email address.');
    if (!password) return setError('Please enter your password.');
    if (config.staffId && !staffId.trim()) return setError('Please enter your Staff ID.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please enter a valid email address.');

    // Only implement Member login via backend for now
    if (role === 'member') {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password
        });
        
        // Store token and user details
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        navigate('/dashboard/member');
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An error occurred during login. Please try again.');
        }
      }
    } else {
      // Mock for staff/admin for now
      setError('Staff and Admin login not implemented yet.');
    }
  };

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
              <p>Welcome back, {success.name}. Redirecting to {config.redirect}...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className={`portal-badge ${role}`}>{config.badge}</span>
              <h2>{config.title}</h2>
              <p className="form-subtitle">{config.subtitle}</p>
              <div className={`access-note ${role}`}>{config.access}</div>

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
              </div>

              <button className={`submit-btn ${role}`} type="submit">{config.button}</button>
              {role !== 'admin' && <p className="register-prompt">Do not have an account? <a href="/register">Register now</a></p>}
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
