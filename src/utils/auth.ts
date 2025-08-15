const TOKEN_KEY = 'accessToken'

export const getToken = () => {
  if (typeof window === 'undefined') return null

  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  if (typeof window === 'undefined') return

  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  if (typeof window === 'undefined') return

  localStorage.removeItem(TOKEN_KEY)
}

export const isAuthenticated = () => !!getToken()
