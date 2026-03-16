import { apiFetch } from './api.js'

function toNewsItem(item) {
  return {
    id: item.id,
    shortTitle: item.title,
    title: item.title,
    subtitle: '',
    image: item.image_url || '',
    publishedAt: item.published_at || item.created_at,
    content: item.content ? [item.content] : [],
  }
}

export async function getNewsDemo() {
  const response = await apiFetch('/news')
  const items = response?.data?.items || response?.data || []
  return (items || []).map(toNewsItem)
}

export async function createNews(payload) {
  const response = await apiFetch('/news', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response?.data || null
}

export async function updateNews(id, payload) {
  const response = await apiFetch(`/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
  return response?.data || null
}

export async function deleteNews(id) {
  await apiFetch(`/news/${id}`, { method: 'DELETE' })
  return true
}
