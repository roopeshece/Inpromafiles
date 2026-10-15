import { apiRequest } from "@/lib/api"
import { toSafeUser } from "@/lib/api/users"
import type { User } from "@/types/user"

/**
 * PROPOSED authentication contract. These endpoints do NOT exist in the
 * current Spring Boot backend and must be implemented with Spring Security
 * (BCrypt + HttpOnly session cookie). See BACKEND_REQUIREMENTS.md.
 * When the backend responds 404 to these routes, the UI reports that the
 * authentication service is not yet available instead of faking a session.
 */
export const AUTH_ENDPOINTS = {
  me: "/auth/me",
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
} as const

export async function getCurrentUser(signal?: AbortSignal): Promise<User> {
  const user = await apiRequest<User>(AUTH_ENDPOINTS.me, { signal })
  return toSafeUser(user)
}

export async function login(credentials: {
  email: string
  password: string
}): Promise<User> {
  const user = await apiRequest<User>(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: credentials,
  })
  return toSafeUser(user)
}

export async function register(payload: {
  name: string
  email: string
  password: string
}): Promise<User> {
  const user = await apiRequest<User>(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: payload,
  })
  return toSafeUser(user)
}

export async function logout(): Promise<void> {
  await apiRequest<void>(AUTH_ENDPOINTS.logout, { method: "POST" })
}
