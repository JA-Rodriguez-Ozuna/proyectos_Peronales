import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Users, 
  Building2, 
  Package, 
  Database,
  Bell,
  Shield,
  Download,
  Upload
} from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        <Badge variant="secondary" className="text-sm">
          Versión Beta
        </Badge>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <p className="text-blue-800 font-medium">Módulo en desarrollo - Próximamente más opciones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gestión de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Gestión de Usuarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Administra cuentas de usuario, roles y permisos del sistema.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                Cambiar Contraseñas
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Gestionar Roles
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Actividad de Usuarios
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>

        {/* Datos de Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-green-600" />
              <span>Datos de Empresa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Configura información, logo y datos fiscales de Plus Graphics.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                Editar Información
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Cambiar Logo
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Datos Fiscales
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>

        {/* Configuración de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <span>Configuración de Productos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Gestiona categorías, tipos de servicio y precios por defecto.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                Categorías GFX/VFX
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Precios por Defecto
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Tipos de Servicio
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>

        {/* Respaldos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-600" />
              <span>Respaldos y Datos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Gestiona copias de seguridad y exportación de datos.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Importar Datos
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Crear Respaldo
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-yellow-600" />
              <span>Notificaciones</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Configura alertas, recordatorios y notificaciones del sistema.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                Alertas de Vencimiento
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Recordatorios de Pago
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Notificaciones Email
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span>Seguridad</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">
              Configuraciones de seguridad y auditoría del sistema.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" disabled className="w-full">
                Registro de Actividad
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Políticas de Acceso
              </Button>
              <Button variant="outline" size="sm" disabled className="w-full">
                Auditoría de Cambios
              </Button>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold">Base de Datos</div>
              <div className="text-2xl font-bold text-green-700">✓</div>
              <div className="text-sm text-green-600">Conectada</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold">Usuarios</div>
              <div className="text-2xl font-bold text-blue-700">7</div>
              <div className="text-sm text-blue-600">Activos</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-semibold">Módulos</div>
              <div className="text-2xl font-bold text-purple-700">5/8</div>
              <div className="text-sm text-purple-600">Implementados</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-yellow-600 font-semibold">Versión</div>
              <div className="text-2xl font-bold text-yellow-700">1.0</div>
              <div className="text-sm text-yellow-600">Beta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}