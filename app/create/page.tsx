import CreatePresentationPage from "@/components/create-presentation-page"
import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"

export default async function CreatePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/?auth=required")
  }

  if (user.credits <= 0) {
    redirect("/dashboard?error=no-credits")
  }

  return <CreatePresentationPage user={user} />
}
