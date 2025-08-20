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

  const queryString = query.toString()

  return queryString ? `?${queryString}` : ''
}

const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { params, headers, ...init } = options

  const fetchHeaders: HeadersInit = {
    ...headers,
  }

  if (init.body && !(init.body instanceof FormData) && !fetchHeaders['Content-Type']) {
    fetchHeaders['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}${buildQuery(params)}`, {
    ...init,
    headers: fetchHeaders,
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(await res.text())
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const apiClient = {
  get: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: unknown, options?: RequestOptions) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    })
  },
  put: <T>(url: string, body?: unknown, options?: RequestOptions) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    })
  },
  del: <T>(url: string, options?: RequestOptions) => request<T>(url, { ...options, method: 'DELETE' }),
}

export default apiClient
