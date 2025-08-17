"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, Briefcase, CreditCard, AlertTriangle } from "lucide-react"
// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plus-graphics.onrender.com'

export function StatsCards() {
  const [stats, setStats] = useState({
    totalGanancias: 0,
    entregas: 0,
    proyectosDisponibles: 0,
    totalPorPagar: 0,
    totalPorCobrar: 0,
    facturasVencidas: 0,
    loading: true
  })

  // Cargar estadísticas del backend usando nuevo endpoint unificado
  const loadStats = async () => {
    try {
      console.log('🔄 Cargando estadísticas dashboard...')
      
      // Usar el nuevo endpoint unificado /api/dashboard/stats
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const dashboardStats = await response.json()
      console.log('📊 Estadísticas cargadas:', dashboardStats)

      setStats({
        totalGanancias: dashboardStats.ganancias_totales || 0,
        entregas: dashboardStats.entregas_pendientes || 0,
        proyectosDisponibles: dashboardStats.servicios_disponibles || 0,
        totalPorPagar: dashboardStats.total_por_pagar || 0,
        totalPorCobrar: dashboardStats.total_por_cobrar || 0,
        facturasVencidas: dashboardStats.facturas_vencidas || 0,
        loading: false
      })

    } catch (error) {
      console.error("❌ Error loading dashboard stats:", error)
      setStats(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total por Pagar</CardTitle>
          <CreditCard className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalPorPagar.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Deudas pendientes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total por Cobrar</CardTitle>
          <DollarSign className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalPorCobrar.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Por cobrar a clientes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Facturas Vencidas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.facturasVencidas}</div>
          <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
        </CardContent>
      </Card>
    </div>
  )
}