"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart } from "lucide-react"

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

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [customer, setCustomer] = useState("")

  const addToCart = () => {
    if (!selectedProduct) return

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    setSelectedProduct("")
  }

  const updateQuantity = (id: string, change: number) => {
    setCart(
      cart
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

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const processSale = () => {
    if (cart.length === 0) return

    console.log("Venta procesada:", { customer, cart, total })
    setCart([])
    setCustomer("")
    alert("Venta procesada exitosamente!")
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Punto de Venta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de productos */}
        <Card>
          <CardHeader>
            <CardTitle>Agregar Productos/Servicios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer">Cliente</Label>
              <Input
                id="customer"
                placeholder="Nombre del cliente"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
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
              <Button onClick={addToCart} disabled={!selectedProduct}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Carrito de compras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Carrito de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay productos en el carrito</p>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.id} className={getRowColor(item.category)}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{getCategoryBadge(item.category)}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                            ×
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                  <Button className="w-full mt-4" onClick={processSale} disabled={!customer || cart.length === 0}>
                    Procesar Venta
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
