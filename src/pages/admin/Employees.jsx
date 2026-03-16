import { useEffect, useState } from 'react'
import { createEmployee, deleteEmployee, getEmployees } from '../../services/adminService.js'

function EmployeesAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ matricule: '', position: '', department_id: '' })
  const [error, setError] = useState(null)

  async function load() {
    try {
      const res = await getEmployees()
      setItems(res?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des employÃ©s')
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
      setError(e?.message || 'Erreur de crÃ©ation employÃ©')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer cet employÃ© ?')) return
    await deleteEmployee(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>EmployÃ©s</h1>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input name="matricule" placeholder="Matricule" value={form.matricule} onChange={onChange} />
        <input name="position" placeholder="Poste" value={form.position} onChange={onChange} />
        <input name="department_id" placeholder="Department ID" value={form.department_id} onChange={onChange} />
        <button type="submit">CrÃ©er</button>
      </form>

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
                <button type="button" onClick={() => onDelete(emp.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeesAdmin
