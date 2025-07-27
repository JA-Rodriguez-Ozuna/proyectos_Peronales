// lib/api.js
const API_BASE_URL = 'http://localhost:5000/api'

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
    const response = await fetch(`${API_BASE_URL}${url}`, config)
    return response
  } catch (error) {
    console.error('API Error:', error)
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