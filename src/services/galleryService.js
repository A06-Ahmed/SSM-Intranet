import { apiFetch } from './api.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function getBaseOrigin() {
  if (!API_BASE_URL) return ''
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return ''
  }
}

function toAbsoluteUrl(path) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const origin = getBaseOrigin()
  const cleanPath = path.replace(/^\/+/, '')
  return origin ? `${origin}/${cleanPath}` : `/${cleanPath}`
}

function toGalleryItem(item) {
  const images = Array.isArray(item.images) ? item.images.map(toAbsoluteUrl) : []
  const cover = toAbsoluteUrl(item.cover_image || item.image_url || images[0] || '')
  return {
    id: item.id,
    title: item.title,
    date: item.created_at,
    coverImage: cover,
    images,
  }
}

export async function getGalleryDemo() {
  const response = await apiFetch('/gallery')
  const items = response?.data?.items || response?.data || []
  return (items || []).map(toGalleryItem)
}

export async function createGallery(payload) {
  const formData = new FormData()
  formData.append('title', payload.title)
  formData.append('image', payload.image)

  const response = await apiFetch('/gallery', {
    method: 'POST',
    body: formData,
  })
  return response?.data || null
}

export async function updateGallery(id, payload) {
  void id
  void payload
  throw new Error('Update gallery not implemented')
}

export async function deleteGallery(id) {
  await apiFetch(`/gallery/${id}`, { method: 'DELETE' })
  return true
}
