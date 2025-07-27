"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { CustomerDialog } from "@/components/customers/customer-dialog"
import { api } from "@/lib/api"

interface Customer {
  id: number
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
  notas?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Cargar clientes del backend
  const loadCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.getClientes()
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      } else {
        setError("Error al cargar clientes")
      }
    } catch (error) {
      setError("Error de conexión")
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar clientes al montar el componente
  useEffect(() => {
    loadCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDeleteCustomer = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) return

    try {
      const response = await api.eliminarCliente(id)
      if (response.ok) {
        await loadCustomers() // Recargar la lista
        alert("Cliente eliminado exitosamente")
      } else {
        alert("Error al eliminar cliente")
      }
    } catch (error) {
      alert("Error de conexión")
      console.error("Error deleting customer:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
          <Button onClick={loadCustomers} className="mt-4">Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({customers.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No hay clientes registrados</p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                Agregar Primer Cliente
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">#{customer.id}</TableCell>
                    <TableCell className="font-medium">{customer.nombre}</TableCell>
                    <TableCell>{customer.email || "-"}</TableCell>
                    <TableCell>{customer.telefono || "-"}</TableCell>
                    <TableCell className="max-w-xs truncate">{customer.direccion || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" title="Ver detalles">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Eliminar"
                          onClick={() => handleDeleteCustomer(customer.id)}
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

          {filteredCustomers.length === 0 && customers.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron clientes que coincidan con la búsqueda.
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onCustomerCreated={loadCustomers}
      />
    </div>
  )
}