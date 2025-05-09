import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  requires2FA: boolean;
  twoFactorUsername: string | null;
  login: (username: string, password: string, register?: boolean) => Promise<{ requires2FA?: boolean }>;
  verifyTwoFactor: (token: string) => Promise<void>;
  verifyBackupCode: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  syncData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorUsername, setTwoFactorUsername] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, register = false) => {
    try {
      setIsLoading(true);
      const endpoint = register ? "/api/auth/register" : "/api/auth/login";
      
      const res = await apiRequest("POST", endpoint, { username, password });
      const userData = await res.json();
      
      // Check if 2FA is required
      if (userData.requires2FA) {
        setRequires2FA(true);
        setTwoFactorUsername(userData.username);
        setIsLoading(false);
        return { requires2FA: true };
      }
      
      setUser(userData);
      
      toast({
        title: register ? "Account created successfully" : "Logged in successfully",
        description: "Welcome to VolkPass",
      });

      return {};
    } catch (error) {
      console.error("Login failed:", error);
      
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (token: string) => {
    try {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/2fa/verify", { token });
      const userData = await res.json();
      
      setUser(userData);
      setRequires2FA(false);
      setTwoFactorUsername(null);
      
      toast({
        title: "Authentication successful",
        description: "Welcome to VolkPass",
      });
    } catch (error) {
      console.error("2FA verification failed:", error);
      
      toast({
        title: "Verification failed",
        description: "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyBackupCode = async (backupCode: string) => {
    try {
      setIsLoading(true);
      const res = await apiRequest("POST", "/api/2fa/verify", { backupCode });
      const userData = await res.json();
      
      setUser(userData);
      setRequires2FA(false);
      setTwoFactorUsername(null);
      
      toast({
        title: "Authentication successful",
        description: "Welcome to VolkPass",
      });
    } catch (error) {
      console.error("Backup code verification failed:", error);
      
      toast({
        title: "Verification failed",
        description: "Invalid backup code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      setUser(null);
      setRequires2FA(false);
      setTwoFactorUsername(null);
      
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      
      toast({
        title: "Logout failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const syncData = async () => {
    try {
      await apiRequest("POST", "/api/sync", {});
      
      toast({
        title: "Synchronization complete",
        description: "Your password vault is up to date",
      });
    } catch (error) {
      console.error("Sync failed:", error);
      
      toast({
        title: "Synchronization failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    requires2FA,
    twoFactorUsername,
    login,
    verifyTwoFactor,
    verifyBackupCode,
    logout,
    syncData
  };

  return (
    <AuthContext.Provider value={contextValue}>
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