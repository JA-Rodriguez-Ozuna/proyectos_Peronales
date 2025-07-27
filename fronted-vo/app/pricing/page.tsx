import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

const plans = [
  {
    name: "Básico",
    price: 29,
    description: "Perfecto para pequeños negocios",
    features: ["Hasta 100 productos", "1 usuario", "Ventas básicas", "Reportes básicos", "Soporte por email"],
    limitations: ["Sin cuentas por cobrar/pagar", "Sin API", "Sin personalización"],
    popular: false,
  },
  {
    name: "Profesional",
    price: 79,
    description: "Para negocios en crecimiento",
    features: [
      "Productos ilimitados",
      "Hasta 5 usuarios",
      "Gestión completa de inventario",
      "Cuentas por cobrar/pagar",
      "Reportes avanzados",
      "Soporte prioritario",
      "API básica",
    ],
    limitations: ["Sin personalización avanzada"],
    popular: true,
  },
  {
    name: "Empresarial",
    price: 199,
    description: "Para empresas establecidas",
    features: [
      "Todo ilimitado",
      "Usuarios ilimitados",
      "Múltiples sucursales",
      "API completa",
      "Personalización avanzada",
      "Soporte 24/7",
      "Integraciones personalizadas",
      "Backup automático",
    ],
    limitations: [],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Logo width={250} height={80} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Planes y Precios</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan perfecto para tu negocio. Todos los planes incluyen 14 días de prueba gratuita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  <Star className="w-3 h-3 mr-1" />
                  Más Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/mes</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Incluye:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-500 mb-2">Limitaciones:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href={`/register?plan=${plan.name.toLowerCase()}`}>Comenzar Prueba Gratuita</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas algo personalizado?</h2>
          <p className="text-gray-600 mb-6">
            Contáctanos para planes empresariales personalizados con características específicas para tu industria.
          </p>
          <Button size="lg" variant="outline">
            Contactar Ventas
          </Button>
        </div>
      </div>
    </div>
  )
}
