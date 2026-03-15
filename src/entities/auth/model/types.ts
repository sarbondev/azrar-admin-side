export interface AdminEntity {
  _id: string;
  fullName: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  admin: AdminEntity | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResult {
  success: boolean;
  message: string;
}
