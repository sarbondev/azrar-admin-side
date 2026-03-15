import api from "@/shared/api/axiosInstance";
import type { OrderEntity, OrderStatus } from "../model/types";

export const orderApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<{ success: boolean; data: { orders: OrderEntity[]; total: number } }>("/orders", { params }),
  getById: (id: string) =>
    api.get<{ success: boolean; data: { order: OrderEntity } }>(`/orders/${id}`),
  updateStatus: (id: string, status: OrderStatus, internalNotes?: string) =>
    api.put(`/orders/${id}/status`, { status, internalNotes }),
  cancel: (id: string, reason?: string) =>
    api.put(`/orders/${id}/cancel`, { reason }),
};
