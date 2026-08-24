import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "@/services/api";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const loginTime = localStorage.getItem('loginTime');

      let cleanup: (() => void) | undefined;

      if (token && storedUser && loginTime) {
        const now = Date.now();
        const elapsed = now - parseInt(loginTime);
        const oneHour = 60 * 60 * 1000;

        if (elapsed >= oneHour) {
          signOut();
        } else {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAdmin(parsedUser.role === 'admin');

            const remainingTime = oneHour - elapsed;
            const timer = setTimeout(() => {
              signOut();
            }, remainingTime);

            cleanup = () => clearTimeout(timer);
          } catch (e) {
            console.error("Error parsing user from storage", e);
            signOut();
          }
        }
      }
      setLoading(false);
      return cleanup;
    };

    const timerCleanup = checkAuth();
    return () => {
      if (typeof timerCleanup === 'function') timerCleanup();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { token, user } = response.data;

      const loginTime = Date.now().toString();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('loginTime', loginTime);

      setUser(user);
      setIsAdmin(user.role === 'admin');

      // Auto logout after 1 hour
      setTimeout(() => {
        signOut();
      }, 60 * 60 * 1000);

      return { error: null };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { error: error.response?.data?.error || error.message || "Login failed" };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    return { error: { message: "Sign up is disabled in this version." } };
  };

  const signInWithGoogle = async () => {
    return { error: { message: "Google sign in is disabled in this version." } };
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
