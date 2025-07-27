// // src/api/api.ts
// import { useAuth } from "@clerk/clerk-react";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// /**
//  * useApi provides a fetchJson method that automatically
//  * attaches the Clerk-issued JWT to each request.
//  */
// export function useApi() {
//   const { getToken } = useAuth();

//   async function fetchJson<T = any>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     // 1) Grab Clerk JWT via hook
//     const token = await getToken();

//     // 2) Perform fetch with Authorization header
//     const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//         ...(options.headers || {}),
//       },
//     });

//     // 3) Handle errors
//     if (!res.ok) {
//       const payload = await res.json().catch(() => ({}));
//       if (res.status === 429) throw new Error("Daily quota exceeded");
//       throw new Error(payload.detail || `HTTP ${res.status}`);
//     }

//     // 4) Return JSON data
//     return (await res.json()) as T;
//   }

//   return { fetchJson };
// }



// src/api/api.ts
import { useAuth } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/**
 * useApi provides a fetchJson method that automatically
 * attaches the Clerk-issued JWT to each request, and
 * sets Content-Type based on body type.
 */
export function useApi() {
  const { getToken } = useAuth();

  async function fetchJson<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // 1) Grab Clerk JWT
    const token = await getToken();

    // 2) Build headers: always include Authorization, JSON only if not FormData
    const authHeader = { Authorization: `Bearer ${token}` };
    const userHeaders = (options.headers as Record<string, string>) || {};
    const headers: Record<string, string> = {
      ...authHeader,
      ...userHeaders,
    };
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // 3) Perform fetch
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 4) Error handling
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      if (res.status === 429) throw new Error("Daily quota exceeded");
      throw new Error(payload.detail || `HTTP ${res.status}`);
    }

    // 5) Parse and return JSON
    return (await res.json()) as T;
  }

  return { fetchJson };
}
