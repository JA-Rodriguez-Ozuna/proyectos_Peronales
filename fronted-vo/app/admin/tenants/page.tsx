"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Eye, Settings, Ban } from "lucide-react"
import { BrandHeader } from "@/components/ui/brand-header"

const tenants = [
  {
    id: "1",
    name: "Plus Graphics",
    plan: "Profesional",
    status: "active",
    users: 3,
    monthlyRevenue: 79,
    createdAt: "2024-01-15",
    lastActivity: "2024-01-20",
  },
  {
    id: "2",
    name: "Mi Tienda Online",
    plan: "Básico",
    status: "active",
    users: 1,
    monthlyRevenue: 29,
    createdAt: "2024-01-10",
    lastActivity: "2024-01-19",
  },
  {
    id: "3",
    name: "Empresa Demo",
    plan: "Empresarial",
    status: "trial",
    users: 5,
    monthlyRevenue: 0,
    createdAt: "2024-01-18",
    lastActivity: "2024-01-20",
  },
  {
    id: "4",
    name: "Negocio Suspendido",
    plan: "Básico",
    status: "suspended",
    users: 2,
    monthlyRevenue: 0,
    createdAt: "2023-12-01",
    lastActivity: "2024-01-05",
  },
]

export default function TenantsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTenants = tenants.filter((tenant) => tenant.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalRevenue = tenants
    .filter((t) => t.status === "active")
    .reduce((sum, tenant) => sum + tenant.monthlyRevenue, 0)

  const activeCount = tenants.filter((t) => t.status === "active").length
  const trialCount = tenants.filter((t) => t.status === "trial").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>
      case "trial":
        return <Badge className="bg-blue-100 text-blue-800">Prueba</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BrandHeader
        title="Gestión de Clientes (Tenants)"
        subtitle="Administra todas las empresas que usan tu SaaS"
        className="mb-8"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{trialCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ingresos Mensuales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>Ingresos/Mes</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.plan}</TableCell>
                  <TableCell>{getStatusBadge(tenant.status)}</TableCell>
                  <TableCell>{tenant.users}</TableCell>
                  <TableCell>{tenant.monthlyRevenue > 0 ? `$${tenant.monthlyRevenue}` : "-"}</TableCell>
                  <TableCell>{tenant.createdAt}</TableCell>
                  <TableCell>{tenant.lastActivity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      {tenant.status === "active" && (
                        <Button variant="ghost" size="sm">
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
