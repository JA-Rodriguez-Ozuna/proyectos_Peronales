"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react"
import { api } from "@/lib/api"

interface Customer {
  id: number
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
  notas?: string
  created_at?: string
}

interface CustomerDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: number | null
}

export function CustomerDetailsDialog({ open, onOpenChange, customerId }: CustomerDetailsDialogProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadCustomerDetails = async (id: number) => {
    try {
      setLoading(true)
      setError("")

      // Get customer details
      const customerResponse = await api.getCliente(id)
      if (customerResponse.ok) {
        const customerData = await customerResponse.json()
        setCustomer(customerData)
      } else {
        throw new Error("Error al cargar datos del cliente")
      }

    } catch (error) {
      console.error("Error loading customer details:", error)
      setError("Error al cargar los detalles del cliente")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && customerId) {
      loadCustomerDetails(customerId)
    } else {
      setCustomer(null)
      setError("")
    }
  }, [open, customerId])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }


  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cargando detalles...</DialogTitle>
            <DialogDescription>Obteniendo información del cliente</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Error al cargar</DialogTitle>
            <DialogDescription>No se pudieron obtener los detalles del cliente</DialogDescription>
          </DialogHeader>
          <div className="text-center text-red-600 py-8">
            <p>{error}</p>
            <Button onClick={() => customerId && loadCustomerDetails(customerId)} className="mt-4">
              Reintentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalles del Cliente
          </DialogTitle>
          <DialogDescription>
            Información completa y historial de pedidos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Nombre</p>
                    <p className="text-sm text-gray-600">{customer.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{customer.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-sm text-gray-600">{customer.telefono || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Fecha de Registro</p>
                    <p className="text-sm text-gray-600">{formatDate(customer.created_at || "")}</p>
                  </div>
                </div>
              </div>

              {customer.direccion && (
                <div className="flex items-start gap-3 pt-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-sm text-gray-600">{customer.direccion}</p>
                  </div>
                </div>
              )}

              {customer.notas && (
                <div className="pt-2">
                  <p className="text-sm font-medium mb-1">Notas</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{customer.notas}</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}