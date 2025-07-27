"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Filter, X, Eye } from "lucide-react"

interface OrderItem {
  id: string
  client: string
  date: string
  amount: string
  paymentDate: string
  status: string
  statusColor: string
  type: "gfx" | "vfx" // Nuevo campo para distinguir tipo
  assignedTo: string // Encargado
  items: Array<{
    name: string
    quantity: number
    assignedPayment: number
  }>
}

const orders: OrderItem[] = [
  {
    id: "#199920",
    client: "MECA",
    date: "03/6/2026",
    amount: "$400 USD",
    paymentDate: "03/6/2026",
    status: "En progreso",
    statusColor: "bg-yellow-100 text-yellow-800",
    type: "gfx",
    assignedTo: "Juan Pérez",
    items: [
      { name: "Banner Publicitario", quantity: 2, assignedPayment: 150 },
      { name: "Tarjetas de Presentación", quantity: 500, assignedPayment: 100 },
    ],
  },
  {
    id: "#199921",
    client: "NIKE",
    date: "03/6/2026",
    amount: "$600 USD",
    paymentDate: "03/6/2026",
    status: "No iniciado",
    statusColor: "bg-red-100 text-red-800",
    type: "vfx",
    assignedTo: "María García",
    items: [{ name: "Video Promocional", quantity: 1, assignedPayment: 400 }],
  },
  {
    id: "#199922",
    client: "MECA",
    date: "04/6/2026",
    amount: "$300 USD",
    paymentDate: "04/6/2026",
    status: "En progreso",
    statusColor: "bg-yellow-100 text-yellow-800",
    type: "gfx",
    assignedTo: "Carlos López",
    items: [{ name: "Logo Design", quantity: 1, assignedPayment: 200 }],
  },
  {
    id: "#199923",
    client: "NIKE",
    date: "05/6/2026",
    amount: "$800 USD",
    paymentDate: "05/6/2026",
    status: "Terminado",
    statusColor: "bg-green-100 text-green-800",
    type: "vfx",
    assignedTo: "Ana Rodríguez",
    items: [
      { name: "Animación 3D", quantity: 1, assignedPayment: 500 },
      { name: "Post-producción", quantity: 1, assignedPayment: 200 },
    ],
  },
  {
    id: "#199924",
    client: "LOCAL BUSINESS",
    date: "02/6/2026",
    amount: "$250 USD",
    paymentDate: "02/6/2026",
    status: "No iniciado",
    statusColor: "bg-red-100 text-red-800",
    type: "gfx",
    assignedTo: "Juan Pérez",
    items: [{ name: "Flyers", quantity: 100, assignedPayment: 80 }],
  },
]

export function OrdersTable() {
  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [showFilters, setShowFilters] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

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

  // Obtener valores únicos para los filtros
  const uniqueClients = [...new Set(orders.map((order) => order.client))]
  const uniqueStatuses = [...new Set(orders.map((order) => order.status))]
  const uniqueAssignees = [...new Set(orders.map((order) => order.assignedTo))]
  const uniqueItems = [...new Set(orders.flatMap((order) => order.items.map((item) => item.name)))]

  // Función para aplicar filtros
  const applyFilters = () => {
    const filtered = orders.filter((order) => {
      const matchesClient = !filters.client || order.client.toLowerCase().includes(filters.client.toLowerCase())
      const matchesStatus = !filters.status || order.status === filters.status
      const matchesType = !filters.type || order.type === filters.type
      const matchesAssignee = !filters.assignedTo || order.assignedTo === filters.assignedTo
      const matchesItem =
        !filters.item || order.items.some((item) => item.name.toLowerCase().includes(filters.item.toLowerCase()))

      // Filtro de fechas (simplificado para el ejemplo)
      let matchesDate = true
      if (filters.dateFrom || filters.dateTo) {
        const orderDate = new Date(order.date.split("/").reverse().join("-"))
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

  // Obtener color de fondo según tipo
  const getRowColor = (type: "gfx" | "vfx") => {
    return type === "gfx" ? "bg-yellow-50" : "bg-blue-50"
  }

  // Obtener badge de tipo
  const getTypeBadge = (type: "gfx" | "vfx") => {
    return type === "gfx" ? (
      <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
    ) : (
      <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pedidos Recientes</CardTitle>
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
                    <SelectItem value="all">Todos</SelectItem>
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
                    <SelectItem value="all">Todos</SelectItem>
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
                    <SelectItem value="all">Todos</SelectItem>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead># PEDIDO</TableHead>
              <TableHead>CLIENTE</TableHead>
              <TableHead>FECHA</TableHead>
              <TableHead>MONTO COTIZADO</TableHead>
              <TableHead>FECHA DE PAGO</TableHead>
              <TableHead>ENCARGADO</TableHead>
              <TableHead>TIPO</TableHead>
              <TableHead>ESTADO</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <>
                <TableRow key={order.id} className={getRowColor(order.type)}>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => toggleRow(order.id)} className="p-0 h-6 w-6">
                      {expandedRows.has(order.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.paymentDate}</TableCell>
                  <TableCell>{order.assignedTo}</TableCell>
                  <TableCell>{getTypeBadge(order.type)}</TableCell>
                  <TableCell>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </TableCell>
                </TableRow>

                {/* Fila expandida con detalles */}
                {expandedRows.has(order.id) && (
                  <TableRow className={`${getRowColor(order.type)} border-t-0`}>
                    <TableCell colSpan={9} className="py-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Detalles del Pedido {order.id}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Items del Pedido:</h5>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
                                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                  </div>
                                  <span className="text-green-600 font-medium">${item.assignedPayment}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Información del Encargado:</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span>Encargado:</span>
                                <span className="font-medium">{order.assignedTo}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tipo de Trabajo:</span>
                                {getTypeBadge(order.type)}
                              </div>
                              <div className="flex justify-between">
                                <span>Pago Total Encargado:</span>
                                <span className="font-medium text-green-600">
                                  ${order.items.reduce((sum, item) => sum + item.assignedPayment, 0)}
                                </span>
                              </div>
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron pedidos que coincidan con los filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
