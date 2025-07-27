import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, AlertTriangle } from "lucide-react"

const receivables = [
  {
    id: "INV001",
    customer: "MECA Corporation",
    amount: 1200.0,
    dueDate: "2024-01-15",
    status: "Pendiente",
    daysOverdue: 0,
  },
  {
    id: "INV002",
    customer: "NIKE Store",
    amount: 800.0,
    dueDate: "2024-01-10",
    status: "Vencido",
    daysOverdue: 5,
  },
  {
    id: "INV003",
    customer: "Local Business",
    amount: 450.0,
    dueDate: "2024-01-20",
    status: "Pendiente",
    daysOverdue: 0,
  },
]

export default function ReceivablesPage() {
  const totalPending = receivables.reduce((sum, item) => sum + item.amount, 0)
  const overdueCount = receivables.filter((item) => item.status === "Vencido").length
  const pendingCount = receivables.filter((item) => item.status === "Pendiente").length

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cuentas por Cobrar</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending.toFixed(2)}</div>
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
          <CardTitle>Lista de Cuentas por Cobrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factura</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Días Vencido</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receivables.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.customer}</TableCell>
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
                  <TableCell>{item.daysOverdue > 0 ? item.daysOverdue : "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Marcar Pagado
                      </Button>
                      <Button variant="ghost" size="sm">
                        Enviar Recordatorio
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
