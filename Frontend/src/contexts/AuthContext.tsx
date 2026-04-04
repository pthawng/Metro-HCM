import { createContext, useContext, useEffect, useState } from "react";
import api from '../api/axiosInstance';
import { BASE_URL } from '@/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryParams = url.searchParams;

    const token = queryParams.get("token");
    const name = queryParams.get("name");
    const role = queryParams.get("role");
    const id = queryParams.get("id");

    if (token && name && role && id) {
      const userData = { name: decodeURIComponent(name), role, id };
      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser({
        token,
        user: userData,
        isAuthenticated: true,
      });

      window.history.replaceState({}, document.title, "Admin");
    } else {
      const storedToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setUser({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        });
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = async (phoneNumber, password) => {
    try {
      const authData = await api.post('/auth/login', { phoneNumber, password });

      if (authData?.accessToken) {
        const userData = { 
          name: authData.name, 
          role: authData.role, 
          id: authData.id 
        };
        
        localStorage.setItem("accessToken", authData.accessToken);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser({
          token: authData.accessToken,
          user: userData,
          isAuthenticated: true,
        });
        
        setGeneralError("");
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.message || "Số điện thoại hoặc mật khẩu không đúng";
      console.error("Lỗi đăng nhập:", errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const loginWithGoogle = () => {
    // Note: Since this is a redirect, it bypasses axiosInstance.
    // The redirect back will be caught by the useEffect above.
    window.location.href = `${BASE_URL}/auth/google`;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const updateUserInfo = (userData) => {
    setUser((prev) => ({
      ...prev,
      user: { ...prev?.user, ...userData }
    }));

    const currentStoredUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...currentStoredUser, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: user?.isAuthenticated || false, 
      login, 
      logout, 
      loginWithGoogle, 
      loading, 
      updateUserInfo, 
      generalError, 
      setGeneralError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
