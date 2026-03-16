import { apiFetch } from './api.js'

export async function searchEmployees(query) {
  const q = (query || '').trim()
  if (!q) return []

  const response = await apiFetch(`/employees?search=${encodeURIComponent(q)}`)
  return response?.data?.items || []
}

export async function getEmployeeById(id) {
  if (!id) return null
  const response = await apiFetch(`/employees/${id}`)
  return response?.data || null
}
