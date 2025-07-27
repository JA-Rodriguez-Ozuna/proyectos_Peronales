import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CreditCard, Clock, AlertTriangle } from "lucide-react"

const payables = [
  {
    id: "BILL001",
    supplier: "Textiles Mayorista",
    amount: 1500.0,
    dueDate: "2024-01-30",
    status: "Pendiente",
    description: "Compra de camisetas en blanco",
  },
  {
    id: "BILL002",
    supplier: "Suministros Gráficos",
    amount: 800.0,
    dueDate: "2024-02-05",
    status: "Pendiente",
    description: "Tintas y materiales de impresión",
  },
  {
    id: "BILL003",
    supplier: "Materiales Premium",
    amount: 600.0,
    dueDate: "2024-01-25",
    status: "Vencido",
    description: "Materiales premium para sublimación",
  },
]

export default function PayablesPage() {
  const totalPayable = payables.reduce((sum, item) => sum + item.amount, 0)
  const overdueCount = payables.filter((item) => item.status === "Vencido").length
  const pendingCount = payables.filter((item) => item.status === "Pendiente").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cuentas por Pagar</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Pagar</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPayable.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Facturas Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
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
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.status === "Pendiente" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Marcar Pagado
                      </Button>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
