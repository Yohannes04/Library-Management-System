import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    studentId: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(null);

    const { fullName, email, password, studentId } = formData;

    if (!fullName || !email || !password || !studentId) {
      return setError('Please fill out all required fields.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setError('Please enter a valid email address.');
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      setSuccess(response.data.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during registration. Please try again.');
      }
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
          <h1>Join our <em>library community.</em></h1>
          <p>Register as a member to start browsing, borrowing, and reserving books from our extensive catalog.</p>
        </div>
        <blockquote>"The only thing that you absolutely have to know, is the location of the library."</blockquote>
      </section>

      <section className="signin-right">
        <button className="back-link" type="button" onClick={() => navigate('/')}>Back to home</button>
        <div className="form-shell">
          {success ? (
            <div className="success-panel">
              <span className="success-mark">OK</span>
              <h2>Registration Complete</h2>
              <p>{success}</p>
              <button className="btn primary" type="button" onClick={() => navigate('/signin')}>Go to Sign In</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className="portal-badge member">Member Registration</span>
              <h2>Create your account</h2>
              <p className="form-subtitle">Fill in your details to register as a library member.</p>

              {error && <div className="error-msg">{error}</div>}

              <label>
                Full Name *
                <input name="fullName" value={formData.fullName} onChange={handleChange} type="text" placeholder="Jane Doe" required />
              </label>

              <label>
                Email address *
                <input name="email" value={formData.email} onChange={handleChange} type="email" autoComplete="email" placeholder="you@example.com" required />
              </label>
              
              <label>
                Password *
                <div className="password-row">
                  <input name="password" value={formData.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a strong password" required />
                  <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
                </div>
              </label>

              <label>
                Student ID *
                <input name="studentId" value={formData.studentId} onChange={handleChange} type="text" placeholder="e.g. STU-12345" required />
              </label>

              <label>
                Department (Optional)
                <input name="department" value={formData.department} onChange={handleChange} type="text" placeholder="e.g. Computer Science" />
              </label>

              <button className="submit-btn member" type="submit">Register as Member</button>
              <p className="register-prompt">Already have an account? <button type="button" className="link-button" onClick={() => navigate('/signin')}>Sign in</button></p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
