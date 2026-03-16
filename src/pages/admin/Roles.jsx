import { useEffect, useState } from 'react'
import { createRole, deleteRole, getPermissions, getRoles } from '../../services/adminService.js'

function RolesAdmin() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [form, setForm] = useState({ name: '', description: '', permission_ids: [] })
  const [error, setError] = useState(null)

  async function load() {
    try {
      const [rolesRes, permsRes] = await Promise.all([getRoles(), getPermissions()])
      setRoles(rolesRes?.data?.items || [])
      setPermissions(permsRes?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des rÃ´les')
    }
  }

  useEffect(() => {
    load()
  }, [])

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function togglePermission(id) {
    setForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(id)
        ? prev.permission_ids.filter((p) => p !== id)
        : [...prev.permission_ids, id],
    }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await createRole(form)
      setForm({ name: '', description: '', permission_ids: [] })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de crÃ©ation rÃ´le')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer ce rÃ´le ?')) return
    await deleteRole(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>RÃ´les</h1>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input name="name" placeholder="Nom du rÃ´le" value={form.name} onChange={onChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
        <div className="admin-permissions">
          {permissions.map((perm) => (
            <label key={perm.id}>
              <input
                type="checkbox"
                checked={form.permission_ids.includes(perm.id)}
                onChange={() => togglePermission(perm.id)}
              />
              {perm.name}
            </label>
          ))}
        </div>
        <button type="submit">CrÃ©er</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button type="button" onClick={() => onDelete(role.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RolesAdmin
