// @ts-nocheck

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
  getAllUsers,
} from "../appwrite/auth";

import { account } from "../appwrite/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState({
    users: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch all user records and total count
  const refreshAllUsers = useCallback(async (page = 1, limit = 10) => {
    const result = await getAllUsers(page, limit);
    setAllUsers(result);
    return result;
  }, []);

  // Check existing session when the app loads
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        setUser(null);
      }

      try {
        await refreshAllUsers(1, 10);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [refreshAllUsers]);

  // Login
  const login = async (credentials) => {
    setLoading(true);

    try {
      await loginUser(credentials);

      const userData = await getCurrentUser();
      setUser(userData);

      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (formData) => {
    const result = await registerUser(formData);
    setUser(result.user);

    await refreshAllUsers(1, 10);

    return result;
  };

  // Logout
  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  // Refresh logged-in user's profile
  const refreshUser = async () => {
    const userData = await getCurrentUser();
    setUser(userData);
    return userData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        allUsers,
        login,
        register,
        logout,
        refreshUser,
        refreshAllUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};