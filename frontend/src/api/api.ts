// src/api/api.ts
import { getToken } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // 1) Grab the Clerk-issued JWT
  const token = await getToken();

  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    if (res.status === 429) throw new Error("Daily quota exceeded");
    throw new Error(payload.detail || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}
