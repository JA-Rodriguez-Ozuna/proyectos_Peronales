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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

interface Customer {
  id: number
  nombre: string
  email?: string
  telefono?: string
  direccion?: string
  notas?: string
}

interface CustomerEditDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerUpdated: () => void
}

export function CustomerEditDialog({ customer, open, onOpenChange, onCustomerUpdated }: CustomerEditDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    notas: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Update form when customer changes (for edit mode)
  useEffect(() => {
    if (customer) {
      setFormData({
        nombre: customer.nombre || "",
        email: customer.email || "",
        telefono: customer.telefono || "",
        direccion: customer.direccion || "",
        notas: customer.notas || "",
      })
    } else {
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        notas: "",
      })
    }
  }, [customer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        setError("El nombre es obligatorio")
        setIsSubmitting(false)
        return
      }

      if (!customer) {
        setError("No se pudo identificar el cliente a editar")
        setIsSubmitting(false)
        return
      }

      // Actualizar cliente en el backend
      const customerData = {
        nombre: formData.nombre.trim(),
        email: formData.email.trim() || "",
        telefono: formData.telefono.trim() || "",
        direccion: formData.direccion.trim() || "",
        notas: formData.notas.trim() || ""
      }

      const response = await api.actualizarCliente(customer.id, customerData)
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Cliente actualizado:", result)
        
        // Cerrar diálogo
        onOpenChange(false)
        
        // Notificar éxito
        alert("¡Cliente actualizado exitosamente!")
        
        // Recargar lista
        onCustomerUpdated()
      } else {
        const errorData = await response.json()
        setError(errorData.mensaje || "Error al actualizar cliente")
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Actualiza la información de este cliente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre *
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="col-span-3"
                placeholder="Nombre completo del cliente"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                placeholder="email@ejemplo.com"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefono" className="text-right">
                Teléfono
              </Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="col-span-3"
                placeholder="Número de teléfono"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="col-span-3"
                placeholder="Dirección completa"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notas" className="text-right">
                Notas
              </Label>
              <Textarea
                id="notas"
                value={formData.notas}
                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                className="col-span-3"
                placeholder="Notas adicionales sobre el cliente..."
                rows={3}
              />
            </div>

            {error && (
              <div className="col-span-4 text-red-600 text-sm text-center">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Actualizando..." : "Actualizar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}