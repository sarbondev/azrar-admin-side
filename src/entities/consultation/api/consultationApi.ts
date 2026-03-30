import api from "@/shared/api/axiosInstance";
import type { ConsultationEntity, ConsultationStatus } from "../model/types";

export const consultationApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{
      success: boolean;
      data: { consultations: ConsultationEntity[]; total: number };
    }>("/consultations", { params }),

  getById: (id: string) =>
    api.get<{
      success: boolean;
      data: { consultation: ConsultationEntity };
    }>(`/consultations/${id}`),

  update: (id: string, status: ConsultationStatus, internalNotes?: string) =>
    api.put(`/consultations/${id}`, { status, internalNotes }),

  delete: (id: string) => api.delete(`/consultations/${id}`),
};
