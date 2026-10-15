export type UserRole = "Investor" | "Admin"

/**
 * Safe user shape used across the frontend. The backend entity currently
 * also serialises `password`; that field is intentionally never typed or read here.
 */
export interface User {
  userId: number
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  name: string
  email: string
  role: UserRole
}
