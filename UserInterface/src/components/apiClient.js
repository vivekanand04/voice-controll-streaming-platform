// src/apiClient.js
import axios from "axios";

// your base URL — from .env
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE.replace(/\/$/, ""), // clean trailing slash
  withCredentials: true,                // send cookies with every request
});

// Optional: attach JWT if you also store one in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
