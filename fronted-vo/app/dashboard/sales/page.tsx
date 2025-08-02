"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react"
import { api } from "@/lib/api"

interface Product {
  id: number
  nombre: string
  tipo: string
  precio: number
  descripcion?: string
}

interface CartItem {
  id: number
  nombre: string
  precio: number
  cantidad: number
  tipo: string
}

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [sales, setSales] = useState<any[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Cargar datos del backend
  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar productos, clientes y ventas en paralelo
      const [productsRes, customersRes, salesRes] = await Promise.all([
        api.getProductos(),
        api.getClientes(),
        api.getVentas()
      ])
      
      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }
      
      if (customersRes.ok) {
        const customersData = await customersRes.json()
        setCustomers(customersData)
      }
      
      if (salesRes.ok) {
        const salesData = await salesRes.json()
        setSales(salesData)
      }
      
    } catch (error) {
      setError("Error de conexión")
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const addToCart = () => {
    if (!selectedProduct) return

    const product = products.find((p) => p.id.toString() === selectedProduct)
    if (!product) return

    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item)))
    } else {
      setCart([...cart, { 
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        tipo: product.tipo
      }])
    }

    setSelectedProduct("")
  }

  const updateQuantity = (id: number, change: number) => {
    setCart(
      cart
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

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

  const processSale = async () => {
    if (cart.length === 0 || !selectedCustomer) return

    setIsProcessing(true)

    try {
      // Buscar cliente por nombre
      let clienteId = null
      const clienteExistente = customers.find(c => 
        c.nombre === selectedCustomer
      )
      
      if (clienteExistente) {
        clienteId = clienteExistente.id
      }

      // Procesar cada item del carrito como una venta separada
      for (const item of cart) {
        const ventaData = {
          cliente_id: clienteId,
          producto_id: item.id,
          cantidad: item.cantidad
        }

        const response = await api.registrarVenta(ventaData)
        
        if (!response.ok) {
          throw new Error(`Error al registrar venta de ${item.nombre}`)
        }
      }

      console.log("✅ Venta procesada:", { 
        cliente: selectedCustomer, 
        clienteId,
        cart, 
        total,
        timestamp: new Date().toISOString()
      })
      
      // Recargar datos
      await loadData()
      
      // Limpiar formulario
      setCart([])
      setSelectedCustomer("")
      
      alert(`¡Venta procesada exitosamente!\nTotal: $${total.toFixed(2)}`)
      
    } catch (error) {
      console.error("Error processing sale:", error)
      alert("Error al procesar la venta")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteSale = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta venta?")) return

    try {
      const response = await api.eliminarVenta(id)
      if (response.ok) {
        await loadData() // Recargar datos
        alert("Venta eliminada exitosamente")
      } else {
        alert("Error al eliminar venta")
      }
    } catch (error) {
      alert("Error de conexión")
      console.error("Error deleting sale:", error)
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Punto de Venta</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
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
              <Label htmlFor="customer">Cliente *</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
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

            <div className="flex space-x-2">
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
              <Button onClick={addToCart} disabled={!selectedProduct}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            {customers.length === 0 && !loading && (
              <div className="text-yellow-600 text-sm">
                No hay clientes registrados. Agrega clientes primero.
              </div>
            )}
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
                      <TableRow key={item.id} className={getRowColor(item.tipo)}>
                        <TableCell className="font-medium">{item.nombre}</TableCell>
                        <TableCell>{getCategoryBadge(item.tipo)}</TableCell>
                        <TableCell>${item.precio.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.cantidad}</span>
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${(item.precio * item.cantidad).toFixed(2)}
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
                  <Button 
                    className="w-full mt-4" 
                    onClick={processSale} 
                    disabled={!selectedCustomer || cart.length === 0 || isProcessing}
                  >
                    {isProcessing ? "Procesando..." : "Procesar Venta"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historial de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.slice(-10).reverse().map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>#{sale.id}</TableCell>
                    <TableCell>{sale.cliente_nombre || "Cliente no encontrado"}</TableCell>
                    <TableCell>{sale.producto_nombre}</TableCell>
                    <TableCell>{sale.cantidad}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      ${sale.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{new Date(sale.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteSale(sale.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}