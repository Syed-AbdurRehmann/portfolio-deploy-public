import { useEffect, useState } from "react";
import { getAdminSession, getAdminStatus, isApiConfigured, setupAdmin, signInAdmin, signOutAdmin, type AdminUser } from "@/lib/video-service";

interface LoginPayload {
  email: string;
  password: string;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const status = await getAdminStatus();
      const currentSession = await getAdminSession();

      if (mounted) {
        setHasAdmin(status.hasAdmin);
        setUser(currentSession);
        setLoading(false);
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const setup = async ({ email, password, setupKey }: LoginPayload & { setupKey?: string }) => {
    setAuthError(null);
    try {
      await setupAdmin(email, password, setupKey);
      setHasAdmin(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to configure admin.";
      setAuthError(message);
      throw error;
    }
  };

  const login = async ({ email, password }: LoginPayload) => {
    setAuthError(null);
    try {
      const loggedInUser = await signInAdmin(email, password);
      setUser(loggedInUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      setAuthError(message);
      throw error;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOutAdmin();
      setUser(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign out.";
      setAuthError(message);
      throw error;
    }
  };

  return {
    isConfigured: isApiConfigured,
    hasAdmin,
    loading,
    authError,
    user,
    setup,
    login,
    logout,
  };
};
