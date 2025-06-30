'use client';

let token = null;

export function setToken(newToken) {
  token = newToken;
  localStorage.setItem('token', newToken);
}

export function getToken() {
  if (!token) {
    token = localStorage.getItem('token');
  }
  return token;
}

export async function api(path, options = {}) {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`;

  const headers = {
    'Content-Type': 'application/json',
    ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
  };

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errText = 'Erro na requisição';

    try {
      const json = await res.json();
      errText = json?.detail || errText;

      if (Array.isArray(json.detail)) {
        errText = json.detail.map(e => e.msg).join(', ');
      }

      if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    } catch (_) {}

    throw new Error(errText);
  }

  if (res.status === 204) return null;

  return res.json();
}
