"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, DollarSign, Users, FileText, Download, Calendar, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plus-graphics.onrender.com'

// Tipos para TypeScript
interface DashboardData {
  ventas_totales: number;
  total_pedidos: number;
  valor_promedio: number;
  nuevos_clientes: number;
  crecimiento_ventas: number;
  crecimiento_pedidos: number;
  crecimiento_promedio: number;
  crecimiento_clientes: number;
}

interface IngresosData {
  [key: string]: {
    total: number;
    porcentaje: number;
  };
}

interface TendenciaItem {
  periodo: string;
  vfx: number;
  gfx: number;
  total: number;
}

interface ProductoTop {
  nombre: string;
  tipo: string;
  pedidos: number;
  ingresos: number;
  promedio: number;
}

interface ClienteTop {
  nombre: string;
  pedidos: number;
  ingresos: number;
  promedio: number;
  ultimo_pedido: string;
}

export default function ReportsPage() {
  // Estados
  const [periodo, setPeriodo] = useState('mes')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [ingresosData, setIngresosData] = useState<IngresosData | null>(null)
  const [tendenciaData, setTendenciaData] = useState<TendenciaItem[]>([])
  const [productosTop, setProductosTop] = useState<ProductoTop[]>([])
  const [clientesTop, setClientesTop] = useState<ClienteTop[]>([])

  // Función para cargar datos
  const cargarDatos = async (periodoSeleccionado: string) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Cargando datos de reportes para periodo:', periodoSeleccionado)
      
      const endpoints = [
        `${API_BASE_URL}/api/reportes/dashboard?periodo=${periodoSeleccionado}`,
        `${API_BASE_URL}/api/reportes/ingresos-tipo?periodo=${periodoSeleccionado}`,
        `${API_BASE_URL}/api/reportes/tendencia?periodo=${periodoSeleccionado}`,
        `${API_BASE_URL}/api/reportes/productos-top?periodo=${periodoSeleccionado}`,
        `${API_BASE_URL}/api/reportes/clientes-top?periodo=${periodoSeleccionado}`
      ]
      
      const responses = await Promise.all(
        endpoints.map(url => fetch(url).then(res => res.json()))
      )
      
      console.log('📊 Datos de reportes cargados:', {
        dashboard: responses[0],
        ingresos: responses[1],
        tendencia: responses[2],
        productos: responses[3],
        clientes: responses[4]
      })
      
      setDashboardData(responses[0])
      setIngresosData(responses[1])
      setTendenciaData(responses[2] || [])
      setProductosTop(responses[3] || [])
      setClientesTop(responses[4] || [])
      
    } catch (err) {
      setError('Error al cargar los datos de reportes')
      console.error('❌ Error cargando reportes:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Función para exportar
  const exportarReporte = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reportes/exportar?periodo=${periodo}&formato=excel`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `reporte_plusgraphics_${periodo}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError('Error al exportar el reporte')
      }
    } catch (err) {
      setError('Error al exportar el reporte')
      console.error('Error:', err)
    }
  }
  
  // Cargar datos cuando cambia el periodo
  useEffect(() => {
    cargarDatos(periodo)
  }, [periodo])
  
  // Helper para badges
  const getCategoryBadge = (category: string) => {
    return category === "GFX" ? (
      <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
    ) : (
      <Badge className="bg-blue-200 text-blue-800">VFX</Badge>
    )
  }
  
  // Helper para mostrar crecimientos
  const getCrecimientoColor = (crecimiento: number) => {
    if (crecimiento > 0) return "text-green-600"
    if (crecimiento < 0) return "text-red-600"
    return "text-gray-600"
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando reportes...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => cargarDatos(periodo)}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
        <div className="flex space-x-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Esta Semana</SelectItem>
              <SelectItem value="mes">Este Mes</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Año</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportarReporte} disabled={loading}>
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
            <div className="text-2xl font-bold">${dashboardData?.ventas_totales?.toLocaleString() || '0'}</div>
            <p className={`text-xs mt-1 ${getCrecimientoColor(dashboardData?.crecimiento_ventas || 0)}`}>
              {dashboardData?.crecimiento_ventas > 0 ? '+' : ''}{dashboardData?.crecimiento_ventas || 0}% vs periodo anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_pedidos || 0}</div>
            <p className={`text-xs mt-1 ${getCrecimientoColor(dashboardData?.crecimiento_pedidos || 0)}`}>
              {dashboardData?.crecimiento_pedidos > 0 ? '+' : ''}{dashboardData?.crecimiento_pedidos || 0}% vs periodo anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData?.valor_promedio?.toFixed(2) || '0.00'}</div>
            <p className={`text-xs mt-1 ${getCrecimientoColor(dashboardData?.crecimiento_promedio || 0)}`}>
              {dashboardData?.crecimiento_promedio > 0 ? '+' : ''}{dashboardData?.crecimiento_promedio || 0}% vs periodo anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.nuevos_clientes || 0}</div>
            <p className={`text-xs mt-1 ${getCrecimientoColor(dashboardData?.crecimiento_clientes || 0)}`}>
              {dashboardData?.crecimiento_clientes > 0 ? '+' : ''}{dashboardData?.crecimiento_clientes || 0}% vs periodo anterior
            </p>
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
                  <div className="text-2xl font-bold text-blue-600">${ingresosData?.VFX?.total?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-600">{ingresosData?.VFX?.porcentaje || 0}% del total</div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className="bg-yellow-200 text-yellow-800">GFX</Badge>
                  <span className="font-medium">Diseño Gráfico</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">${ingresosData?.GFX?.total?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-600">{ingresosData?.GFX?.porcentaje || 0}% del total</div>
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
              {tendenciaData.length > 0 ? (
                tendenciaData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{item.periodo}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${item.total.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        VFX: ${item.vfx.toLocaleString()} | GFX: ${item.gfx.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de tendencia disponibles</p>
              )}
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
              {productosTop.length > 0 ? (
                productosTop.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{product.nombre}</TableCell>
                    <TableCell>{getCategoryBadge(product.tipo)}</TableCell>
                    <TableCell>{product.pedidos}</TableCell>
                    <TableCell className="font-semibold text-green-600">${product.ingresos.toLocaleString()}</TableCell>
                    <TableCell>${product.promedio.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No hay datos de productos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Análisis de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📊 Análisis de Mejores Clientes
            </h3>
            <p className="text-gray-600 mb-3">
              Funcionalidad avanzada disponible próximamente
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Ranking por frecuencia de pedidos</p>
              <p>• Análisis de valor total por cliente</p>
              <p>• Identificación de clientes VIP</p>
              <p>• Patrones de compra y retención</p>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                En desarrollo
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
