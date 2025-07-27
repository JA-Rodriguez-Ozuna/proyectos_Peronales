"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  CreditCard,
  DollarSign,
  BarChart3,
  Settings,
} from "lucide-react"

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Ventas", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Pedidos", href: "/dashboard/orders", icon: FileText },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Cuentas por Cobrar", href: "/dashboard/receivables", icon: DollarSign },
  { name: "Cuentas por Pagar", href: "/dashboard/payables", icon: CreditCard },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
]

const employeeNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Productos", href: "/dashboard/products", icon: Package },
  { name: "Ventas", href: "/dashboard/sales", icon: ShoppingCart },
  { name: "Pedidos", href: "/dashboard/orders", icon: FileText },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Cuentas por Cobrar", href: "/dashboard/receivables", icon: DollarSign },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = user?.role === "admin" ? adminNavigation : employeeNavigation

  return (
    <div className="flex flex-col w-64 bg-white shadow-sm">
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <Image
          src="/images/plus-graphics-header-logo.jpeg"
          alt="Plus Graphics"
          width={160}
          height={50}
          className="object-contain"
          priority
        />
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User info at bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
