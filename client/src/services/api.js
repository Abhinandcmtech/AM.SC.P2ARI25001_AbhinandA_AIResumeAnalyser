/**
 * API Service
 * Centralized Axios instance with JWT token injection
 */

import axios from "axios";

// Base URL - uses package.json proxy in development
const API = axios.create({
  baseURL: "/api",
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto logout on 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser    = (data) => API.post("/auth/login", data);
export const getMe        = ()     => API.get("/auth/me");

// ── Resume ────────────────────────────────────────────────────
export const uploadResume = (formData) =>
  API.post("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ── Results ───────────────────────────────────────────────────
export const getResults   = ()     => API.get("/results");
export const getResultById = (id)  => API.get(`/results/${id}`);

export default API;
