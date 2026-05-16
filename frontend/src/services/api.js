const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body.message || 'Request failed';
    throw new Error(message);
  }

  return body;
}

export function createApi(token) {
  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    return parseResponse(response);
  }

  return {
    register: (payload) => request('/register', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
    listNotes: () => request('/notes'),
    getNote: (id) => request(`/notes/${id}`),
    createNote: (payload) => request('/notes', { method: 'POST', body: JSON.stringify(payload) }),
    updateNote: (id, payload) => request(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    deleteNote: (id) => request(`/notes/${id}`, { method: 'DELETE' }),
    shareNote: (id, payload) => request(`/notes/${id}/share`, { method: 'POST', body: JSON.stringify(payload) }),
    setFavorite: (id, isFavorite) => request(`/notes/${id}/favorite`, {
      method: 'PATCH',
      body: JSON.stringify({ is_favorite: isFavorite })
    }),
    search: (q) => request(`/search?q=${encodeURIComponent(q)}`),
    about: () => request('/about')
  };
}
