export type EmploymentStatus =
  | "Student"
  | "Employed"
  | "Self_Employed"
  | "Unemployed"
  | "Retired"
  | "Other"

export type RiskTolerance = "Low" | "Medium" | "High"

export type InvestmentExperience = "Beginner" | "Intermediate" | "Advanced"

export type YesNo = "Yes" | "No"

export interface InvestmentProfile {
  profileId: number
  user?: { userId: number }
  age: number | null
  employmentStatus: EmploymentStatus | null
  investmentGoal: string
  riskTolerance: RiskTolerance
  investmentDuration: number
  investmentExperience: InvestmentExperience | null
  cryptoInvestor: YesNo | null
  cryptoRiskComfort: RiskTolerance | null
  informationSources: string | null
  investmentPreference: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface InvestmentProfileRequest {
  user?: { userId: number }
  age: number | null
  employmentStatus: EmploymentStatus | null
  investmentGoal: string
  riskTolerance: RiskTolerance
  investmentDuration: number
  investmentExperience: InvestmentExperience | null
  cryptoInvestor: YesNo
  cryptoRiskComfort: RiskTolerance | null
  informationSources: string | null
  investmentPreference: string | null
}
