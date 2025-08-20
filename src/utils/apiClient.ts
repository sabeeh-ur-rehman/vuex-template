const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

type RequestOptions = RequestInit & {
  params?: Record<string, unknown>
}

const buildQuery = (params?: Record<string, unknown>) => {
  if (!params) return ''

  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) query.append(key, String(value))
  })

  const qs = query.toString()
  return qs ? `?${qs}` : ''
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { params, headers, ...init } = options

  // Normalize to a Headers object so we can safely set keys with proper types.
  const fetchHeaders = new Headers(headers as HeadersInit)

  // Attach JWT if available (browser only)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) fetchHeaders.set('Authorization', `Bearer ${token}`)
  }

  // Auto JSON content-type unless sending FormData or caller already set it
  const hasBody = init.body != null
  const isFormData = typeof FormData !== 'undefined' && hasBody && init.body instanceof FormData
  if (hasBody && !isFormData && !fetchHeaders.has('Content-Type')) {
    fetchHeaders.set('Content-Type', 'application/json')
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}${buildQuery(params)}`, {
    ...init,
    headers: fetchHeaders,
    credentials: 'include'
  })

  if (!res.ok) {
    // Try to surface JSON error bodies nicely; fall back to text.
    let message = ''
    try {
      const data = await res.json()
      message = (data && (data.message || data.error)) || JSON.stringify(data)
    } catch {
      message = await res.text()
    }
    throw new Error(message || `Request failed with status ${res.status}`)
  }

  if (res.status === 204) return undefined as T

  // Handle empty body safely
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, body?: unknown, options?: RequestOptions) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : body != null ? JSON.stringify(body) : undefined
    })
  },

  put: <T>(url: string, body?: unknown, options?: RequestOptions) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as FormData) : body != null ? JSON.stringify(body) : undefined
    })
  },

  del: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'DELETE' })
}

export default apiClient
