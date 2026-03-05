import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [localAuthToken, setLocalAuthToken] = useState(
    localStorage.getItem("saipovauthtoken"),
  );

  const login = async (phoneNumber, password) => {
    try {
      const response = await apiService.login(phoneNumber, password);
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        localStorage.setItem("saipovauthtoken", responseData.data);
        apiService.setAuthToken(responseData.data);

        window.location.reload();
        return {
          success: true,
          message: responseData.message,
        };
      }

      return {
        success: false,
        message: responseData.message || "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setLocalAuthToken(null);
    localStorage.removeItem("saipovauthtoken");
    apiService.setAuthToken(null);
    window.location.reload();
  };

  const changePassword = async (currentPassword, newPassword) => {
    return apiService.changePassword(currentPassword, newPassword);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localAuthToken) {
        setLoading(false);
        return;
      }

      try {
        apiService.setAuthToken(localAuthToken);
        const response = await apiService.getProfile();
        const responseData = response.data;

        if (responseData.success && responseData.data) {
          setAdmin(responseData.data);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [localAuthToken]);

  const value = {
    admin,
    login,
    logout,
    changePassword,
    loading,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
