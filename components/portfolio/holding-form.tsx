"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { useSWRConfig } from "swr"

import { useCurrentUser } from "@/components/auth/auth-provider"
import { ChangeValue } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useCategories } from "@/hooks/use-inproma-data"
import { getErrorMessage } from "@/lib/api"
import { createHolding, updateHolding } from "@/lib/api/holdings"
import { formatSignedINR, percentChange, formatPercent } from "@/lib/formatters"
import { holdingSchema, type HoldingFormValues } from "@/lib/validations"
import type { HoldingRequest, PortfolioHolding } from "@/types/holding"

function toDefaults(holding?: PortfolioHolding): HoldingFormValues {
  return {
    categoryId: holding?.category?.categoryId ? String(holding.category.categoryId) : "",
    assetName: holding?.assetName ?? "",
    investedAmount: holding ? String(holding.investedAmount) : "",
    quantity: holding ? String(holding.quantity) : "",
    currentValue: holding ? String(holding.currentValue) : "",
    purchaseDate: holding?.purchaseDate ?? "",
  }
}

export function HoldingForm({ holding }: { holding?: PortfolioHolding }) {
  const user = useCurrentUser()
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const categories = useCategories()
  const isEdit = !!holding

  const form = useForm<HoldingFormValues>({
    resolver: zodResolver(holdingSchema),
    defaultValues: toDefaults(holding),
  })
  const [invested, current] = useWatch({ control: form.control, name: ["investedAmount", "currentValue"] })
  const investedNum = Number(invested)
  const currentNum = Number(current)
  const showPreview = invested !== "" && current !== "" && Number.isFinite(investedNum) && Number.isFinite(currentNum)
  const change = Math.round((currentNum - investedNum) * 100) / 100

  async function onSubmit(values: HoldingFormValues) {
    const payload: HoldingRequest = {
      user: { userId: user.userId },
      category: { categoryId: Number(values.categoryId) },
      assetName: values.assetName.trim(),
      investedAmount: values.investedAmount,
      quantity: values.quantity,
      currentValue: values.currentValue,
      purchaseDate: values.purchaseDate || null,
    }
    try {
      if (holding) {
        await updateHolding(holding.holdingId, payload)
      } else {
        await createHolding(payload)
      }
      await mutate((key) => Array.isArray(key) && ["holdings", "holding", "balancing"].includes(key[0]))
      toast.success(isEdit ? "Holding updated." : "Holding added.")
      router.push("/portfolio")
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const { errors, isSubmitting } = form.formState

  return (
    <Card className="max-w-2xl">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <CardContent>
          <FieldGroup>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Field data-invalid={!!errors.categoryId}>
                  <FieldLabel htmlFor="categoryId">Asset category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={categories.isLoading}>
                    <SelectTrigger id="categoryId" aria-invalid={!!errors.categoryId} className="w-full">
                      <SelectValue placeholder={categories.isLoading ? "Loading categories" : "Select a category"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.data?.map((c) => (
                          <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                            {c.categoryName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {categories.error ? (
                    <FieldDescription>Categories could not be loaded: {getErrorMessage(categories.error)}</FieldDescription>
                  ) : null}
                  <FieldError errors={[errors.categoryId]} />
                </Field>
              )}
            />
            <Field data-invalid={!!errors.assetName}>
              <FieldLabel htmlFor="assetName">Asset name</FieldLabel>
              <Input id="assetName" placeholder="e.g. Nifty 50 Index Fund" aria-invalid={!!errors.assetName} {...form.register("assetName")} />
              <FieldError errors={[errors.assetName]} />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field data-invalid={!!errors.investedAmount}>
                <FieldLabel htmlFor="investedAmount">Invested amount (INR)</FieldLabel>
                <Input id="investedAmount" inputMode="decimal" placeholder="0.00" aria-invalid={!!errors.investedAmount} {...form.register("investedAmount")} />
                <FieldError errors={[errors.investedAmount]} />
              </Field>
              <Field data-invalid={!!errors.currentValue}>
                <FieldLabel htmlFor="currentValue">Current value (INR)</FieldLabel>
                <Input id="currentValue" inputMode="decimal" placeholder="0.00" aria-invalid={!!errors.currentValue} {...form.register("currentValue")} />
                <FieldError errors={[errors.currentValue]} />
              </Field>
              <Field data-invalid={!!errors.quantity}>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                <Input id="quantity" inputMode="decimal" placeholder="0" aria-invalid={!!errors.quantity} {...form.register("quantity")} />
                <FieldError errors={[errors.quantity]} />
              </Field>
              <Field data-invalid={!!errors.purchaseDate}>
                <FieldLabel htmlFor="purchaseDate">Purchase date (optional)</FieldLabel>
                <Input id="purchaseDate" type="date" aria-invalid={!!errors.purchaseDate} {...form.register("purchaseDate")} />
                <FieldError errors={[errors.purchaseDate]} />
              </Field>
            </div>
            {showPreview ? (
              <p className="rounded-md bg-muted px-3 py-2 text-sm" aria-live="polite">
                Gain / loss:{" "}
                <ChangeValue value={change}>
                  {formatSignedINR(change)} ({formatPercent(percentChange(change, investedNum), { signed: true })})
                </ChangeValue>
              </p>
            ) : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2 border-t">
          <Button asChild variant="outline" type="button">
            <Link href="/portfolio">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isEdit ? "Save changes" : "Add holding"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
