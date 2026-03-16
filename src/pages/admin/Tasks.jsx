import { useEffect, useState } from 'react'
import { createTask, deleteTask, getProjects, getTasks } from '../../services/adminService.js'

function TasksAdmin() {
  const [items, setItems] = useState([])
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState({ title: '', project_id: '', description: '' })
  const [error, setError] = useState(null)

  async function load() {
    try {
      const [tasksRes, projectsRes] = await Promise.all([getTasks(), getProjects()])
      setItems(tasksRes?.data?.items || [])
      setProjects(projectsRes?.data?.items || [])
    } catch (e) {
      setError(e?.message || 'Erreur de chargement des tÃ¢ches')
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
      setForm({ title: '', project_id: '', description: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Erreur de crÃ©ation tÃ¢che')
    }
  }

  async function onDelete(id) {
    if (!window.confirm('Supprimer cette tÃ¢che ?')) return
    await deleteTask(id)
    load()
  }

  return (
    <div className="admin-page">
      <h1>TÃ¢ches</h1>
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={onSubmit}>
        <input name="title" placeholder="Titre" value={form.title} onChange={onChange} />
        <select name="project_id" value={form.project_id} onChange={onChange}>
          <option value="">Projet</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
        <button type="submit">CrÃ©er</button>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Projet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.title}</td>
              <td>{task.project_id}</td>
              <td>
                <button type="button" onClick={() => onDelete(task.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TasksAdmin
