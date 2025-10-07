import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const tradingApi = {
  // Market data
  getMarketData: () => api.get('/api/market/data'),
  getTickerData: (symbol: string) => api.get(`/api/market/ticker/${symbol}`),
  
  // Trading
  getPositions: () => api.get('/api/trading/positions'),
  getOrders: () => api.get('/api/trading/orders'),
  placeOrder: (order: any) => api.post('/api/trading/order', order),
  cancelOrder: (orderId: string) => api.delete(`/api/trading/order/${orderId}`),
  
  // Account
  getAccountInfo: () => api.get('/api/trading/account'),
}

export default api


