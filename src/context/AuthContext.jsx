import { createContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../services/api.js'
import { getCurrentUser as fetchCurrentUser, logout as authLogout } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function init() {
      const storedToken = localStorage.getItem('auth_token')
      const storedRefreshToken = localStorage.getItem('refresh_token')
      if (!storedToken) {
        if (isMounted) {
          setInitializing(false)
        }
        return
      }

      setToken(storedToken)
      setRefreshToken(storedRefreshToken)
      try {
        const currentUser = await fetchCurrentUser(storedToken)
        if (!isMounted) return
        setUser(currentUser)
      } finally {
        if (isMounted) {
          setInitializing(false)
        }
      }
    }

    init()

    return () => {
      isMounted = false
    }
  }, [])

  function login({ user: nextUser, token: nextToken, refreshToken: nextRefreshToken }) {
    if (!nextToken) {
      throw new Error('Le jeton est requis pour la connexion')
    }
    setUser(nextUser || null)
    setToken(nextToken)
    setRefreshToken(nextRefreshToken || null)
    localStorage.setItem('auth_token', nextToken)
    if (nextRefreshToken) {
      localStorage.setItem('refresh_token', nextRefreshToken)
    }
  }

  async function logout() {
    setUser(null)
    setToken(null)
    setRefreshToken(null)
    const storedRefresh = localStorage.getItem('refresh_token')
    if (storedRefresh) {
      try {
        await apiFetch('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: storedRefresh }),
        })
      } catch {
        // ignore logout errors
      }
    }
    authLogout()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      initializing,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, refreshToken, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
