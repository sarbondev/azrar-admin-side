import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "@/entities/auth/api/authApi";
import type { AdminEntity, LoginResult } from "@/entities/auth/model/types";
import { TOKEN_KEY } from "@/shared/config/constants";

interface AuthContextValue {
  admin: AdminEntity | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminEntity | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (phoneNumber: string, password: string): Promise<LoginResult> => {
    try {
      const res = await authApi.login(phoneNumber, password);
      const { success, data, message } = res.data;
      if (success && data?.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        window.location.reload();
        return { success: true, message };
      }
      return { success: false, message: message ?? "Login xatoligi" };
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return { success: false, message: error.response?.data?.message ?? "Login xatoligi" };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.reload();
  };

  const changePassword = (currentPassword: string, newPassword: string) =>
    authApi.changePassword(currentPassword, newPassword);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    authApi.getProfile()
      .then((res) => {
        if (res.data.success && res.data.data?.admin) setAdmin(res.data.data.admin);
        else logout();
      })
      .catch(logout)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, isAuthenticated: !!admin, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
