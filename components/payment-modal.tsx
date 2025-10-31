"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Zap, Star, Loader2, Mail } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  currentCredits: number
  userId?: string
}

const creditPackages = [
  {
    id: "basic",
    name: "Basic",
    credits: 10,
    price: 6,
    popular: false,
    savings: 0,
    features: ["10 presentations", "All templates", "PDF export","Support"],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 25,
    price: 11,
    popular: true,
    savings: 35,
    features: ["25 presentations", "All templates", "All export formats", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 500,
    price: 400,
    popular: false,
    savings: 0,
    features: ["more presentations", "Custom templates", "API access", "Dedicated support"],
  },
]

export default function PaymentModal({ isOpen, onClose, currentCredits }: PaymentModalProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    setLoading(packageId)

    try {
      const selectedPackage = creditPackages.find(pkg => pkg.id === packageId)
      if (!selectedPackage) return
      
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credits: selectedPackage.credits,
          price: selectedPackage.price
        })
      })

      const result = await response.json()
      
      if (result.success && result.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl
      } else {
        alert("Failed to create checkout session")
      }
    } catch {
      alert("An error occurred during payment processing")
    } finally {
      setLoading(null)
    }
  }

  const handleContactSupport = () => {
    window.location.href = "mailto:support@mistix.ai?subject=Enterprise%20Credits%20Inquiry"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Buy More Credits</DialogTitle>
          <div className="text-center">
            <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1">
              <Zap className="w-4 h-4 mr-1" />
              Current Balance: {currentCredits} credits
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {creditPackages.map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative border-2 rounded-2xl transition-all duration-300 ${
                pkg.popular
                  ? "border-purple-500 shadow-xl shadow-purple-500/25 scale-105"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {pkg.savings > 0 && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 text-xs">
                    Save {pkg.savings}%
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{pkg.name}</h3>

                {pkg.id !== "enterprise" ? (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-gray-900">${pkg.price}</div>
                    <div className="text-sm text-gray-500">{pkg.credits} credits</div>
                    <div className="text-xs text-gray-400 mt-1">${(pkg.price / pkg.credits).toFixed(2)} per credit</div>
                  </div>
                ) : (
                  <div className="mb-4 flex flex-col items-center">
                    <div className="text-3xl font-bold text-gray-900 opacity-0 select-none">$0</div>
                    <div className="text-sm text-gray-500">Custom credits</div>
                    <div className="text-xs text-gray-400 mt-1 opacity-0 select-none">$0.00 per credit</div>
                  </div>
                )}

                <ul className="text-left space-y-2 mb-6 text-sm">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {pkg.id !== "enterprise" ? (
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={loading !== null}
                    className={`w-full py-3 rounded-xl ${
                      pkg.popular
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {loading === pkg.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Purchase Credits
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleContactSupport}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-500/25"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="mb-2">💳 Secure payment powered by Stripe</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
