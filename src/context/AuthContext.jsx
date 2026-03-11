import { createContext, useEffect, useMemo, useState } from 'react'
import { getCurrentUser as fetchCurrentUser, logout as authLogout } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function init() {
      const storedToken = localStorage.getItem('auth_token')
      if (!storedToken) {
        if (isMounted) {
          setInitializing(false)
        }
        return
      }

      setToken(storedToken)
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

  function login({ user: nextUser, token: nextToken }) {
    if (!nextToken) {
      throw new Error('Le jeton est requis pour la connexion')
    }
    setUser(nextUser || null)
    setToken(nextToken)
    localStorage.setItem('auth_token', nextToken)
  }

  function logout() {
    setUser(null)
    setToken(null)
    authLogout()
  }

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [user, token, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

