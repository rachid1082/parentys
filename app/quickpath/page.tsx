import { redirect } from "next/navigation"

export default function QuickPathRedirect() {
  // Redirect to the first step
  redirect("/quickpath/00000000-0000-0000-0000-000000000001")
}
