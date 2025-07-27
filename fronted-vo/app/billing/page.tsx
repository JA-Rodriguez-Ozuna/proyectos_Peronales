"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Download, AlertTriangle, CheckCircle, Calendar } from "lucide-react"
import { BrandHeader } from "@/components/ui/brand-header"

const currentPlan = {
  name: "Profesional",
  price: 79,
  billingCycle: "monthly",
  nextBilling: "2024-02-15",
  status: "active",
}

const usage = {
  products: { current: 245, limit: 1000 },
  users: { current: 3, limit: 5 },
  orders: { current: 1250, limit: 5000 },
  storage: { current: 2.3, limit: 10 }, // GB
}

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-15",
    amount: 79.0,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-15",
    amount: 79.0,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-15",
    amount: 79.0,
    status: "paid",
    downloadUrl: "#",
  },
]

export default function BillingPage() {
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  const getUsagePercentage = (current: number, limit: number) => {
    return (current / limit) * 100
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BrandHeader
        title="Facturación y Suscripción"
        subtitle="Gestiona tu plan, facturación y uso de recursos"
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Plan Actual
              <Badge
                className={currentPlan.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {currentPlan.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{currentPlan.name}</div>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              ${currentPlan.price}
              <span className="text-sm text-gray-500 font-normal">/mes</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Próxima facturación: {currentPlan.nextBilling}
            </div>
            <Button className="w-full" onClick={() => setIsChangingPlan(true)}>
              Cambiar Plan
            </Button>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Método de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <CreditCard className="w-8 h-8 text-gray-400 mr-3" />
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-gray-500">Expira 12/25</div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Actualizar Método de Pago
            </Button>
          </CardContent>
        </Card>

        {/* Next Invoice */}
        <Card>
          <CardHeader>
            <CardTitle>Próxima Factura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">${currentPlan.price}.00</div>
            <div className="text-sm text-gray-600 mb-4">Se cobrará el {currentPlan.nextBilling}</div>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Pago automático configurado
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Statistics */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Uso de Recursos</CardTitle>
          <CardDescription>Monitorea tu uso actual vs los límites de tu plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Productos</span>
                <span
                  className={`text-sm ${getUsageColor(getUsagePercentage(usage.products.current, usage.products.limit))}`}
                >
                  {usage.products.current}/{usage.products.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.products.current, usage.products.limit)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Usuarios</span>
                <span
                  className={`text-sm ${getUsageColor(getUsagePercentage(usage.users.current, usage.users.limit))}`}
                >
                  {usage.users.current}/{usage.users.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.users.current, usage.users.limit)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Pedidos (mes)</span>
                <span
                  className={`text-sm ${getUsageColor(getUsagePercentage(usage.orders.current, usage.orders.limit))}`}
                >
                  {usage.orders.current}/{usage.orders.limit}
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.orders.current, usage.orders.limit)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Almacenamiento</span>
                <span
                  className={`text-sm ${getUsageColor(getUsagePercentage(usage.storage.current, usage.storage.limit))}`}
                >
                  {usage.storage.current}GB/{usage.storage.limit}GB
                </span>
              </div>
              <Progress value={getUsagePercentage(usage.storage.current, usage.storage.limit)} className="h-2" />
            </div>
          </div>

          {getUsagePercentage(usage.products.current, usage.products.limit) > 80 && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <p className="text-yellow-800 font-medium">Límite de productos casi alcanzado</p>
                  <p className="text-yellow-700 text-sm">
                    Considera actualizar tu plan para evitar interrupciones en el servicio.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Facturas</CardTitle>
          <CardDescription>Descarga tus facturas anteriores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">Pagado</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
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
