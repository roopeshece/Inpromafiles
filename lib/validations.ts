import { z } from "zod"

const decimal = (integerDigits: number, fractionDigits: number) =>
  new RegExp(`^\\d{1,${integerDigits}}(\\.\\d{1,${fractionDigits}})?$`)

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(150, "Email must be 150 characters or fewer.")
  .email("Enter a valid email address.")

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[A-Za-z]/, "Password must include a letter.")
  .regex(/\d/, "Password must include a number.")

export const nameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters.")
  .max(100, "Name must be 100 characters or fewer.")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
})

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
    acceptTerms: z.literal(true, {
      error: "You must accept the terms to continue.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

const today = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

const moneyField = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .regex(
      decimal(13, 2),
      `${label} must be a non-negative number with up to 2 decimal places.`
    )

export const holdingSchema = z.object({
  categoryId: z.string().min(1, "Select an asset category."),
  assetName: z
    .string()
    .trim()
    .min(1, "Asset name is required.")
    .max(150, "Asset name must be 150 characters or fewer."),
  investedAmount: moneyField("Invested amount"),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .regex(
      decimal(11, 4),
      "Quantity must be a positive number with up to 4 decimal places."
    )
    .refine((value) => Number(value) > 0, "Quantity must be greater than 0."),
  currentValue: moneyField("Current value"),
  purchaseDate: z
    .string()
    .refine(
      (value) => value === "" || value <= today(),
      "Purchase date cannot be in the future."
    ),
})

export type HoldingFormValues = z.infer<typeof holdingSchema>

export const profileSchema = z
  .object({
    age: z
      .string()
      .trim()
      .refine(
        (v) =>
          v === "" ||
          (/^\d{1,3}$/.test(v) && Number(v) >= 18 && Number(v) <= 120),
        "Enter an age between 18 and 120."
      ),
    employmentStatus: z.string(),
    investmentGoal: z
      .string()
      .trim()
      .min(1, "Investment goal is required.")
      .max(100, "Investment goal must be 100 characters or fewer."),
    investmentDuration: z
      .string()
      .trim()
      .min(1, "Investment duration is required.")
      .refine(
        (v) => /^\d{1,2}$/.test(v) && Number(v) >= 1 && Number(v) <= 60,
        "Enter a duration between 1 and 60 years."
      ),
    investmentExperience: z.string(),
    riskTolerance: z.enum(["Low", "Medium", "High"], {
      error: "Select a risk tolerance.",
    }),
    preferredCategoryIds: z.array(z.number()),
    cryptoInvestor: z.enum(["Yes", "No"], {
      error: "Select whether you invest in cryptocurrency.",
    }),
    cryptoRiskComfort: z.string(),
    informationSources: z.array(z.string()),
    investmentPreference: z
      .string()
      .trim()
      .max(255, "Notes must be 255 characters or fewer."),
  })
  .refine(
    (data) => data.cryptoInvestor === "No" || data.cryptoRiskComfort !== "",
    {
      path: ["cryptoRiskComfort"],
      message: "Select your crypto risk comfort.",
    }
  )
  .refine((data) => data.informationSources.join(", ").length <= 255, {
    path: ["informationSources"],
    message: "Too many information sources selected.",
  })

export type ProfileFormValues = z.infer<typeof profileSchema>

export const categorySchema = z.object({
  categoryName: z
    .string()
    .trim()
    .min(1, "Category name is required.")
    .max(50, "Category name must be 50 characters or fewer."),
  description: z
    .string()
    .trim()
    .max(255, "Description must be 255 characters or fewer."),
})

export type CategoryFormValues = z.infer<typeof categorySchema>

export const ruleSchema = z.object({
  categoryId: z.string().min(1, "Select a category."),
  recommendedPercentage: z
    .string()
    .trim()
    .min(1, "Recommended percentage is required.")
    .regex(decimal(3, 2), "Use a number with up to 2 decimal places.")
    .refine(
      (v) => Number(v) >= 0 && Number(v) <= 100,
      "Percentage must be between 0 and 100."
    ),
})

export type RuleFormValues = z.infer<typeof ruleSchema>

export const userCreateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["Investor", "Admin"]),
})

export const userUpdateSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: z.enum(["Investor", "Admin"]),
})

export type UserCreateFormValues = z.infer<typeof userCreateSchema>
export type UserUpdateFormValues = z.infer<typeof userUpdateSchema>
