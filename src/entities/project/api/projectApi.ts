import api from "@/shared/api/axiosInstance";
import type { ProjectEntity } from "../model/types";

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

export const projectApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ success: boolean; data: { projects: ProjectEntity[]; total: number } }>("/projects", { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: { project: ProjectEntity } }>(`/projects/${id}`),
  create: (formData: FormData) => api.post("/projects", formData, multipart),
  update: (id: string, formData: FormData) => api.put(`/projects/${id}`, formData, multipart),
  delete: (id: string) => api.delete(`/projects/${id}`),
};
