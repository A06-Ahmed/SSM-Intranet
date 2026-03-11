import users from '../data/users.json'

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
  const trimmedEmail = (email || '').trim().toLowerCase()
  const trimmedPassword = (password || '').trim()

  const user = users.find(
    (u) =>
      (u.email || '').toLowerCase() === trimmedEmail &&
      (u.password || '') === trimmedPassword,
  )

  if (!user) {
    throw new Error('Email ou mot de passe invalide')
  }

  const safeUser = {
    name: user.name,
    email: user.email,
    position: user.position,
    isAdmin: !!user.isAdmin,
  }

  return {
    user: safeUser,
    token: user.token,
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

  const fromDemo = users.find((u) => u.token === token)
  if (fromDemo) {
    return {
      name: fromDemo.name,
      email: fromDemo.email,
      position: fromDemo.position,
      isAdmin: !!fromDemo.isAdmin,
    }
  }

  try {
    const googleProfile = await fetchGoogleProfile(token)
    return googleProfile
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('auth_token')
}

