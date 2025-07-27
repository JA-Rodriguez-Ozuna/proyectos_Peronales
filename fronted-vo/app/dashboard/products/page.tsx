"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { ProductDialog } from "@/components/products/product-dialog"
import { api } from "@/lib/api"

interface Product {
  id: number
  nombre: string
  tipo: string
  precio: number
  descripcion?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar productos del backend
  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await api.getProductos()
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        setError("Error al cargar productos")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) return

    try {
      const response = await api.eliminarProducto(id)
      if (response.ok) {
        await loadProducts() // Recargar la lista
        alert("Producto eliminado exitosamente")
      } else {
        alert("Error al eliminar producto")
      }
    } catch (error) {
      alert("Error de conexión")
      console.error("Error deleting product:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Productos y Servicios</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Productos y Servicios</h1>
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
          <Button onClick={loadProducts} className="mt-4">Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Productos y Servicios</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto/Servicio
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar productos/servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos y Servicios ({products.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay productos registrados</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                Agregar Primer Producto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className={getRowColor(product.tipo)}>
                    <TableCell className="font-medium">#{product.id}</TableCell>
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell>{getCategoryBadge(product.tipo)}</TableCell>
                    <TableCell className="font-semibold text-green-600">${product.precio.toFixed(2)}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.descripcion || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Eliminar"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      <ProductDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onProductCreated={loadProducts}
      />
    </div>
  )
}