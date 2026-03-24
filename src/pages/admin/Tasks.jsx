import { useEffect, useMemo, useState } from 'react'
import { createTask, deleteTask, getProjects, getTasks } from '../../services/adminService.js'
import { useAuth } from '../../hooks/useAuth'
import { hasPermission } from '../../utils/permissions.js'

function TasksAdmin() {
  const [items, setItems] = useState([])
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ name: '', project_id: '' })
  const [error, setError] = useState(null)
  const { roleNames } = useAuth()

  const canCreate = useMemo(() => hasPermission(roleNames, 'tasks', 'create'), [roleNames])
  const canRead = useMemo(() => hasPermission(roleNames, 'tasks', 'read'), [roleNames])
  const canDelete = useMemo(() => hasPermission(roleNames, 'tasks', 'delete'), [roleNames])

  async function load() {
    try {
      const [tasksRes, projectsRes] = await Promise.all([getTasks(), getProjects()])
      setItems(tasksRes?.data?.items || [])
      setProjects(projectsRes?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des taches')
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
      await createTask(form)
      setForm({ name: '', project_id: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de creation tache')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer cette tache ?')) return
    await deleteTask(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>Taches</h1>
      {error && <div className="admin-error">{error}</div>}

      {canCreate ? (
        <form className="admin-form" onSubmit={onSubmit}>
          <input name="name" placeholder="Nom" value={form.name} onChange={onChange} />
          <select name="project_id" value={form.project_id} onChange={onChange}>
            <option value="">Selectionner un projet</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
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
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Projet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.name}</td>
                <td>{task.project?.name}</td>
                <td>
                  {canDelete ? (
                    <button type="button" onClick={() => onDelete(task.id)}>Supprimer</button>
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

export default TasksAdmin
