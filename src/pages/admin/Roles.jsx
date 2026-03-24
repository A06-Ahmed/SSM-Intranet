import { useEffect, useMemo, useState } from 'react'
import { createRole, deleteRole, getPermissions, getRoles } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function RolesAdmin() {
  const [items, setItems] = useState([])
  const [permissions, setPermissions] = useState([])
  const [form, setForm] = useState({ name: '', permission_ids: [] })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'roles', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'roles', 'read'), [roleNames])
  const canDelete = useMemo(() => hasPermission(roleNames, 'roles', 'delete'), [roleNames])

  async function load() {
    try {
      const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()])
      setItems(rolesRes?.data?.items || [])
      setPermissions(permsRes?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des roles')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function onTogglePermission(id) {
    setForm((prev) => {
      const exists = prev.permission_ids.includes(id)
      const nextIds = exists ? prev.permission_ids.filter((pid) => pid !== id) : [...prev.permission_ids, id]
      return { ...prev, permission_ids: nextIds }
    })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await createRole(form)
      setForm({ name: '', permission_ids: [] })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de creation role')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer ce role ?')) return
    await deleteRole(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>Roles</h1>

      {error && <div className="admin-error">{error}</div>}

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="name" placeholder="Nom du role" value={form.name} onChange={onChange} />
          <div className="admin-permissions">
            {permissions.map((perm) => (
              <label key={perm.id}>
                <input
                  type="checkbox"
                  checked={form.permission_ids.includes(perm.id)}
                  onChange={() => onTogglePermission(perm.id)}
                />
                {perm.name}
              </label>
            ))}
          </div>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  {canDelete ? (
                    <button type="button" onClick={() => onDelete(role.id)}>Supprimer</button>
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

export default RolesAdmin
