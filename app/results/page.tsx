import SlideResults from "@/components/slide-results"
import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function ResultsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/?auth=required")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SlideResults user={user} />
    </div>
  )
}
