export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8088/api"
).replace(/\/+$/, "")

export type ApiErrorKind = "network" | "http" | "aborted" | "parse"

export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind
  readonly path: string

  constructor(
    message: string,
    options: { status?: number; kind: ApiErrorKind; path: string }
  ) {
    super(message)
    this.name = "ApiError"
    this.status = options.status ?? 0
    this.kind = options.kind
    this.path = options.path
  }

  get isNetworkError() {
    return this.kind === "network"
  }
  get isUnauthorized() {
    return this.status === 401
  }
  get isForbidden() {
    return this.status === 403
  }
  get isNotFound() {
    return this.status === 404
  }
  get isConflict() {
    return this.status === 409
  }
}

const STATUS_MESSAGES: Record<number, string> = {
  400: "The request could not be processed. Please check the submitted values.",
  401: "Your session has expired or you are not signed in.",
  403: "You do not have permission to perform this action.",
  404: "The requested record could not be found.",
  409: "This record conflicts with an existing one.",
  422: "Some of the submitted values are invalid.",
  500: "The server encountered an error. Please try again shortly.",
  502: "The server is temporarily unavailable.",
  503: "The server is temporarily unavailable.",
}

/**
 * Extracts a user-safe message from a Spring error body. Spring's default
 * error JSON contains `error`, `status`, `path` and sometimes `message`; stack
 * traces (`trace`) are deliberately ignored.
 */
function extractMessage(body: unknown): string | null {
  if (!body || typeof body !== "object") return null
  const record = body as Record<string, unknown>
  const message = record.message ?? record.detail
  if (typeof message === "string" && message.trim() && message.length < 300) {
    return message
  }
  if (Array.isArray(record.errors) && record.errors.length > 0) {
    const first = record.errors[0] as Record<string, unknown> | string
    if (typeof first === "string") return first
    if (first && typeof first.defaultMessage === "string") {
      return first.defaultMessage
    }
  }
  return null
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: unknown
  signal?: AbortSignal
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, signal }: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      signal,
      cache: "no-store",
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request was cancelled.", {
        kind: "aborted",
        path,
      })
    }
    throw new ApiError(
      "Unable to reach the INPROMA server. Check that the backend is running and try again.",
      { kind: "network", path }
    )
  }

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      if (response.ok) {
        throw new ApiError("The server returned an unexpected response.", {
          kind: "parse",
          status: response.status,
          path,
        })
      }
    }
  }

  if (!response.ok) {
    const fallback =
      STATUS_MESSAGES[response.status] ??
      (response.status >= 500
        ? STATUS_MESSAGES[500]
        : "The request could not be completed.")
    const backendMessage = response.status < 500 ? extractMessage(data) : null
    throw new ApiError(backendMessage ?? fallback, {
      kind: "http",
      status: response.status,
      path,
    })
  }

  return data as T
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof Error) return error.message
  return "An unexpected error occurred."
}
