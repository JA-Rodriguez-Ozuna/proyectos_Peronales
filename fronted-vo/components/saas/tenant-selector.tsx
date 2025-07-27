"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Building, ChevronDown, Plus } from "lucide-react"

interface Tenant {
  id: string
  name: string
  plan: string
  role: string
}

const mockTenants: Tenant[] = [
  { id: "1", name: "Plus Graphics", plan: "Profesional", role: "admin" },
  { id: "2", name: "Mi Tienda Online", plan: "Básico", role: "employee" },
  { id: "3", name: "Empresa Demo", plan: "Empresarial", role: "admin" },
]

export function TenantSelector() {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(mockTenants[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            <Building className="w-4 h-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">{currentTenant.name}</div>
              <div className="text-xs text-gray-500">{currentTenant.plan}</div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>Cambiar Empresa</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockTenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onClick={() => setCurrentTenant(tenant)}
            className={currentTenant.id === tenant.id ? "bg-blue-50" : ""}
          >
            <div className="flex flex-col">
              <span className="font-medium">{tenant.name}</span>
              <span className="text-xs text-gray-500">
                {tenant.plan} • {tenant.role}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="w-4 h-4 mr-2" />
          Crear Nueva Empresa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
