"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Clock, AlertTriangle, Plus, RefreshCw, Eye, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plus-graphics.onrender.com'

interface CuentaPorPagar {
  id: number
  codigo_factura: string
  proveedor: string
  monto: number
  monto_pagado: number
  saldo: number
  fecha_vencimiento: string
  estado: string
  descripcion?: string
  dias_vencido: number
  fecha_pago?: string
}

interface Stats {
  total_por_pagar: number
  facturas_pendientes: number
  facturas_vencidas: number
  proximas_vencer: number
}

export default function PayablesPage() {
  const [payables, setPayables] = useState<CuentaPorPagar[]>([])
  const [stats, setStats] = useState<Stats>({
    total_por_pagar: 0,
    facturas_pendientes: 0,
    facturas_vencidas: 0,
    proximas_vencer: 0
  })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<CuentaPorPagar | null>(null)
  
  // Estados para formulario de nueva cuenta
  const [formData, setFormData] = useState({
    proveedor: '',
    monto: '',
    fecha_vencimiento: '',
    descripcion: ''
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [payablesRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/cuentas-por-pagar`),
        fetch(`${API_BASE_URL}/api/cuentas-por-pagar/stats`)
      ])
      
      const payablesData = await payablesRes.json()
      const statsData = await statsRes.json()
      
      setPayables(payablesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarcarPagado = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cuentas-por-pagar/${id}/marcar-pagado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        loadData() // Recargar datos
      }
    } catch (error) {
      console.error('Error marcando como pagado:', error)
    }
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/cuentas-por-pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monto: parseFloat(formData.monto)
        })
      })
      
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({
          proveedor: '',
          monto: '',
          fecha_vencimiento: '',
          descripcion: ''
        })
        loadData()
      }
    } catch (error) {
      console.error('Error creando cuenta:', error)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('¿Estás seguro? Esta acción eliminará TODAS las cuentas por pagar y no se puede deshacer.')) {
      return
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/cuentas-por-pagar/all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        alert('Todas las cuentas por pagar han sido eliminadas')
        loadData() // Recargar datos
      } else {
        alert('Error al eliminar las cuentas')
      }
    } catch (error) {
      console.error('Error clearing all accounts:', error)
      alert('Error de conexión')
    }
  }

  const handleVerDetalles = (account: CuentaPorPagar) => {
    setSelectedAccount(account)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cuentas por Pagar</h1>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearAll}
            className="text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vaciar Todas las Cuentas
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cuenta por Pagar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <Label htmlFor="proveedor">Proveedor</Label>
                <Input
                  id="proveedor"
                  value={formData.proveedor}
                  onChange={(e) => setFormData({...formData, proveedor: e.target.value})}
                  required
                  placeholder="Nombre del proveedor"
                />
              </div>
              <div>
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) => setFormData({...formData, monto: e.target.value})}
                  required
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento</Label>
                <Input
                  id="fecha_vencimiento"
                  type="date"
                  value={formData.fecha_vencimiento}
                  onChange={(e) => setFormData({...formData, fecha_vencimiento: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  placeholder="Descripción del gasto o compra"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Cuenta</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Pagar</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total_por_pagar.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.facturas_pendientes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.facturas_vencidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas a Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proximas_vencer}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cuentas por Pagar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Días Vencido</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No hay cuentas por pagar registradas
                  </TableCell>
                </TableRow>
              ) : (
                payables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.codigo_factura}</TableCell>
                    <TableCell>{item.proveedor}</TableCell>
                    <TableCell>${item.monto.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">
                      ${item.saldo.toFixed(2)}
                    </TableCell>
                    <TableCell>{item.fecha_vencimiento}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.estado === "pendiente" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : item.estado === "vencido"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.dias_vencido > 0 ? `${item.dias_vencido} días` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {item.estado !== 'pagado' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMarcarPagado(item.id)}
                          >
                            Marcar Pagado
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleVerDetalles(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      {selectedAccount && (
        <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalles de Cuenta por Pagar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Factura</Label>
                  <p className="font-medium">{selectedAccount.codigo_factura}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <Badge
                    className={
                      selectedAccount.estado === "pendiente" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : selectedAccount.estado === "vencido"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {selectedAccount.estado.charAt(0).toUpperCase() + selectedAccount.estado.slice(1)}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Proveedor</Label>
                <p className="font-medium">{selectedAccount.proveedor}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monto Total</Label>
                  <p className="font-medium">${selectedAccount.monto.toFixed(2)}</p>
                </div>
                <div>
                  <Label>Saldo Pendiente</Label>
                  <p className="font-medium text-red-600">${selectedAccount.saldo.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <Label>Fecha de Vencimiento</Label>
                <p className="font-medium">{selectedAccount.fecha_vencimiento}</p>
              </div>
              {selectedAccount.descripcion && (
                <div>
                  <Label>Descripción</Label>
                  <p className="text-sm">{selectedAccount.descripcion}</p>
                </div>
              )}
              {selectedAccount.fecha_pago && (
                <div>
                  <Label>Fecha de Pago</Label>
                  <p className="font-medium text-green-600">{selectedAccount.fecha_pago}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
