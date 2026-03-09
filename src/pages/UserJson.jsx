import { useNavigate, Navigate } from 'react-router-dom'

export const mockUsers = [
  {
    email: 'direction@smm.ma',
    password: 'direction123',
    name: 'Youssef El Amrani',
    position: 'Directeur Général',
    token: 'admin-token-987',
    isAdmin: true,
  },
  {
    email: 'rh@smm.ma',
    password: 'rh123',
    name: 'Salma Benali',
    position: 'Responsable Ressources Humaines',
    token: 'rh-token-456',
    isAdmin: true,
  },
  {
    email: 'compta@smm.ma',
    password: 'compta123',
    name: 'Omar Alaoui',
    position: 'Responsable Comptabilité',
    token: 'compta-token-789',
    isAdmin: false,
  },
  {
    email: 'chef.projet@smm.ma',
    password: 'projet123',
    name: 'Hicham Berrada',
    position: 'Chef de Projet',
    token: 'projet-token-321',
    isAdmin: false,
  },
  {
    email: 'employe@smm.ma',
    password: 'employe123',
    name: 'Khadija Zahraoui',
    position: 'Employée Administrative',
    token: 'employe-token-654',
    isAdmin: false,
  },
  {
    email: 'stagiaire@smm.ma',
    password: 'stagiaire123',
    name: 'Ayoub Tazi',
    position: 'Stagiaire Communication',
    token: 'stagiaire-token-987',
    isAdmin: false,
  },
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
            <th>Mot de passe</th>
            <th>Nom</th>
            <th>Poste</th>
            <th>Accès admin</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((u, idx) => (
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
    </div>
  )
}

export default UserJson

