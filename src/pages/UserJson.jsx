import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import users from '../data/users.json'
import { useAuth } from '../hooks/useAuth'

function UserJson() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated, logout } = useAuth()
  const [holidays, setHolidays] = useState([])
  const [isHolidaysLoading, setIsHolidaysLoading] = useState(true)
  const [holidaysError, setHolidaysError] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    const controller = new AbortController()

    async function fetchHolidays() {
      try {
        setIsHolidaysLoading(true)
        setHolidaysError('')

        const res = await fetch(
          'https://date.nager.at/api/v3/PublicHolidays/2026/MA',
          { signal: controller.signal }
        )

        if (!res.ok) {
          throw new Error('Erreur lors du chargement des jours fériés')
        }

        const data = await res.json()
        const arr = Array.isArray(data) ? data : []

        const mapped = arr.map((h) => ({
          localName: h && h.localName ? h.localName : '',
          name: h && h.name ? h.name : '',
          date: h && h.date ? h.date : '',
          countryCode: h && h.countryCode ? h.countryCode : '',
          types: Array.isArray(h && h.types) ? h.types.join(', ') : '',
        }))

        setHolidays(mapped)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('Erreur API jours fériés', err)
        setHolidaysError("Impossible de charger les jours fériés depuis l'API.")
        setHolidays([])
      } finally {
        setIsHolidaysLoading(false)
      }
    }

    fetchHolidays()

    return () => controller.abort()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User JSON (from AuthContext)</h2>
      <p>
        <strong>Name:</strong> {user?.name || 'N/A'}
      </p>
      <p>
        <strong>Email:</strong> {user?.email || 'N/A'}
      </p>
      <p>
        <strong>Google ID:</strong> {user?.sub || 'N/A'}
      </p>
      <p>
        <strong>Password:</strong> N/A
      </p>
      <p>
        <strong>Token:</strong> {token || 'N/A'}
      </p>
      <button onClick={handleLogout} style={{ marginBottom: '2rem' }}>Temporary Logout</button>

      <hr />

      <h3>Available Mock Users (For Testing)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
            <th>Email</th>
            <th>Mot de passe</th>
            <th>Nom</th>
            <th>Poste</th>
            <th>Accès admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0' }}>{u.email}</td>
              <td style={{ padding: '8px 0' }}>{u.password}</td>
              <td style={{ padding: '8px 0' }}>{u.name}</td>
              <td style={{ padding: '8px 0' }}>{u.position}</td>
              <td style={{ padding: '8px 0' }}>{u.isAdmin ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Jours fériés (API Nager – Maroc 2026)</h3>
      {isHolidaysLoading && (
        <p>Chargement des jours fériés depuis l'API...</p>
      )}
      {!isHolidaysLoading && holidaysError && (
        <p style={{ color: 'red' }}>{holidaysError}</p>
      )}
      {!isHolidaysLoading && !holidaysError && holidays.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
              <th>Nom local</th>
              <th>Nom (EN)</th>
              <th>Date</th>
              <th>Code pays</th>
              <th>Type(s)</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h, idx) => (
              <tr key={`${h.name}-${h.date}-${idx}`} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{h.localName}</td>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{h.name}</td>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{h.date}</td>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{h.countryCode}</td>
                <td style={{ padding: '8px 0', verticalAlign: 'top' }}>{h.types}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UserJson

