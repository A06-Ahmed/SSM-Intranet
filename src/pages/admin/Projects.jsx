import { useEffect, useState } from 'react'
import { createProject, deleteProject, getProjects } from '../../services/adminService.js'

function ProjectsAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)

  async function load() {
    try {
      const res = await getProjects()
      setItems(res?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des projets')
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
      await createProject(form)
      setForm({ name: '', description: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de crÃ©ation projet')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer ce projet ?')) return
    await deleteProject(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>Projets</h1>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input name="name" placeholder="Nom" value={form.name} onChange={onChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
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
          {items.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>
                <button type="button" onClick={() => onDelete(project.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectsAdmin
