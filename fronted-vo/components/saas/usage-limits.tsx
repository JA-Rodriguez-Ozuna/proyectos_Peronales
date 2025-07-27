"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap } from "lucide-react"

interface UsageLimitsProps {
  tenantId: string
  planLimits: {
    products: number
    users: number
    orders_per_month: number
    storage_gb: number
  }
}

export function UsageLimits({ tenantId, planLimits }: UsageLimitsProps) {
  const [usage, setUsage] = useState({
    products: 245,
    users: 3,
    orders_per_month: 1250,
    storage_gb: 2.3,
  })

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return (current / limit) * 100
  }

  const isNearLimit = (current: number, limit: number) => {
    if (limit === -1) return false
    return current / limit >= 0.8
  }

  const isOverLimit = (current: number, limit: number) => {
    if (limit === -1) return false
    return current >= limit
  }

  const hasWarnings = Object.keys(usage).some((key) => {
    const current = usage[key as keyof typeof usage]
    const limit = planLimits[key as keyof typeof planLimits]
    return isNearLimit(current, limit) || isOverLimit(current, limit)
  })

  if (!hasWarnings) return null

  return (
    <div className="space-y-4">
      {Object.entries(usage).map(([key, current]) => {
        const limit = planLimits[key as keyof typeof planLimits]
        const percentage = getUsagePercentage(current, limit)
        const nearLimit = isNearLimit(current, limit)
        const overLimit = isOverLimit(current, limit)

        if (!nearLimit && !overLimit) return null

        return (
          <Alert key={key} variant={overLimit ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{key.replace("_", " ")}</span>
                  <span className="text-sm">
                    {current} / {limit === -1 ? "∞" : limit}
                  </span>
                </div>
                {limit !== -1 && (
                  <Progress value={percentage} className={`h-2 ${overLimit ? "bg-red-100" : "bg-yellow-100"}`} />
                )}
                <p className="text-sm">
                  {overLimit
                    ? `Has excedido el límite de ${key.replace("_", " ")}. Actualiza tu plan para continuar.`
                    : `Estás cerca del límite de ${key.replace("_", " ")}. Considera actualizar tu plan.`}
                </p>
                <Button size="sm" className="mt-2">
                  <Zap className="w-4 h-4 mr-2" />
                  Actualizar Plan
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )
      })}
    </div>
  )
}
