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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { api } from "@/lib/api"

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductCreated?: () => void
}

export function ProductDialog({ open, onOpenChange, onProductCreated }: ProductDialogProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    precio: "",
    descripcion: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Validaciones básicas
      if (!formData.nombre || !formData.tipo || !formData.precio) {
        setError("Por favor completa todos los campos obligatorios")
        setIsSubmitting(false)
        return
      }

      const precio = parseFloat(formData.precio)
      if (isNaN(precio) || precio <= 0) {
        setError("El precio debe ser un número válido mayor a 0")
        setIsSubmitting(false)
        return
      }

      // Crear producto en el backend
      const productData = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        precio: precio,
        descripcion: formData.descripcion || ""
      }

      const response = await api.crearProducto(productData)
      
      if (response.ok) {
        const result = await response.json()
        console.log("✅ Producto creado:", result)
        
        // Limpiar formulario
        setFormData({
          nombre: "",
          tipo: "",
          precio: "",
          descripcion: "",
        })
        
        // Cerrar diálogo
        onOpenChange(false)
        
        // Notificar éxito
        alert("¡Producto creado exitosamente!")
        
        // Recargar lista (si la función existe)
        if (onProductCreated) {
          onProductCreated()
        }
      } else {
        const errorData = await response.json()
        setError(errorData.mensaje || "Error al crear producto")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      setError("Error de conexión con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      nombre: "",
      tipo: "",
      precio: "",
      descripcion: "",
    })
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo Producto/Servicio</DialogTitle>
          <DialogDescription>
            Crea un nuevo producto o servicio para tu catálogo.
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
                placeholder="Ej: Logo Animation"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo *
              </Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gfx">GFX (Diseño Gráfico)</SelectItem>
                  <SelectItem value="vfx">VFX (Efectos Visuales)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="precio" className="text-right">
                Precio *
              </Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                min="0"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="col-span-3"
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="col-span-3"
                placeholder="Descripción del producto/servicio..."
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
              {isSubmitting ? "Creando..." : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}