import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuth } from '../auth';
import './AuthPages.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@canteen.local');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await authAPI.login(email.trim(), password);
      if (response?.user?.role !== 'admin') {
        setError('This portal is for admin accounts only.');
        return;
      }

      setAuth({ token: response.token, user: response.user });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Admin Login</h2>
          <p>Access Smart Canteen management dashboard.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Login as Admin'}
            </button>
            <button type="button" className="auth-link-btn" onClick={() => navigate('/user/login')}>
              Go to User Login
            </button>
          </div>
          <p className="auth-help">Default admin: admin@canteen.local / admin123</p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
