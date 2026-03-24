import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, initializing, user } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <div className="route-loading">Chargement...</div>
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          error: "Vous devez etre connecte pour acceder a cette page.",
        }}
      />
    )
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const roles = Array.isArray(user?.roles) ? user.roles.map((r) => r.name) : []
    const hasRole = roles.some((role) => allowedRoles.includes(role))
    if (!hasRole) {
      return <Navigate to="/home" replace />
    }
  }

  return children
}

export default ProtectedRoute
