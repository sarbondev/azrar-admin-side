import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [localAuthToken] = useState(localStorage.getItem("azrarauthtoken"));

  const login = async (phoneNumber, password) => {
    try {
      const response = await apiService.login(phoneNumber, password);
      const res = response.data;
      // Backend qaytaradi: { success, data: { token } }
      if (res.success && res.data?.token) {
        localStorage.setItem("azrarauthtoken", res.data.token);
        apiService.setAuthToken(res.data.token);
        window.location.reload();
        return { success: true, message: res.message };
      }
      return { success: false, message: res.message || "Login xatoligi" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login xatoligi",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("azrarauthtoken");
    apiService.setAuthToken(null);
    window.location.reload();
  };

  const changePassword = async (currentPassword, newPassword) => {
    return apiService.changePassword(currentPassword, newPassword);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localAuthToken) { setLoading(false); return; }
      try {
        apiService.setAuthToken(localAuthToken);
        const response = await apiService.getProfile();
        const res = response.data;
        // Backend qaytaradi: { success, data: { admin } }
        if (res.success && res.data?.admin) {
          setAdmin(res.data.admin);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [localAuthToken]);

  return (
    <AuthContext.Provider
      value={{ admin, login, logout, changePassword, loading, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
