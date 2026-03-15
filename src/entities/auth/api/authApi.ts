import api from "@/shared/api/axiosInstance";
import type { AdminEntity } from "../model/types";

export interface LoginResponse { success: boolean; message: string; data: { token: string }; }
export interface ProfileResponse { success: boolean; data: { admin: AdminEntity }; }
export interface ChangePasswordResponse { success: boolean; message: string; }

export const authApi = {
  login: (phoneNumber: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { phoneNumber, password }),
  getProfile: () => api.get<ProfileResponse>("/auth/profile"),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post<ChangePasswordResponse>("/auth/change-password", { currentPassword, newPassword }),
};
