import React, { createContext, useContext, useState, useEffect } from "react";
import { localStorageService } from "../services/localStorage";

export interface User {
  username: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for active session on load
  useEffect(() => {
    const savedUser = localStorageService.getItem<User | null>(
      "FlowDesk-current-user",
      null,
    );
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const cleanUsername = username.trim().toLowerCase();
    const users = localStorageService.getItem<
      { username: string; password: string }[]
    >("FlowDesk-users", []);

    const user = users.find((u) => u.username === cleanUsername);

    if (!user) {
      throw new Error(
        "User not found. Please check your username or register a new account.",
      );
    }

    if (user.password !== password) {
      throw new Error("Invalid password. Please try again.");
    }

    const sessionUser = { username: user.username };
    localStorageService.setItem("FlowDesk-current-user", sessionUser);
    setCurrentUser(sessionUser);
  };

  const registerUser = async (
    username: string,
    password: string,
  ): Promise<void> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const cleanUsername = username.trim().toLowerCase();
    const users = localStorageService.getItem<
      { username: string; password: string }[]
    >("FlowDesk-users", []);

    const exists = users.some((u) => u.username === cleanUsername);

    if (exists) {
      throw new Error(
        "Username is already taken. Please choose a different name.",
      );
    }

    const newUsersList = [...users, { username: cleanUsername, password }];
    localStorageService.setItem("FlowDesk-users", newUsersList);

    const sessionUser = { username: cleanUsername };
    localStorageService.setItem("FlowDesk-current-user", sessionUser);
    setCurrentUser(sessionUser);
  };

  const logout = () => {
    localStorageService.removeItem("FlowDesk-current-user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, login, registerUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
