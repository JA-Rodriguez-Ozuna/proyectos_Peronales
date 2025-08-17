// Configuracion centralizada para llamadas API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plus-graphics.onrender.com'

// Debug logging para verificar URLs en Vercel
console.log('🔍 API_BASE_URL actual:', API_BASE_URL)
console.log('🌐 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)
console.log('🏗️ NODE_ENV:', process.env.NODE_ENV)

const makeRequest = async (url, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const fullUrl = `${API_BASE_URL}/api${url}`
    console.log('📡 Llamando API:', fullUrl)
    
    const response = await fetch(fullUrl, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error(`API call failed for ${url}:`, error)
    throw error
  }
}

export const api = {
  // ============ AUTENTICACIÓN ============
  login: async (email, password) => {
    return makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  verifyToken: async () => {
    return makeRequest('/auth/verify')
  },

  // ============ USUARIOS ============
  getUsuarios: async () => {
    return makeRequest('/usuarios')
  },

  // ============ PRODUCTOS ============
  getProductos: async () => {
    return makeRequest('/productos')
  },

  getProducto: async (id) => {
    return makeRequest(`/productos/${id}`)
  },

  crearProducto: async (producto) => {
    return makeRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(producto)
    })
  },

  actualizarProducto: async (id, producto) => {
    return makeRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto)
    })
  },

  eliminarProducto: async (id) => {
    return makeRequest(`/productos/${id}`, {
      method: 'DELETE'
    })
  },

  // ============ CLIENTES ============
  getClientes: async () => {
    return makeRequest('/clientes')
  },

  getCliente: async (id) => {
    return makeRequest(`/clientes/${id}`)
  },

  crearCliente: async (cliente) => {
    return makeRequest('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente)
    })
  },

  actualizarCliente: async (id, cliente) => {
    return makeRequest(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente)
    })
  },

  eliminarCliente: async (id) => {
    return makeRequest(`/clientes/${id}`, {
      method: 'DELETE'
    })
  },

  // ============ PEDIDOS ============
  getPedidos: async () => {
    return makeRequest('/pedidos')
  },

  crearPedido: async (pedido) => {
    return makeRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido)
    })
  },

  actualizarPedido: async (id, pedido) => {
    return makeRequest(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pedido)
    })
  },

  actualizarEstadoPedido: async (id, estado) => {
    return makeRequest(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado })
    })
  },

  actualizarPagoPedido: async (id, pago_realizado) => {
    return makeRequest(`/pedidos/${id}/pago`, {
      method: 'PUT',
      body: JSON.stringify({ pago_realizado })
    })
  },

  eliminarPedido: async (id) => {
    return makeRequest(`/pedidos/${id}`, {
      method: 'DELETE'
    })
  },

  // ============ VENTAS ============
  getVentas: async () => {
    return makeRequest('/ventas')
  },

  registrarVenta: async (venta) => {
    return makeRequest('/ventas', {
      method: 'POST',
      body: JSON.stringify(venta)
    })
  },

  eliminarVenta: async (id) => {
    return makeRequest(`/ventas/${id}`, {
      method: 'DELETE'
    })
  }
}