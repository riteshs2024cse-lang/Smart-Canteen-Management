import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { setAuth } from '../auth';
import './AuthPages.css';

function UserLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    userId: '',
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [resetForm, setResetForm] = useState({
    phone: '',
    code: '',
    newPassword: ''
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    const response = await authAPI.login(form.email.trim(), form.password);
    if (response?.user?.role !== 'user') {
      throw new Error('This portal is for user accounts only.');
    }
    setAuth({ token: response.token, user: response.user });
    navigate('/user/preorders', { replace: true });
  };

  const handleForgotPassword = async () => {
    if (!otpRequested) {
      const response = await authAPI.forgotPassword(resetForm.phone.trim());
      setOtpRequested(true);
      setInfo(response?.message || 'OTP sent to your phone. Enter OTP and new password.');

      const generatedOtp = response?.devResetCode || '';
      if (generatedOtp) {
        setDevOtp(generatedOtp);
        setResetForm((prev) => ({ ...prev, code: generatedOtp }));
      }
      return;
    }

    const response = await authAPI.resetPassword(
      resetForm.phone.trim(),
      resetForm.code.trim(),
      resetForm.newPassword
    );

    setMode('login');
    setOtpRequested(false);
    setResetForm({ phone: '', code: '', newPassword: '' });
    setInfo(response?.message || 'Password reset successful. Please login now.');
    setDevOtp('');
  };

  const handleRegister = async () => {
    await authAPI.register({
      userId: form.userId.trim(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password
    });
    setMode('login');
    setError('Registration complete. Please login now.');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setInfo('');

    try {
      setLoading(true);
      if (mode === 'login') {
        await handleLogin();
      } else if (mode === 'forgot') {
        await handleForgotPassword();
      } else {
        await handleRegister();
      }
    } catch (err) {
      setError(err?.error || err?.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            {mode === 'login'
              ? 'User Login'
              : mode === 'forgot'
                ? 'Forgot Password'
                : 'Create User Account'}
          </h2>
          <p>Use this portal only for meal pre-orders.</p>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {mode === 'register' && (
            <>
              <label>
                User ID
                <input name="userId" value={form.userId} onChange={onChange} required />
              </label>
              <label>
                Full Name
                <input name="name" value={form.name} onChange={onChange} required />
              </label>
              <label>
                Phone
                <input name="phone" value={form.phone} onChange={onChange} />
              </label>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <label>
                Phone
                <input name="phone" value={resetForm.phone} onChange={(e) => setResetForm((prev) => ({ ...prev, phone: e.target.value }))} required />
              </label>

              {otpRequested && (
                <>
                  <label>
                    OTP Code
                    <input name="code" value={resetForm.code} onChange={(e) => setResetForm((prev) => ({ ...prev, code: e.target.value }))} required />
                  </label>
                  <label>
                    New Password
                    <input type="password" name="newPassword" value={resetForm.newPassword} onChange={(e) => setResetForm((prev) => ({ ...prev, newPassword: e.target.value }))} required />
                  </label>
                </>
              )}
            </>
          )}

          {mode !== 'forgot' && (
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={onChange} required />
            </label>
          )}

          {mode !== 'forgot' && (
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={onChange} required />
            </label>
          )}

          {error && <p className="auth-error">{error}</p>}

          <div className="auth-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Login as User'
                  : mode === 'forgot'
                    ? otpRequested
                      ? 'Reset Password'
                      : 'Send OTP'
                    : 'Register User'}
            </button>
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setError('');
                setInfo('');
                setOtpRequested(false);
                setDevOtp('');
                setMode((prev) => (prev === 'register' ? 'login' : 'register'));
              }}
            >
                        {info && <p className="auth-info">{info}</p>}
                        {mode === 'forgot' && otpRequested && devOtp && (
                          <p className="auth-info">Dev OTP: <strong>{devOtp}</strong></p>
                        )}
              {mode === 'register' ? 'Already have account' : 'Create account'}
            </button>
          </div>

          {mode === 'login' && (
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setError('');
                setInfo('');
                setOtpRequested(false);
                setDevOtp('');
                setResetForm({ phone: '', code: '', newPassword: '' });
                setMode('forgot');
              }}
            >
              Forgot password?
            </button>
          )}

          {mode === 'forgot' && (
            <button
              type="button"
              className="auth-link-btn"
              onClick={() => {
                setError('');
                setInfo('');
                setOtpRequested(false);
                setDevOtp('');
                setMode('login');
              }}
            >
              Back to login
            </button>
          )}

          <button type="button" className="auth-link-btn" onClick={() => navigate('/admin/login')}>
            Go to Admin Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;
