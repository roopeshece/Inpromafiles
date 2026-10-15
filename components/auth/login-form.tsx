"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, KeyRound } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { useAuth } from "@/components/auth/auth-provider"
import { PasswordInput } from "@/components/auth/password-input"
import { homeForRole } from "@/components/auth/require-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ApiError, getErrorMessage } from "@/lib/api"
import { loginSchema } from "@/lib/validations"

type LoginValues = z.infer<typeof loginSchema>

function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null
}

export function LoginForm() {
  const { login, status, user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(homeForRole(user.role))
    }
  }, [status, user, router])

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    try {
      const signedIn = await login(values)
      const next = safeNext(params.get("next"))
      const home = homeForRole(signedIn.role)
      const allowed =
        next && (signedIn.role === "Admin" ? next.startsWith("/admin") : !next.startsWith("/admin"))
      router.replace(allowed ? next : home)
    } catch (error) {
      if (error instanceof ApiError && (error.isUnauthorized || error.status === 400)) {
        setFormError("The email or password you entered is incorrect.")
      } else if (error instanceof ApiError && error.isNotFound) {
        setFormError(
          "The sign-in service is not yet available on the backend. Secure authentication must be implemented before you can sign in."
        )
      } else {
        setFormError(getErrorMessage(error))
      }
    }
  }

  const { errors, isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {status === "not-implemented" ? (
        <Alert>
          <KeyRound />
          <AlertTitle>Authentication pending</AlertTitle>
          <AlertDescription>
            The backend does not yet expose authentication endpoints. Sign-in
            will work once they are implemented.
          </AlertDescription>
        </Alert>
      ) : null}
      {formError ? (
        <Alert variant="destructive" aria-live="assertive">
          <AlertCircle />
          <AlertTitle>Unable to sign in</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...form.register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...form.register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        Sign In
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
          Create one
        </Link>
      </p>
    </form>
  )
}
