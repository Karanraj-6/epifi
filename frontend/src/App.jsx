import React, { useMemo, useState } from 'react';
import { createApi } from './services/api.js';
import AuthPage from './pages/AuthPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ToastContainer from './components/ToastContainer.jsx';

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

  const content = !token ? (
    <AuthPage api={api} onAuth={handleAuth} />
  ) : (
    <WorkspacePage api={api} onLogout={logout} />
  );

  return (
    <ToastProvider>
      {content}
      <ToastContainer />
    </ToastProvider>
  );
}
