const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

function buildUrl(path) {
  if (!path) return API_BASE_URL || '/'
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const baseRoot = API_BASE_URL.replace(/\/+$/, '')
  const base = baseRoot.endsWith('/api') ? baseRoot : `${baseRoot}/api`
  const cleanPath = path.replace(/^\/+/, '')
  return `${base}/${cleanPath}`
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('auth_token') || null
  const headers = new Headers(options.headers || {})

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  const hasBody = options.body !== undefined && options.body !== null
  if (hasBody && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  if (!response.ok) {
    let message = `Erreur API (${response.status})`
    try {
      const data = await response.json()
      if (data && typeof data.message === 'string') {
        message = data.message
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message)
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

