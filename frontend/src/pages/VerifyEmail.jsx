import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('An error occurred during verification.');
        }
      });
  }, [token]);

  return (
    <div className="site-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px' }}>
        <h2>Email Verification</h2>
        <p style={{ margin: '1rem 0' }}>{message}</p>
        
        {status === 'success' && (
          <button className="btn primary" onClick={() => navigate('/signin')}>
            Go to Sign In
          </button>
        )}
        
        {status === 'error' && (
          <button className="btn ghost" onClick={() => navigate('/')}>
            Back to Home
          </button>
        )}
      </div>
    </div>
  );
}
