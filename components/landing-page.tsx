"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Presentation, Zap, Palette, Download, Star, ArrowRight, Check, Sparkles } from "lucide-react"
import AuthModal from "./auth-modal"

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description: "Create professional presentations in seconds with advanced AI technology",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Choose from dozens of professionally designed templates",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description: "Export to PowerPoint, PDF, and Google Slides",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    content: "This tool has revolutionized how we create presentations. What used to take hours now takes minutes!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Startup Founder",
    content: "Perfect for pitch decks. The AI understands exactly what investors want to see.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Manager",
    content: "Our sales presentations are now more engaging and professional than ever before.",
    rating: 5,
  },
]

const pricingTiers = [
  {
    name: "Free",
    credits: 5,
    price: 0,
    popular: false,
    features: ["5 presentations monthly", "All templates", "PDF export"],
  },
  {
    name: "Basic",
    credits: 10,
    price: 6,
    popular: true,
    features: ["100 presentations monthly", "All templates", "All export formats", "Priority support"],
  },
  {
    name: "Pro",
    credits: 25,
    price: 11,
    popular: false,
    features: ["25 presentations monthly", "All templates", "All export formats", "Priority support"],     
  },
  {
    name: "Enterprise",
    popular: false,
    features: [ "All Pro features", "API access", "Dedicated support"], 

    
  }
]

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup")
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
              <Presentation className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Slidex
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => openAuth("signin")} className="hidden sm:flex">
              Sign In
            </Button>
            <Button
              onClick={() => openAuth("signup")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50" />
        <div className="relative container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Mistix AI
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 bg-clip-text text-transparent leading-tight">
            Create Stunning
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Presentations
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform ideas into professional presentations in seconds. Our AI-powered platform helps you create,
            customize, and share beautiful slides that captivate your audience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button
              size="lg"
              onClick={() => openAuth("signup")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-xl shadow-purple-500/25 px-8 py-4 text-lg rounded-2xl"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>10 Free Credits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make presentation creation effortless and professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600">Join thousands of users creating amazing presentations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your needs. Start free, upgrade anytime.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative border-2 rounded-2xl ${
                  tier.popular
                    ? "border-purple-500 shadow-xl shadow-purple-500/25 scale-105"
                    : "border-gray-200 hover:border-gray-300"
                } transition-all duration-300`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-gray-500 ml-2">/ {tier.credits} credits</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full py-3 rounded-xl ${
                      tier.popular
                        ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/25"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => openAuth("signup")}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Presentations?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who create stunning presentations in seconds
          </p>
          <Button
            size="lg"
            onClick={() => openAuth("signup")}
            className="bg-white text-purple-600 hover:bg-gray-50 shadow-xl px-8 py-4 text-lg rounded-2xl"
          >
            Start Free 
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl">
                <Presentation className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Slidex</span>
            </div>
            <div className="text-gray-400 text-sm">© 2025 Mistix AI. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
