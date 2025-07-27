"use client"

import React, { useState } from "react"
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

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCustomerCreated?: () => void
}

export function CustomerDialog({ open, onOpenChange, onCustomerCreated }: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!formData.nombre) {
        setError("El nombre es obligatorio")
        setIsSubmitting(false)
        return
      }

      // Crear cliente en el backend
      const response = await api.crearCliente(formData)
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Cliente creado:", result)
        
        // Limpiar formulario
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          direccion: "",
        })
        
        // Cerrar diálogo
        onOpenChange(false)
        
        // Notificar éxito
        alert("¡Cliente creado exitosamente!")
        
        // Recargar lista (si la función existe)
        if (onCustomerCreated) {
          onCustomerCreated()
        }
      } else {
        const errorData = await response.json()
        setError(errorData.mensaje || "Error al crear cliente")
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
    })
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
          <DialogDescription>Agrega un nuevo cliente al sistema.</DialogDescription>
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
                placeholder="Nombre del cliente"
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
                placeholder="cliente@email.com"
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
                placeholder="+1 234 567 8900"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="direccion" className="text-right">
                Dirección
              </Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="col-span-3"
                placeholder="Dirección del cliente"
                rows={2}
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
              {isSubmitting ? "Guardando..." : "Guardar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}