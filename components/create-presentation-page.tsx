"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import SlideCreationForm from "./slide-creation-form"
import PaymentModal from "./payment-modal"
import Navbar from "./navbar"

interface CreatePresentationPageProps {
  user: {
    id: string
    name: string
    email: string
    credits: number
    avatar_url?: string
  }
}

export default function CreatePresentationPage({ user }: CreatePresentationPageProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button variant="ghost" asChild className="text-gray-500 hover:text-gray-700">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create New Presentation</h1>
              <p className="text-gray-600 mt-1">Generate beautiful slides with AI assistance</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center space-x-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buy Credits</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Credits Warning */}
        {user.credits <= 5 && (
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900">Low Credits Warning</h3>
                    <p className="text-sm text-amber-700">
                      You have {user.credits} credits remaining. Each presentation costs 1 credit.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Buy More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content - Creation Form */}
        <div className="max-w-4xl mx-auto">
          <SlideCreationForm />
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        currentCredits={user.credits}
      />
    </div>
  )
}
