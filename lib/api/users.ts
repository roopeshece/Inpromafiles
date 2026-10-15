import { apiRequest } from "@/lib/api"
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "@/types/user"

/** Strips any extra fields (notably `password`) the backend may serialise. */
export function toSafeUser(raw: User & Record<string, unknown>): User {
  return {
    userId: raw.userId,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
  }
}

export async function listUsers(): Promise<User[]> {
  const users = await apiRequest<User[]>("/users")
  return users.map(toSafeUser)
}

export async function getUser(userId: number): Promise<User> {
  return toSafeUser(await apiRequest<User>(`/users/${userId}`))
}

export async function createUser(payload: CreateUserRequest): Promise<User> {
  return toSafeUser(
    await apiRequest<User>("/users", { method: "POST", body: payload })
  )
}

export async function updateUser(
  userId: number,
  payload: UpdateUserRequest
): Promise<User> {
  return toSafeUser(
    await apiRequest<User>(`/users/${userId}`, { method: "PUT", body: payload })
  )
}

export async function deleteUser(userId: number): Promise<void> {
  await apiRequest<void>(`/users/${userId}`, { method: "DELETE" })
}
