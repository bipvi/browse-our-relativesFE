// Tutte le chiamate API centralizzate qui
// Sostituisce le action Redux con semplici funzioni async

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Helper ────────────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export const loginApi = (username: string, password: string) =>
  apiFetch<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const registerApi = (username: string, password: string) =>
  apiFetch<{ accessToken: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

// ─── Utente ────────────────────────────────────────────────────────────────

export const getMeApi = (token: string) =>
  apiFetch("/user/me", { headers: authHeaders(token) });

// ─── Preferiti ─────────────────────────────────────────────────────────────

export const getFavouritesApi = (token: string) =>
  apiFetch("/user/me/fav", { headers: authHeaders(token) });

export const addFavouriteApi = (id: string, token: string) =>
  apiFetch(`/user/me/fav?fav=${id}`, {
    method: "POST",
    headers: authHeaders(token),
  });

export const removeFavouriteApi = (id: string, token: string) =>
  apiFetch(`/user/me/fav?fav=${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

// ─── Item / Tassonomia ─────────────────────────────────────────────────────

export const getItemApi = (itemId: string, token: string) =>
  apiFetch(`/item/${itemId}`, { headers: authHeaders(token) });

export const getTaxonApi = (tipo: string, id: string, token: string) =>
  apiFetch(`/${tipo.toLowerCase()}/${id}`, { headers: authHeaders(token) });

export const getRandomItemApi = (token: string) =>
  apiFetch("/item/exploreRandomly", { headers: authHeaders(token) });
