import React, { useState } from 'react';

export default function AuthPage({ api, onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      if (mode === 'register') {
        await api.register(form);
        setMode('login');
        setMessage('Account created. Sign in to continue.');
      } else {
        const data = await api.login(form);
        onAuth(data.access_token);
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-hero">
        <div className="hero-visual">
          <div className="abstract-shape"></div>
          <div className="abstract-shape-2"></div>
        </div>
        <div className="hero-text">
          <p className="eyebrow">Personal notes</p>
          <h1>Keep your ideas close and share the useful ones.</h1>
        </div>
      </div>
      
      <div className="auth-container">
        <form onSubmit={submit} className="auth-form glass">
          <div className="segmented" aria-label="Authentication mode">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
              Login
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>
              Register
            </button>
          </div>

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              autoComplete="email"
              required
              placeholder="name@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'register' ? 8 : 1}
              required
              placeholder="••••••••"
            />
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary-action" type="submit" disabled={busy}>
            {busy ? 'Working...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  );
}
