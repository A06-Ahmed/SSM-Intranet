import { apiFetch } from './api.js'

const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo'

async function fetchGoogleProfile(accessToken) {
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error('Échec de récupération du profil Google')
  }

  const profile = await res.json()
  return {
    name: profile.name || '',
    email: profile.email || '',
    picture: profile.picture || '',
    sub: profile.sub || '',
    isAdmin: false,
    position: 'Collaborateur',
  }
}

export async function loginWithCredentials(email, password) {
  const payload = {
    email: (email || '').trim().toLowerCase(),
    password: (password || '').trim(),
  }

  const response = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const data = response?.data || {}

  return {
    user: data.user,
    token: data.access_token,
    refreshToken: data.refresh_token,
  }
}

export async function loginWithGoogle(accessToken) {
  if (!accessToken) {
    throw new Error('Jeton Google manquant')
  }

  const profile = await fetchGoogleProfile(accessToken)

  return {
    user: profile,
    token: accessToken,
  }
}

export async function getCurrentUser(token) {
  if (!token) return null
  try {
    const response = await apiFetch('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response?.data || null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
}
