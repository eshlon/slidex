"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import Dashboard from "@/components/dashboard"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/?auth=required")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div> // Or a proper loading spinner
  }

  if (!user) {
    return null // Or a redirect component
  }

  return <Dashboard user={user} />
}
