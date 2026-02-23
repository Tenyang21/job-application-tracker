const API_BASE = "http://localhost:5000"

export function getToken(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function isDemoMode(): boolean {
  return getToken() === "demo-token"
}

export function setToken(token: string) {
  document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export function removeToken() {
  document.cookie = "accessToken=; path=/; max-age=0"
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  if (!token) return { "Content-Type": "application/json" }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || "Login failed")
  }
  return res.json()
}

export async function apiRegister(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || "Registration failed")
  }
  return res.json()
}

export async function apiGetHome() {
  if (isDemoMode()) {
    const { mockHomeData } = await import("./mock-data")
    return structuredClone(mockHomeData)
  }
  const res = await fetch(`${API_BASE}/api/home`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch data")
  return res.json()
}

export async function apiAddApplication(data: Record<string, unknown>) {
  if (isDemoMode()) {
    return { success: true, id: crypto.randomUUID() }
  }
  const res = await fetch(`${API_BASE}/api/edit`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to add application")
  return res.json()
}

export async function apiUpdateApplication(id: string, data: Record<string, unknown>) {
  if (isDemoMode()) {
    return { success: true, id }
  }
  const res = await fetch(`${API_BASE}/api/update/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update application")
  return res.json()
}

export async function apiDeleteApplication(id: string) {
  if (isDemoMode()) {
    return { success: true, id }
  }
  const res = await fetch(`${API_BASE}/api/delete/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to delete application")
  return res.json()
}

export async function apiGetUpcomingEvents() {
  if (isDemoMode()) {
    const { mockUpcomingEvents } = await import("./mock-data")
    return structuredClone(mockUpcomingEvents)
  }
  const res = await fetch(`${API_BASE}/api/sort`, {
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error("Failed to fetch events")
  return res.json()
}
