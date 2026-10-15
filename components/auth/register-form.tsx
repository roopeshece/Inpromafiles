"use client"

import Link from "next/link"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import type { z } from "zod"

import { PasswordInput } from "@/components/auth/password-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ApiError, getErrorMessage } from "@/lib/api"
import { register as registerAccount } from "@/lib/api/auth"
import { registerSchema } from "@/lib/validations"

type RegisterValues = z.input<typeof registerSchema>

export function RegisterForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false as unknown as true,
    },
  })

  async function onSubmit(values: RegisterValues) {
    setFormError(null)
    try {
      await registerAccount({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      })
      setRegistered(true)
    } catch (error) {
      if (error instanceof ApiError && error.isConflict) {
        form.setError("email", { message: "An account with this email already exists." })
      } else if (error instanceof ApiError && error.isNotFound) {
        setFormError(
          "The registration service is not yet available on the backend. Secure registration must be implemented before accounts can be created."
        )
      } else {
        setFormError(getErrorMessage(error))
      }
    }
  }

  if (registered) {
    return (
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Account created</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>Your investor account has been created. You can now sign in.</span>
          <Button asChild size="sm" className="w-fit">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const { errors, isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {formError ? (
        <Alert variant="destructive" aria-live="assertive">
          <AlertCircle />
          <AlertTitle>Unable to create account</AlertTitle>
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput id="password" autoComplete="new-password" aria-invalid={!!errors.password} {...form.register("password")} />
          <FieldDescription>At least 8 characters, including a letter and a number.</FieldDescription>
          <FieldError errors={[errors.password]} />
        </Field>
        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
          <FieldError errors={[errors.confirmPassword]} />
        </Field>
        <Controller
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <Field orientation="horizontal" data-invalid={!!errors.acceptTerms}>
              <Checkbox
                id="acceptTerms"
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.acceptTerms}
              />
              <div className="flex flex-col gap-1">
                <FieldLabel htmlFor="acceptTerms" className="font-normal">
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary underline-offset-4 hover:underline">
                      Terms of Use
                    </Link>{" "}
                    and understand INPROMA is not investment advice.
                  </span>
                </FieldLabel>
                <FieldError errors={[errors.acceptTerms]} />
              </div>
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
        Create account
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
