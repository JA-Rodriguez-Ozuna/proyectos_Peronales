"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Minus, X } from "lucide-react"
import { api } from "@/lib/api"

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderCreated?: () => void
}

interface Product {
  id: number
  nombre: string
  tipo: string
  precio: number
  descripcion?: string
}

interface OrderItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
  tipo: string
  assignedPayment: number
}

const assignees = ["Vex", "Gilbert", "Randy", "Sergio", "Hiroshi", "Rene"]

export function OrderDialog({ open, onOpenChange, onOrderCreated }: OrderDialogProps) {
  const [formData, setFormData] = useState({
    cliente: "",
    fecha: "",
    encargado_principal: "",
    notas: "",
    pago_realizado: false,
    estado: "pendiente",
  })

  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Cargar productos y clientes al abrir el diálogo
  useEffect(() => {
    if (open) {
      loadProducts()
      loadCustomers()
    }
  }, [open])

  const loadProducts = async () => {
    try {
      const response = await api.getProductos()
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await api.getClientes()
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error("Error loading customers:", error)
    }
  }

  const addProduct = () => {
    if (!selectedProduct) return

    const product = products.find((p) => p.id.toString() === selectedProduct)
    if (!product) return

    const existingItem = orderItems.find((item) => item.id === product.id)

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) => 
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      )
    } else {
      setOrderItems([
        ...orderItems,
        {
          id: product.id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1,
          tipo: product.tipo,
          assignedPayment: Math.round(product.precio * 0.6), // 60% del precio por defecto
        },
      ])
    }

    setSelectedProduct("")
  }

  const updateQuantity = (id: number, change: number) => {
    setOrderItems(
      orderItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.cantidad + change
            return newQuantity > 0 ? { ...item, cantidad: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.cantidad > 0),
    )
  }

  const updateAssignedPayment = (id: number, payment: number) => {
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, assignedPayment: payment } : item)))
  }

  const removeItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const totalAssignedPayment = orderItems.reduce((sum, item) => sum + item.assignedPayment * item.cantidad, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      if (!formData.cliente || orderItems.length === 0) {
        setError("Cliente y al menos un producto son obligatorios")
        setIsSubmitting(false)
        return
      }

      // Buscar cliente por nombre
      let clienteId = null
      const clienteExistente = customers.find(c => 
        c.nombre.toLowerCase() === formData.cliente.trim().toLowerCase()
      )
      
      if (clienteExistente) {
        clienteId = clienteExistente.id
      }

      // Preparar datos del pedido
      const pedidoData = {
        cliente_id: clienteId,
        fecha: formData.fecha || new Date().toISOString().split('T')[0],
        encargado_principal: formData.encargado_principal || "",
        pago_realizado: formData.pago_realizado,
        notas: formData.notas || "",
        estado: formData.pago_realizado ? "pagado" : "pendiente",
        productos: orderItems.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      }

      const response = await api.crearPedido(pedidoData)
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Pedido creado:", result)
        
        // Limpiar formulario
        setFormData({
          cliente: "",
          fecha: "",
          encargado_principal: "",
          notas: "",
          pago_realizado: false,
          estado: "pendiente",
        })
        setOrderItems([])
        
        // Cerrar diálogo
        onOpenChange(false)
        
        // Notificar éxito
        alert("¡Pedido creado exitosamente!")
        
        // Recargar lista
        if (onOrderCreated) {
          onOrderCreated()
        }
      } else {
        const errorData = await response.json()
        setError(errorData.mensaje || "Error al crear pedido")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCategoryBadge = (category: string) => {
    return category === "gfx" ? (
      <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
    ) : (
      <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
    )
  }

  const getRowColor = (category: string) => {
    return category === "gfx" ? "bg-yellow-50" : "bg-blue-50"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Pedido</DialogTitle>
          <DialogDescription>Crea un nuevo pedido con productos/servicios y asigna encargados.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Información básica del pedido */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cliente">Cliente *</Label>
                  <Select
                    value={formData.cliente}
                    onValueChange={(value) => setFormData({ ...formData, cliente: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.nombre}>
                          {customer.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fecha">Fecha de Entrega</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="encargado">Encargado Principal</Label>
                  <Select
                    value={formData.encargado_principal}
                    onValueChange={(value) => setFormData({ ...formData, encargado_principal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar encargado" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="pago_realizado"
                    checked={formData.pago_realizado}
                    onCheckedChange={(checked) => setFormData({ ...formData, pago_realizado: checked })}
                  />
                  <Label htmlFor="pago_realizado">¿Ya pagó el cliente?</Label>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notas">Notas del Pedido</Label>
                  <Textarea
                    id="notas"
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Detalles adicionales, especificaciones, etc."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Agregar productos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agregar Productos/Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar producto/servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              {getCategoryBadge(product.tipo)}
                              <span>{product.nombre}</span>
                            </div>
                            <span className="font-semibold text-green-600 ml-4">${product.precio.toFixed(2)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addProduct} disabled={!selectedProduct}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Lista de productos agregados */}
                {orderItems.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Precio Unit.</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Pago Encargado</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id} className={getRowColor(item.tipo)}>
                          <TableCell className="font-medium">{item.nombre}</TableCell>
                          <TableCell>{getCategoryBadge(item.tipo)}</TableCell>
                          <TableCell>${item.precio.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.cantidad}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.assignedPayment}
                              onChange={(e) => updateAssignedPayment(item.id, Number(e.target.value))}
                              className="w-20"
                              min="0"
                              step="0.01"
                            />
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Resumen del pedido */}
            {orderItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Cotizado</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">${totalAssignedPayment.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Pago Encargados</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ${(totalAmount - totalAssignedPayment).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Ganancia Estimada</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formData.cliente || orderItems.length === 0 || isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Pedido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}