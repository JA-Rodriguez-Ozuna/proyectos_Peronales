import { StatsCards } from "@/components/dashboard/stats-cards"
import { OrdersTable } from "@/components/dashboard/orders-table"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <OrdersTable />
    </div>
  )
}
