import { useEffect, useMemo, useState } from 'react'
import { createUser, deleteUser, getRoles, getUsers } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function UsersAdmin() {
  const [items, setItems] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'users', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'users', 'read'), [roleNames])
  const canDelete = useMemo(() => hasPermission(roleNames, 'users', 'delete'), [roleNames])

  async function load() {
    setLoading(true)
    try {
      const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()])
      setItems(usersRes?.data?.items || [])
      setRoles(rolesRes?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await createUser(form)
      setForm({ first_name: '', last_name: '', email: '', password: '', role_id: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de creation utilisateur')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    await deleteUser(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>Utilisateurs</h1>

      {error && <div className="admin-error">{error}</div>}

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="first_name" placeholder="Prenom" value={form.first_name} onChange={onChange} />
          <input name="last_name" placeholder="Nom" value={form.last_name} onChange={onChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={onChange} />
          <input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={onChange} />
          <select name="role_id" value={form.role_id} onChange={onChange}>
            <option value="">Selectionner un role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button type="submit">Creer</button>
        </form>
      ) : (
        <div className="admin-restricted">Acces restreint.</div>
      )}

      {!canRead ? (
        <div className="admin-restricted">Acces restreint.</div>
      ) : loading ? (
        <div>Chargement...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.last_name}</td>
                <td>{user.email}</td>
                <td>{(user.roles || []).map((r) => r.name).join(', ')}</td>
                <td>
                  {canDelete ? (
                    <button type="button" onClick={() => onDelete(user.id)}>Supprimer</button>
                  ) : (
                    <span className="admin-restricted">Acces restreint</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsersAdmin
