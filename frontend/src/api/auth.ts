// src/api/auth.ts
import api, { storeTokens, clearTokens } from "./api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}

// (Optional) shape of the user object your backend returns
export interface UserData {
  id: number;
  username: string;
  role: string;
  // …any other fields you need
}

// ─── 1) LOGIN: POST /api/auth/token/login/ ───────────────────────────────────────
export async function loginUser(
  creds: LoginCredentials
): Promise<TokenPair> {
  // Note: if VITE_API_BASE_URL = "http://localhost:8000/api",
  // then this actually POSTs to "http://localhost:8000/api/auth/token/login/"
  const response = await api.post<{
    tokens: { access: string; refresh: string };
    user: any;
  }>("/auth/token/login/", {
    username: creds.username,
    password: creds.password,
  });

  const { access, refresh } = response.data.tokens;
  storeTokens(access, refresh);
  return { access, refresh };
}

// ─── 2) REGISTER: POST /api/register/ ────────────────────────────────────────────
export async function registerUser(
  creds: LoginCredentials
): Promise<TokenPair> {
  // If your DRF RegisterView returns { tokens: { access, refresh }, user: { … } }
  const response = await api.post<{
    tokens: { access: string; refresh: string };
    user: any;
  }>("/register/", {
    username: creds.username,
    password: creds.password,
  });

  const { access, refresh } = response.data.tokens;
  storeTokens(access, refresh);
  return { access, refresh };
}

// ─── 3) LOGOUT: just clear tokens on client ───────────────────────────────────────
export function logoutUser() {
  clearTokens();
}

// ─── 4) FETCH CURRENT USER: GET /api/users/me/ ───────────────────────────────────
export async function fetchCurrentUser(): Promise<UserData> {
  // Be sure you add a “/api/users/me/” URL on the Django side (see below).
  const response = await api.get<UserData>("/users/me/");
  return response.data;
}
// import api, { storeTokens, clearTokens, getStoredRefreshToken } from "./api";
// import { AxiosError } from "axios";

// export interface LoginCredentials {
//   username: string;
//   password: string;
// }

// export interface RegisterData {
//   username: string;
//   email: string;
//   password: string;
//   // add additional fields as needed
// }

// export interface TokenPair {
//   access: string;
//   refresh: string;
// }

// export interface UserData {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
// }

// // ─── 1) LOGIN: POST /auth/token/ ────────────────────────────────────────────────
// export async function loginUser(
//   creds: LoginCredentials
// ): Promise<{ tokens: TokenPair; user: UserData }> {
//   try {
//     const response = await api.post<{
//       access: string;
//       refresh: string;
//       user: UserData;
//     }>("/auth/token/login/", {
//       username: creds.username,
//       password: creds.password,
//     });

//     const { access, refresh, user } = response.data;
//     storeTokens(access, refresh);
//     return { tokens: { access, refresh }, user };
//   } catch (error: any) {
//     const message = (error as AxiosError).response?.data || "Login failed";
//     throw new Error(
//       typeof message === "string" ? message : JSON.stringify(message)
//     );
//   }
// }

// // ─── 2) REGISTER: POST /auth/register/ ─────────────────────────────────────────
// export async function registerUser(
//   data: RegisterData
// ): Promise<{ tokens: TokenPair; user: UserData }> {
//   try {
//     const response = await api.post<{
//       access: string;
//       refresh: string;
//       user: UserData;
//     }>("/auth/register/", data);

//     const { access, refresh, user } = response.data;
//     storeTokens(access, refresh);
//     return { tokens: { access, refresh }, user };
//   } catch (error: any) {
//     const message = (error as AxiosError).response?.data || "Registration failed";
//     throw new Error(
//       typeof message === "string" ? message : JSON.stringify(message)
//     );
//   }
// }

// // ─── 3) LOGOUT: clear all tokens ───────────────────────────────────────────────
// export function logoutUser() {
//   clearTokens();
// }

// // ─── 4) FETCH CURRENT USER: refresh access token then GET user ──────────────────
// export async function fetchCurrentUser(): Promise<UserData> {
//   // Step 1: use stored refresh token to get a new access token
//   const refresh = getStoredRefreshToken();
//   if (!refresh) {
//     throw new Error("No refresh token available");
//   }

//   const refreshResp = await api.post<{ access: string }>(
//     "/auth/token/refresh/",
//     { refresh }
//   );

//   const newAccess = refreshResp.data.access;
//   // Update stored tokens, keeping the same refresh
//   storeTokens(newAccess, refresh);

//   // Step 2: fetch authenticated user data
//   const userResp = await api.post<UserData>("/auth/token/refresh/");
//   return userResp.data;
// }
