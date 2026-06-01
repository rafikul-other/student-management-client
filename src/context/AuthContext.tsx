import React, { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authStorageKeys = ["user", "token", "type", "name", "studentId", "about"];

const clearAuthStorage = () => {
  authStorageKeys.forEach((key) => localStorage.removeItem(key));
};

const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!storedUser || !token) {
    clearAuthStorage();
    return null;
  }

  try {
    return { ...JSON.parse(storedUser), token };
  } catch {
    clearAuthStorage();
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = (userData: User) => {
    if (!userData.token) {
      throw new Error("Login response did not include an access token");
    }

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("type", userData.role);
    localStorage.setItem("name", userData.name || "");
    if (userData._id) localStorage.setItem("studentId", userData._id);
    if (userData.aboutMe !== undefined) localStorage.setItem("about", userData.aboutMe);
  };

  const logout = () => {
    setUser(null);
    clearAuthStorage();
    window.location.href = "/";
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
