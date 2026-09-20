import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type {
  AuthContextType,
  AuthProviderProps,
  AuthUser,
} from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "researchmate-user";
const TOKEN_KEY = "researchmate-token";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        const parsedUser: AuthUser = JSON.parse(storedUser);

        setUser({
          ...parsedUser,
          token: storedToken,
        });
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  function login(authUser: AuthUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    localStorage.setItem(TOKEN_KEY, authUser.token);

    setUser(authUser);
  }

  function logout() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}