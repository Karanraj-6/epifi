import { useMemo, useState } from 'react';
import { createApi } from './services/api.js';
import AuthPage from './pages/AuthPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('notes_token') || '');
  const api = useMemo(() => createApi(token), [token]);

  function handleAuth(nextToken) {
    localStorage.setItem('notes_token', nextToken);
    setToken(nextToken);
  }

  function logout() {
    localStorage.removeItem('notes_token');
    setToken('');
  }

  if (!token) {
    return <AuthPage api={api} onAuth={handleAuth} />;
  }

  return <WorkspacePage api={api} onLogout={logout} />;
}
