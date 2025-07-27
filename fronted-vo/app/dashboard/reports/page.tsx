"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, Users, FileText, Download, Calendar } from "lucide-react"

// Datos realistas basados en los productos de Plus Graphics
const salesData = {
  totalSales: 15420.5,
  totalOrders: 28,
  avgOrderValue: 550.73,
  newClients: 8,
  gfxRevenue: 3240.8,
  vfxRevenue: 12179.7,
}

const topProducts = [
  { name: "SCENE ANIMATION", sales: 8316.8, orders: 4, category: "vfx" },
  { name: "SCENE", sales: 2630.12, orders: 2, category: "vfx" },
  { name: "ANIMATED 2.0 FRAME", sales: 1611.2, orders: 2, category: "vfx" },
  { name: "TRANSITION", sales: 725.67, orders: 1, category: "vfx" },
  { name: "LOGO ANIMATION", sales: 431.82, orders: 2, category: "vfx" },
  { name: "POST (1 SLIDE)", sales: 279.72, orders: 4, category: "gfx" },
]

const clientsData = [
  { name: "MECA Corporation", orders: 8, revenue: 4200.5, lastOrder: "2024-01-15" },
  { name: "NIKE Store", orders: 6, revenue: 3800.2, lastOrder: "2024-01-14" },
  { name: "Startup Tech", orders: 4, revenue: 2650.0, lastOrder: "2024-01-12" },
  { name: "Local Business", orders: 3, revenue: 1890.3, lastOrder: "2024-01-10" },
  { name: "Creative Agency", orders: 7, revenue: 2879.5, lastOrder: "2024-01-08" },
]

const monthlyData = [
  { month: "Enero", gfx: 3240.8, vfx: 12179.7, total: 15420.5 },
  { month: "Diciembre", gfx: 2890.4, vfx: 10250.3, total: 13140.7 },
  { month: "Noviembre", gfx: 2650.2, vfx: 9800.5, total: 12450.7 },
]

export default function ReportsPage() {
  const getCategoryBadge = (category: string) => {
    return category === "gfx" ? (
      <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
    ) : (
      <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
        <div className="flex space-x-2">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mes</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesData.totalSales.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+18.2% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.totalOrders}</div>
            <p className="text-xs text-blue-600 mt-1">+12.5% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesData.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-purple-600 mt-1">+5.8% vs mes anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.newClients}</div>
            <p className="text-xs text-orange-600 mt-1">+33.3% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Comparación GFX vs VFX */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos por Tipo de Servicio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
                  <span className="font-medium">Efectos Visuales</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">${salesData.vfxRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">78.9% del total</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
                  <span className="font-medium">Diseño Gráfico</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">${salesData.gfxRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">21.1% del total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${month.total.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      VFX: ${month.vfx.toLocaleString()} | GFX: ${month.gfx.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos más vendidos */}
      <Card>
        <CardHeader>
          <CardTitle>Productos/Servicios Más Vendidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto/Servicio</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Promedio por Pedido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{getCategoryBadge(product.category)}</TableCell>
                  <TableCell>{product.orders}</TableCell>
                  <TableCell className="font-semibold text-green-600">${product.sales.toLocaleString()}</TableCell>
                  <TableCell>${(product.sales / product.orders).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Mejores Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Ingresos Totales</TableHead>
                <TableHead>Promedio por Pedido</TableHead>
                <TableHead>Último Pedido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsData.map((client) => (
                <TableRow key={client.name}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.orders}</TableCell>
                  <TableCell className="font-semibold text-green-600">${client.revenue.toLocaleString()}</TableCell>
                  <TableCell>${(client.revenue / client.orders).toFixed(2)}</TableCell>
                  <TableCell>{client.lastOrder}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
