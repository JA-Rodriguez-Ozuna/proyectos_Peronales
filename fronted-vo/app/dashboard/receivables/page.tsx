"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Clock, AlertTriangle, Plus, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface CuentaPorCobrar {
  id: number
  numero_factura: string
  cliente_id: number
  cliente_nombre: string
  pedido_id?: number
  pedido_numero?: number
  monto: number
  monto_pagado: number
  saldo: number
  fecha_vencimiento: string
  estado: string
  dias_vencido: number
  notas?: string
}

interface Cliente {
  id: number
  nombre: string
}

interface Stats {
  total_por_cobrar: number
  facturas_pendientes: number
  facturas_vencidas: number
  total_facturas: number
}

export default function ReceivablesPage() {
  const [receivables, setReceivables] = useState<CuentaPorCobrar[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [stats, setStats] = useState<Stats>({
    total_por_cobrar: 0,
    facturas_pendientes: 0,
    facturas_vencidas: 0,
    total_facturas: 0
  })
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Estados para formulario de nueva cuenta
  const [formData, setFormData] = useState({
    numero_factura: '',
    cliente_id: '',
    pedido_id: '',
    monto: '',
    fecha_vencimiento: '',
    notas: ''
  })

  // Cargar datos iniciales
  useEffect(() => {
    loadData()
    loadClientes()
  }, [])

  const loadData = async () => {
    try {
      const [receivablesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/cuentas-por-cobrar'),
        fetch('http://localhost:5000/api/cuentas-por-cobrar/stats')
      ])
      
      const receivablesData = await receivablesRes.json()
      const statsData = await statsRes.json()
      
      setReceivables(receivablesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadClientes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clientes')
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
  }

  const handleMarcarPagado = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cuentas-por-cobrar/${id}/marcar-pagado`, {
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
      const response = await fetch('http://localhost:5000/api/cuentas-por-cobrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          monto: parseFloat(formData.monto),
          cliente_id: parseInt(formData.cliente_id),
          pedido_id: formData.pedido_id ? parseInt(formData.pedido_id) : null
        })
      })
      
      if (response.ok) {
        setIsDialogOpen(false)
        setFormData({
          numero_factura: '',
          cliente_id: '',
          pedido_id: '',
          monto: '',
          fecha_vencimiento: '',
          notas: ''
        })
        loadData()
      }
    } catch (error) {
      console.error('Error creando cuenta:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Cuentas por Cobrar</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Cuenta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Cuenta por Cobrar</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div>
                <Label htmlFor="numero_factura">Número de Factura</Label>
                <Input
                  id="numero_factura"
                  value={formData.numero_factura}
                  onChange={(e) => setFormData({...formData, numero_factura: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cliente_id">Cliente</Label>
                <Select value={formData.cliente_id} onValueChange={(value) => setFormData({...formData, cliente_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label htmlFor="pedido_id">Pedido ID (opcional)</Label>
                <Input
                  id="pedido_id"
                  type="number"
                  value={formData.pedido_id}
                  onChange={(e) => setFormData({...formData, pedido_id: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="notas">Notas</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({...formData, notas: e.target.value})}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.total_por_cobrar.toFixed(2)}</div>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Cuentas por Cobrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Días Vencido</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No hay cuentas por cobrar registradas
                  </TableCell>
                </TableRow>
              ) : (
                receivables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.numero_factura}</TableCell>
                    <TableCell>{item.cliente_nombre}</TableCell>
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
                        <Button variant="ghost" size="sm" disabled>
                          Enviar Recordatorio
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
    </div>
  )
}
