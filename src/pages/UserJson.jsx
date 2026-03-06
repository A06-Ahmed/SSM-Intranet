import { useNavigate, Navigate } from 'react-router-dom'

export const mockUsers = [
  {
    email: 'admin@smm.com',
    password: 'password123',
    name: 'Admin User',
    token: 'admin-token-987'
  },
  {
    email: 'user@smm.com',
    password: 'password123',
    name: 'Normal User',
    token: 'user-token-456'
  }
]

function UserJson() {
  const navigate = useNavigate()
  const stored = localStorage.getItem('user')
  const parsed = stored ? JSON.parse(stored) : null

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!parsed) {
    return <Navigate to="/login" state={{ error: "Vous devez être connecté pour accéder à cette page." }} replace />
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User JSON (from localStorage)</h2>
      <p>
        <strong>Name:</strong> {parsed.name || 'N/A'}
      </p>
      <p>
        <strong>Email:</strong> {parsed.email || 'N/A'}
      </p>
      <p>
        <strong>Google ID:</strong> {parsed.sub || 'N/A'}
      </p>
      <p>
        <strong>Password:</strong> {parsed.password || 'N/A'}
      </p>
      <p>
        <strong>Token:</strong> {parsed.token || 'N/A'}
      </p>
      <button onClick={handleLogout} style={{ marginBottom: '2rem' }}>Temporary Logout</button>

      <hr />

      <h3>Available Mock Users (For Testing)</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>
            <th>Email</th>
            <th>Password</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((u, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 0' }}>{u.email}</td>
              <td style={{ padding: '8px 0' }}>{u.password}</td>
              <td style={{ padding: '8px 0' }}>{u.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserJson

