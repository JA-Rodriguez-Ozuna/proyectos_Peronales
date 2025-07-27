"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, Briefcase } from "lucide-react"
import { api } from "@/lib/api"

export function StatsCards() {
  const [stats, setStats] = useState({
    totalGanancias: 0,
    entregas: 0,
    proyectosDisponibles: 0,
    loading: true
  })

  // Cargar estadísticas del backend
  const loadStats = async () => {
    try {
      // Cargar ventas, pedidos y productos en paralelo
      const [ventasRes, pedidosRes, productosRes] = await Promise.all([
        api.getVentas(),
        api.getPedidos(),
        api.getProductos()
      ])

      let totalGanancias = 0
      let entregas = 0
      let proyectosDisponibles = 0

      // Calcular ganancias totales de ventas
      if (ventasRes.ok) {
        const ventas = await ventasRes.json()
        totalGanancias = ventas.reduce((sum: number, venta: any) => sum + venta.total, 0)
      }

      // Calcular entregas pendientes (pedidos no terminados)
      if (pedidosRes.ok) {
        const pedidos = await pedidosRes.json()
        entregas = pedidos.filter((pedido: any) => 
          pedido.estado !== 'terminado' && pedido.estado !== 'completado'
        ).length
      }

      // Contar productos disponibles
      if (productosRes.ok) {
        const productos = await productosRes.json()
        proyectosDisponibles = productos.length
      }

      setStats({
        totalGanancias,
        entregas,
        proyectosDisponibles,
        loading: false
      })

    } catch (error) {
      console.error("Error loading stats:", error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Ganancias Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalGanancias.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">De ventas registradas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Entregas Pendientes</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.entregas}</div>
          <p className="text-xs text-gray-500 mt-1">Pedidos en proceso</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Servicios Disponibles</CardTitle>
          <Briefcase className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.proyectosDisponibles}</div>
          <p className="text-xs text-gray-500 mt-1">Productos/servicios</p>
        </CardContent>
      </Card>
    </div>
  )
}