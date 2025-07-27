"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Filter, X, Eye, Plus, Trash2 } from "lucide-react"
import { OrderDialog } from "@/components/orders/order-dialog"
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Estados de filtros
  const [filters, setFilters] = useState({
    client: "",
    status: "",
    type: "",
    assignedTo: "",
    dateFrom: "",
    dateTo: "",
    item: "",
  })

  // Cargar pedidos del backend
  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await api.getPedidos()
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setFilteredOrders(data)
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

  const handleDeleteOrder = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este pedido?")) return

    try {
      const response = await api.eliminarPedido(id)
      if (response.ok) {
        await loadOrders() // Recargar la lista
        alert("Pedido eliminado exitosamente")
      } else {
        alert("Error al eliminar pedido")
      }
    } catch (error) {
      alert("Error de conexión")
      console.error("Error deleting order:", error)
    }
  }

  // Obtener valores únicos para los filtros
  const uniqueClients = [...new Set(orders.map((order) => order.cliente_nombre).filter((name): name is string => Boolean(name)))]
  const uniqueStatuses = [...new Set(orders.map((order) => order.estado))]
  const uniqueAssignees = [...new Set(orders.map((order) => order.encargado_principal).filter((name): name is string => Boolean(name)))]
  const uniqueItems = [...new Set(orders.flatMap((order) => order.productos.map((item) => item.nombre)))]

  // Función para aplicar filtros
  const applyFilters = () => {
    const filtered = orders.filter((order) => {
      const matchesClient = !filters.client || (order.cliente_nombre && order.cliente_nombre.toLowerCase().includes(filters.client.toLowerCase()))
      const matchesStatus = !filters.status || order.estado === filters.status
      const matchesAssignee = !filters.assignedTo || order.encargado_principal === filters.assignedTo
      const matchesItem = !filters.item || order.productos.some((item) => item.nombre.toLowerCase().includes(filters.item.toLowerCase()))
      
      // Filtro por tipo (GFX/VFX)
      const matchesType = !filters.type || order.productos.some((item) => item.tipo === filters.type)

      // Filtro de fechas
      let matchesDate = true
      if (filters.dateFrom || filters.dateTo) {
        const orderDate = new Date(order.fecha)
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom)
          matchesDate = matchesDate && orderDate >= fromDate
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo)
          matchesDate = matchesDate && orderDate <= toDate
        }
      }

      return matchesClient && matchesStatus && matchesType && matchesAssignee && matchesItem && matchesDate
    })

    setFilteredOrders(filtered)
  }

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      client: "",
      status: "",
      type: "",
      assignedTo: "",
      dateFrom: "",
      dateTo: "",
      item: "",
    })
    setFilteredOrders(orders)
  }

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
    
    if (hasGfx && hasVfx) return "bg-purple-50" // Mixto
    if (hasGfx) return "bg-yellow-50"
    if (hasVfx) return "bg-blue-50"
    return ""
  }

  // Obtener badge de tipo principal
  const getTypeBadge = (productos: any[]) => {
    if (productos.length === 0) return <Badge>Sin productos</Badge>
    
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
          <Button onClick={loadOrders} className="mt-4">Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
        <Button onClick={() => setIsOrderDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Pedidos ({orders.length} total)</CardTitle>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Panel de Filtros */}
          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleContent className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="client-filter">Cliente</Label>
                  <Input
                    id="client-filter"
                    placeholder="Buscar cliente..."
                    value={filters.client}
                    onChange={(e) => setFilters({ ...filters, client: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="status-filter">Estado</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {uniqueStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type-filter">Tipo</Label>
                  <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="GFX / VFX" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="gfx">GFX</SelectItem>
                      <SelectItem value="vfx">VFX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="assignee-filter">Encargado</Label>
                  <Select
                    value={filters.assignedTo}
                    onValueChange={(value) => setFilters({ ...filters, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los encargados" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      {uniqueAssignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="item-filter">Item</Label>
                  <Input
                    id="item-filter"
                    placeholder="Buscar item..."
                    value={filters.item}
                    onChange={(e) => setFilters({ ...filters, item: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="date-from">Fecha Desde</Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="date-to">Fecha Hasta</Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applyFilters}>Aplicar Filtros</Button>
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Tabla de Pedidos */}
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay pedidos registrados</p>
              <Button onClick={() => setIsOrderDialogOpen(true)} className="mt-4">
                Crear Primer Pedido
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead># PEDIDO</TableHead>
                  <TableHead>CLIENTE</TableHead>
                  <TableHead>FECHA</TableHead>
                  <TableHead>MONTO TOTAL</TableHead>
                  <TableHead>ENCARGADO</TableHead>
                  <TableHead>TIPO</TableHead>
                  <TableHead>ESTADO</TableHead>
                  <TableHead>ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <>
                    <TableRow key={order.id} className={getRowColor(order.productos)}>
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
                      <TableCell>{order.cliente_nombre || "Cliente no especificado"}</TableCell>
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
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Fila expandida con detalles */}
                    {expandedRows.has(order.id.toString()) && (
                      <TableRow className={`${getRowColor(order.productos)} border-t-0`}>
                        <TableCell colSpan={9} className="py-4">
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
                                <h5 className="font-medium mb-2">Información del Pedido:</h5>
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
                                    <span>Total del Pedido:</span>
                                    <span className="font-medium text-green-600">
                                      ${getTotalAmount(order.productos).toFixed(2)}
                                    </span>
                                  </div>
                                  {order.notas && (
                                    <div>
                                      <span className="font-medium">Notas:</span>
                                      <p className="text-sm text-gray-600 mt-1">{order.notas}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredOrders.length === 0 && orders.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron pedidos que coincidan con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
      
      <OrderDialog 
        open={isOrderDialogOpen} 
        onOpenChange={setIsOrderDialogOpen}
        onOrderCreated={loadOrders}
      />
    </div>
  )
}