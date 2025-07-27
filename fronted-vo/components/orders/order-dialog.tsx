"use client"

import type React from "react"

import { useState } from "react"
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

interface OrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const products = [
  { id: "PROD001", name: "SCENE ANIMATION", price: 2079.2, category: "vfx" },
  { id: "PROD002", name: "SCENE", price: 1315.06, category: "vfx" },
  { id: "PROD003", name: "ANIMATED 2.0 FRAME", price: 805.6, category: "vfx" },
  { id: "PROD004", name: "TRANSITION", price: 725.67, category: "vfx" },
  { id: "PROD005", name: "INTRO", price: 275.84, category: "vfx" },
  { id: "PROD006", name: "LOGO ANIMATION", price: 215.91, category: "vfx" },
  { id: "PROD007", name: "POST (1 SLIDE)", price: 69.93, category: "gfx" },
  { id: "PROD008", name: "ANIMATED OUTRO", price: 65.98, category: "vfx" },
  { id: "PROD009", name: "POST RAIMATION", price: 31.38, category: "gfx" },
  { id: "PROD010", name: "2.0 FRAME", price: 27.98, category: "gfx" },
  { id: "PROD011", name: "LOWERTHIRD", price: 26.87, category: "gfx" },
]

const assignees = ["Juan Pérez", "María García", "Carlos López", "Ana Rodríguez", "Luis Martínez"]

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  assignedPayment: number
}

export function OrderDialog({ open, onOpenChange }: OrderDialogProps) {
  const [formData, setFormData] = useState({
    client: "",
    dueDate: "",
    assignedTo: "",
    notes: "",
    isPaid: false,
  })

  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")

  const addProduct = () => {
    if (!selectedProduct) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = orderItems.find((item) => item.id === product.id)

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)),
      )
    } else {
      setOrderItems([
        ...orderItems,
        {
          ...product,
          quantity: 1,
          assignedPayment: Math.round(product.price * 0.6), // 60% del precio como pago por defecto
        },
      ])
    }

    setSelectedProduct("")
  }

  const updateQuantity = (id: string, change: number) => {
    setOrderItems(
      orderItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = item.quantity + change
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item
          }
          return item
        })
        .filter((item) => item.quantity > 0),
    )
  }

  const updateAssignedPayment = (id: string, payment: number) => {
    setOrderItems(orderItems.map((item) => (item.id === id ? { ...item, assignedPayment: payment } : item)))
  }

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== id))
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalAssignedPayment = orderItems.reduce((sum, item) => sum + item.assignedPayment * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const orderData = {
      ...formData,
      items: orderItems,
      totalAmount,
      totalAssignedPayment,
      orderNumber: `#${Date.now().toString().slice(-6)}`, // Generar número de pedido
      status: formData.isPaid ? "Pagado" : "Pendiente de pago",
      type: orderItems.length > 0 ? orderItems[0].category : "mixed", // Determinar tipo principal
    }

    console.log("Nuevo pedido creado:", orderData)

    // Limpiar formulario
    setFormData({
      client: "",
      dueDate: "",
      assignedTo: "",
      notes: "",
      isPaid: false,
    })
    setOrderItems([])

    onOpenChange(false)
    alert("Pedido creado exitosamente!")
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
                  <Label htmlFor="client">Cliente *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Nombre del cliente"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate">Fecha de Entrega</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="assignedTo">Encargado Principal</Label>
                  <Select
                    value={formData.assignedTo}
                    onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
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
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPaid: checked })}
                  />
                  <Label htmlFor="isPaid">¿Ya pagó el cliente?</Label>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notas del Pedido</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              {getCategoryBadge(product.category)}
                              <span>{product.name}</span>
                            </div>
                            <span className="font-semibold text-green-600 ml-4">${product.price.toFixed(2)}</span>
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
                        <TableRow key={item.id} className={getRowColor(item.category)}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{getCategoryBadge(item.category)}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
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
                              <span className="w-8 text-center">{item.quantity}</span>
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
                            ${(item.price * item.quantity).toFixed(2)}
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
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!formData.client || orderItems.length === 0} className="w-full md:w-auto">
              Crear Pedido
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
