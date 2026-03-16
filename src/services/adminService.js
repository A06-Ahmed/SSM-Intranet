import { apiFetch } from './api.js'

export function getUsers() {
  return apiFetch('/admin/users')
}

export function createUser(payload) {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateUser(id, payload) {
  return apiFetch(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteUser(id) {
  return apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
}

export function getRoles() {
  return apiFetch('/admin/roles')
}

export function createRole(payload) {
  return apiFetch('/admin/roles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateRole(id, payload) {
  return apiFetch(`/admin/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteRole(id) {
  return apiFetch(`/admin/roles/${id}`, { method: 'DELETE' })
}

export function getPermissions() {
  return apiFetch('/admin/permissions')
}

export function createPermission(payload) {
  return apiFetch('/admin/permissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getEmployees() {
  return apiFetch('/admin/employees')
}

export function createEmployee(payload) {
  return apiFetch('/admin/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateEmployee(id, payload) {
  return apiFetch(`/admin/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteEmployee(id) {
  return apiFetch(`/admin/employees/${id}`, { method: 'DELETE' })
}

export function getProjects() {
  return apiFetch('/projects')
}

export function createProject(payload) {
  return apiFetch('/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateProject(id, payload) {
  return apiFetch(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteProject(id) {
  return apiFetch(`/projects/${id}`, { method: 'DELETE' })
}

export function getTasks() {
  return apiFetch('/tasks')
}

export function createTask(payload) {
  return apiFetch('/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateTask(id, payload) {
  return apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' })
}
