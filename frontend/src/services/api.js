const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function parseResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body.message || 'Request failed';
    throw new Error(message);
  }

  // If it's a list response with pagination headers, return them along with the body
  const totalCount = response.headers.get('X-Total-Count');
  if (totalCount !== null) {
    return {
      data: body,
      total: parseInt(totalCount, 10)
    };
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
    listNotes: (page = 1, limit = 20) => request(`/notes?page=${page}&limit=${limit}`),
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
    listSharedNotes: () => request('/notes/shared'),
    improveNote: (payload) => request('/notes/improve', { method: 'POST', body: JSON.stringify(payload) }),
    about: () => request('/about')
  };
}
