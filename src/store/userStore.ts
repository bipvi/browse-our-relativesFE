import { create } from 'zustand'
import { UserStore } from '@/types'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const initialState = {
  id: '',
  username: '',
  avatar: '',
  ruolo: '',
  token: '',
  favourites: [],
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  login: async (username, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Login fallito')
    const data = await res.json()

    // Salva token in localStorage e nello store
    localStorage.setItem('tokenKey', data.accessToken)
    set({ token: data.accessToken })
    document.cookie = `tokenKey=${data.accessToken}; path=/; SameSite=Lax`
    set({ token: data.accessToken })
    await get().fetchMe(data.accessToken)
    // Carica subito i dati utente
    await get().fetchMe(data.accessToken)
  },

  signUp: async (username, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Registrazione fallita')
  },

  fetchMe: async (token) => {
    const res = await fetch(`${API}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error('Errore nel recupero utente')
    const data = await res.json()
    set({
      id: data.id,
      username: data.username,
      avatar: data.avatar,
      ruolo: data.ruolo,
      favourites: data.favourites,
    })
  },

  addFavourite: async (id) => {
    const { token } = get()
    const res = await fetch(`${API}/user/me/fav?fav=${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Errore aggiunta preferito')
    const data = await res.json()
    set((state) => ({ favourites: [...state.favourites, data] }))
  },

  removeFavourite: async (id) => {
    const { token } = get()
    const res = await fetch(`${API}/user/me/fav?fav=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Errore rimozione preferito')
    set((state) => ({
      favourites: state.favourites.filter((f) => f.id !== id),
    }))
  },

  fetchFavourites: async () => {
    const { token } = get()
    const res = await fetch(`${API}/user/me/fav`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) throw new Error('Errore recupero preferiti')
    const data = await res.json()
    set({ favourites: data })
  },

  setTokenFromStorage: (token) => {
      document.cookie = `tokenKey=${token}; path=/; SameSite=Lax`
      set({ token })
  },

  logout: () => {
    localStorage.removeItem('tokenKey')
    document.cookie = 'tokenKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    set(initialState)
  },
}))