import { apiFetch } from './api.js'

export async function getNotifications() {
  const response = await apiFetch('/notifications')
  return response?.data || []
}
