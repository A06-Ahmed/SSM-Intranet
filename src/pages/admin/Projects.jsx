import { useEffect, useMemo, useState } from 'react'
import { createProject, deleteProject, getProjects } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function ProjectsAdmin() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'projects', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'projects', 'read'), [roleNames])
  const canDelete = useMemo(() => hasPermission(roleNames, 'projects', 'delete'), [roleNames])

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
      setError(e?.message || 'Erreur de creation projet')
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

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="name" placeholder="Nom" value={form.name} onChange={onChange} />
          <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
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
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
                <td>
                  {canDelete ? (
                    <button type="button" onClick={() => onDelete(project.id)}>Supprimer</button>
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

export default ProjectsAdmin
