import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthLayout } from "@/components/auth/auth-layout"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <AuthLayout
      title="Sign in to INPROMA"
      description="Access your investment profile and portfolio workspace."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  )
}
