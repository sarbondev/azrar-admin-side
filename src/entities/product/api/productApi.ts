import api from "@/shared/api/axiosInstance";
import type { ProductEntity } from "../model/types";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const productApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ success: boolean; data: { products: ProductEntity[]; total: number } }>("/products", { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: { product: ProductEntity } }>(`/products/${id}`),
  create: (formData: FormData) => api.post("/products", formData, multipart),
  update: (id: string, formData: FormData) => api.put(`/products/${id}`, formData, multipart),
  delete: (id: string) => api.delete(`/products/${id}`),
};
