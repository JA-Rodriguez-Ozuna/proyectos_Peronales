"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ChevronRight, Eye } from "lucide-react"
import { api } from "@/lib/api"

interface OrderItem {
  id: number
  cliente_nombre?: string
  fecha: string
  encargado_principal?: string
  pago_realizado: boolean
  notas?: string
  estado: string
  productos: Array<{
    nombre: string
    cantidad: number
    precio: number
    tipo: string
  }>
}

export function OrdersTable() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar pedidos del backend
  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await api.getPedidos()
      if (response.ok) {
        const data = await response.json()
        // Mostrar solo los 5 más recientes
        setOrders(data.slice(0, 5))
      } else {
        setError("Error al cargar pedidos")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("Error loading orders:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Toggle expandir fila
  const toggleRow = (orderId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedRows(newExpanded)
  }

  // Obtener color de fondo según tipo principal
  const getRowColor = (productos: any[]) => {
    if (productos.length === 0) return ""
    const hasGfx = productos.some(p => p.tipo === "gfx")
    const hasVfx = productos.some(p => p.tipo === "vfx")
    
    if (hasGfx && hasVfx) return "bg-purple-50"
    if (hasGfx) return "bg-yellow-50"
    if (hasVfx) return "bg-blue-50"
    return ""
  }

  // Obtener badge de tipo principal
  const getTypeBadge = (productos: any[]) => {
    if (productos.length === 0) return <Badge>-</Badge>
    
    const hasGfx = productos.some(p => p.tipo === "gfx")
    const hasVfx = productos.some(p => p.tipo === "vfx")
    
    if (hasGfx && hasVfx) {
      return <Badge className="bg-purple-200 text-purple-800">MIXTO</Badge>
    }
    if (hasGfx) {
      return <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
    }
    if (hasVfx) {
      return <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
    }
    return <Badge>-</Badge>
  }

  // Calcular monto total del pedido
  const getTotalAmount = (productos: any[]) => {
    return productos.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  }

  // Obtener color del estado
  const getStatusColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return "bg-yellow-100 text-yellow-800"
      case 'en progreso':
        return "bg-blue-100 text-blue-800"
      case 'terminado':
      case 'completado':
        return "bg-green-100 text-green-800"
      case 'pagado':
        return "bg-green-100 text-green-800"
      case 'cancelado':
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 py-4">
            <p>{error}</p>
            <Button onClick={loadOrders} className="mt-2" size="sm">Reintentar</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay pedidos registrados</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead># PEDIDO</TableHead>
                <TableHead>CLIENTE</TableHead>
                <TableHead>FECHA</TableHead>
                <TableHead>MONTO</TableHead>
                <TableHead>ENCARGADO</TableHead>
                <TableHead>TIPO</TableHead>
                <TableHead>ESTADO</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow className={getRowColor(order.productos)}>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => toggleRow(order.id.toString())} className="p-0 h-6 w-6">
                        {expandedRows.has(order.id.toString()) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.cliente_nombre || "Sin cliente"}</TableCell>
                    <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${getTotalAmount(order.productos).toFixed(2)}
                    </TableCell>
                    <TableCell>{order.encargado_principal || "-"}</TableCell>
                    <TableCell>{getTypeBadge(order.productos)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.estado)}>
                        {order.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {/* Fila expandida con detalles */}
                  {expandedRows.has(order.id.toString()) && (
                    <TableRow className={`${getRowColor(order.productos)} border-t-0`}>
                      <TableCell colSpan={8} className="py-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Detalles del Pedido #{order.id}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium mb-2">Items del Pedido:</h5>
                              <div className="space-y-2">
                                {order.productos.map((item, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div>
                                      <span className="font-medium">{item.nombre}</span>
                                      <span className="text-gray-500 ml-2">x{item.cantidad}</span>
                                    </div>
                                    <span className="text-green-600 font-medium">
                                      ${(item.precio * item.cantidad).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2">Información:</h5>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Encargado:</span>
                                  <span className="font-medium">{order.encargado_principal || "No asignado"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Estado de Pago:</span>
                                  <span className={`font-medium ${order.pago_realizado ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.pago_realizado ? "Pagado" : "Pendiente"}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Total:</span>
                                  <span className="font-medium text-green-600">
                                    ${getTotalAmount(order.productos).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}