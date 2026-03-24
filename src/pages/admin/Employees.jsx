import { useEffect, useMemo, useState } from 'react'
import { createEmployee, deleteEmployee, getEmployees } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function EmployeesAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ matricule: '', position: '', department_id: '' })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'annuaire', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'annuaire', 'read'), [roleNames])
  const canDelete = useMemo(() => hasPermission(roleNames, 'annuaire', 'delete'), [roleNames])

  async function load() {
    try {
      const res = await getEmployees()
      setItems(res?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des employes')
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
      await createEmployee(form)
      setForm({ matricule: '', position: '', department_id: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de creation employe')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer cet employe ?')) return
    await deleteEmployee(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>Annuaire</h1>
      {error && <div className="admin-error">{error}</div>}

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="matricule" placeholder="Matricule" value={form.matricule} onChange={onChange} />
          <input name="position" placeholder="Poste" value={form.position} onChange={onChange} />
          <input name="department_id" placeholder="Department ID" value={form.department_id} onChange={onChange} />
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
              <th>Matricule</th>
              <th>Poste</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.matricule}</td>
                <td>{emp.position}</td>
                <td>
                  {canDelete ? (
                    <button type="button" onClick={() => onDelete(emp.id)}>Supprimer</button>
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

export default EmployeesAdmin
