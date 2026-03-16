import { useEffect, useState } from 'react'
import { createPermission, getPermissions } from '../../services/adminService.js'

function PermissionsAdmin() {
  const [permissions, setPermissions] = useState([])
  const [form, setForm] = useState({ name: '', module: '' })
  const [error, setError] = useState(null)

  async function load() {
    try {
      const res = await getPermissions()
      setPermissions(res?.data?.items || [])
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
      setForm({ name: '', module: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de crÃ©ation permission')
    }
  }

  return (
    <div className="admin-page">
      <h1>Permissions</h1>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input name="name" placeholder="Nom (ex: users.read)" value={form.name} onChange={onChange} />
        <input name="module" placeholder="Module (ex: users)" value={form.module} onChange={onChange} />
        <button type="submit">CrÃ©er</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Module</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((perm) => (
            <tr key={perm.id}>
              <td>{perm.id}</td>
              <td>{perm.name}</td>
              <td>{perm.module}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PermissionsAdmin
