// VITE_API_URL must be set in production (e.g. https://api.azrar.uz/api). The localhost fallback is for local development only.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
export const TOKEN_KEY = "azrarauthtoken";
export const LANG_KEY = "adminLang";
export const DEFAULT_AVATAR = "https://cdn-icons-png.freepik.com/512/3177/3177440.png";
