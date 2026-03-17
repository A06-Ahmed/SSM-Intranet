import { apiFetch } from './api.js'

function toAnnouncement(item) {
  const priority = (item.priority_status || item.priority || 'Moyenne').toString()
  const isHigh = priority.toLowerCase().startsWith('h')

  return {
    id: item.id,
    title: item.title,
    description: item.content,
    date: item.published_at || item.created_at,
    severity: isHigh ? 'high' : 'medium',
    severityLabel: isHigh ? 'Haute' : 'Moyenne',
  }
}

export async function getAnnouncements() {
  const response = await apiFetch('/announcements')
  const items = response?.data?.items || response?.data || []
  return (items || []).map(toAnnouncement)
}
