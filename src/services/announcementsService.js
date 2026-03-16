import { apiFetch } from './api.js'

function toAnnouncement(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.content,
    date: item.published_at || item.created_at,
    severity: 'medium',
    severityLabel: 'Moyenne',
  }
}

export async function getAnnouncements() {
  const response = await apiFetch('/announcements')
  const items = response?.data?.items || response?.data || []
  return (items || []).map(toAnnouncement)
}
