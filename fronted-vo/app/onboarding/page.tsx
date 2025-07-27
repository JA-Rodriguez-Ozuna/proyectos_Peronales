"use client"

import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/logo"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Building, Settings, CreditCard } from "lucide-react"

const steps = [
  { id: 1, name: "Información de la Empresa", icon: Building },
  { id: 2, name: "Configuración Inicial", icon: Settings },
  { id: 3, name: "Plan y Pago", icon: CreditCard },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: "",
    industry: "",
    companySize: "",
    address: "",
    phone: "",
    website: "",

    // Step 2: Initial Setup
    currency: "USD",
    timezone: "America/New_York",
    businessType: "",

    // Step 3: Plan
    selectedPlan: "profesional",
  })
  const router = useRouter()

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Here you would create the tenant/company and set up their database
    console.log("Creating company:", formData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard
    router.push("/dashboard")
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Configuración Inicial</h1>
          <p className="text-gray-600 mt-2">Vamos a configurar tu cuenta en unos simples pasos</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center ${step.id <= currentStep ? "text-blue-600" : "text-gray-400"}`}
              >
                <step.icon className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Logo width={200} height={60} />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Plus Graphics</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Cuéntanos sobre tu empresa"}
              {currentStep === 2 && "Configuremos los aspectos básicos"}
              {currentStep === 3 && "Selecciona tu plan"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nombre de la Empresa *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData("companyName", e.target.value)}
                      placeholder="Mi Empresa S.A."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industria</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar industria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail/Comercio</SelectItem>
                        <SelectItem value="restaurant">Restaurante</SelectItem>
                        <SelectItem value="services">Servicios</SelectItem>
                        <SelectItem value="manufacturing">Manufactura</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companySize">Tamaño de la Empresa</Label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => updateFormData("companySize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Número de empleados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 empleados</SelectItem>
                        <SelectItem value="6-20">6-20 empleados</SelectItem>
                        <SelectItem value="21-50">21-50 empleados</SelectItem>
                        <SelectItem value="51+">51+ empleados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Dirección completa de la empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Sitio Web (opcional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://miempresa.com"
                  />
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Moneda Principal</Label>
                    <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                        <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select value={formData.timezone} onValueChange={(value) => updateFormData("timezone", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Este (New York)</SelectItem>
                        <SelectItem value="America/Chicago">Central (Chicago)</SelectItem>
                        <SelectItem value="America/Denver">Montaña (Denver)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacífico (Los Angeles)</SelectItem>
                        <SelectItem value="America/Mexico_City">México (Ciudad de México)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessType">Tipo de Negocio</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => updateFormData("businessType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="¿Qué tipo de negocio tienes?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Tienda física</SelectItem>
                      <SelectItem value="online">Solo online</SelectItem>
                      <SelectItem value="both">Físico y online</SelectItem>
                      <SelectItem value="service">Solo servicios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Selecciona tu Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "basico", name: "Básico", price: 29, features: ["100 productos", "1 usuario"] },
                    {
                      id: "profesional",
                      name: "Profesional",
                      price: 79,
                      features: ["Ilimitado", "5 usuarios"],
                      popular: true,
                    },
                    {
                      id: "empresarial",
                      name: "Empresarial",
                      price: 199,
                      features: ["Todo incluido", "Usuarios ilimitados"],
                    },
                  ].map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all ${
                        formData.selectedPlan === plan.id ? "border-blue-500 bg-blue-50" : ""
                      } ${plan.popular ? "border-green-500" : ""}`}
                      onClick={() => updateFormData("selectedPlan", plan.id)}
                    >
                      <CardHeader className="text-center">
                        {plan.popular && <Badge className="mb-2">Recomendado</Badge>}
                        <CardTitle>{plan.name}</CardTitle>
                        <div className="text-2xl font-bold">${plan.price}/mes</div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {plan.features.map((feature, idx) => (
                            <li key={idx}>• {feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">🎉 14 días de prueba gratuita</p>
                  <p className="text-green-700 text-sm">No se requiere tarjeta de crédito para comenzar</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Anterior
              </Button>

              {currentStep < steps.length ? (
                <Button onClick={nextStep} disabled={!formData.companyName}>
                  Siguiente
                </Button>
              ) : (
                <Button onClick={handleSubmit}>Crear Mi Cuenta</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
