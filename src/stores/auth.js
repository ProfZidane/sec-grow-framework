import { reactive } from 'vue'

export const authStore = reactive({
  user: null,
  token: localStorage.getItem('sec-grow-token'),
  refreshToken: localStorage.getItem('sec-grow-refresh-token'),
  isAuthenticated: false,

  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      this.user = data.user
      this.token = data.tokens.accessToken
      this.refreshToken = data.tokens.refreshToken
      this.isAuthenticated = true

      localStorage.setItem('sec-grow-token', this.token)
      localStorage.setItem('sec-grow-refresh-token', this.refreshToken)
      localStorage.setItem('sec-grow-user', JSON.stringify(this.user))

      return { success: true, user: this.user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  },

  async register(email, password, role = 'evaluator') {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      return { success: true, message: data.message }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  },

  async refreshAccessToken() {
    if (!this.refreshToken) {
      this.logout()
      return false
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      this.token = data.accessToken
      localStorage.setItem('sec-grow-token', this.token)

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      this.logout()
      return false
    }
  },

  logout() {
    this.user = null
    this.token = null
    this.refreshToken = null
    this.isAuthenticated = false

    localStorage.removeItem('sec-grow-token')
    localStorage.removeItem('sec-grow-refresh-token')
    localStorage.removeItem('sec-grow-user')
  },

  async makeAuthenticatedRequest(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    let response = await fetch(url, {
      ...options,
      headers
    })

    // If token expired, try to refresh
    if (response.status === 401 && this.refreshToken) {
      const refreshed = await this.refreshAccessToken()
      if (refreshed) {
        headers.Authorization = `Bearer ${this.token}`
        response = await fetch(url, {
          ...options,
          headers
        })
      }
    }

    return response
  },

  initializeAuth() {
    const savedUser = localStorage.getItem('sec-grow-user')
    const savedToken = localStorage.getItem('sec-grow-token')

    if (savedUser && savedToken) {
      try {
        this.user = JSON.parse(savedUser)
        this.token = savedToken
        this.isAuthenticated = true
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        this.logout()
      }
    }
  }
})