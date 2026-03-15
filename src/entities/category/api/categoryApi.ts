import api from "@/shared/api/axiosInstance";
import type { CategoryEntity } from "../model/types";

export interface ApiList<T> { success: boolean; data: { [key: string]: T[] | number; total: number }; }
export interface ApiItem<T> { success: boolean; data: Record<string, T>; }

export const categoryApi = {
  getAll: (params?: Record<string, string>) => api.get<{ success: boolean; data: { categories: CategoryEntity[]; total: number } }>("/categories", { params }),
  getById: (id: string) => api.get<{ success: boolean; data: { category: CategoryEntity } }>(`/categories/${id}`),
  create: (data: { name_uz: string; name_ru: string }) => api.post("/categories", data),
  update: (id: string, data: { name_uz: string; name_ru: string }) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};
