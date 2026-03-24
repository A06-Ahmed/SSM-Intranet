import { useEffect, useMemo, useState } from 'react'
import { createPermission, getPermissions } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function PermissionsAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '' })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'permissions', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'permissions', 'read'), [roleNames])

  async function load() {
    try {
      const res = await getPermissions()
      setItems(res?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des permissions')
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
      await createPermission(form)
      setForm({ name: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de creation permission')
    }
  }

  return (
    <div className="admin-page">
      <h1>Permissions</h1>

      {error && <div className="admin-error">{error}</div>}

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="name" placeholder="Nom de la permission" value={form.name} onChange={onChange} />
          <button type="submit">Creer</button>
        </form>
      ) : (
        <div className="admin-restricted">Acces restreint.</div>
      )}

      {!canRead ? (
        <div className="admin-restricted">Acces restreint.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
            </tr>
          </thead>
          <tbody>
            {items.map((perm) => (
              <tr key={perm.id}>
                <td>{perm.id}</td>
                <td>{perm.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default PermissionsAdmin
