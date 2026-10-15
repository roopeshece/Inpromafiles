import type { Metadata } from "next"

import { AuthLayout } from "@/components/auth/auth-layout"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start building a structured picture of your investments."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
