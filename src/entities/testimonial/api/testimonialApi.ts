import api from "@/shared/api/axiosInstance";
import type { TestimonialEntity } from "../model/types";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const testimonialApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ success: boolean; data: { testimonials: TestimonialEntity[]; total: number } }>("/testimonials", { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: { testimonial: TestimonialEntity } }>(`/testimonials/${id}`),
  create: (formData: FormData) => api.post("/testimonials", formData, multipart),
  update: (id: string, formData: FormData) => api.put(`/testimonials/${id}`, formData, multipart),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};
