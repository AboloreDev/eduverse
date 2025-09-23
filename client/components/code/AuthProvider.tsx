"use client";

import { useLazyRefreshTokenQuery } from "@/state/api/authApi";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshToken, { isLoading }] = useLazyRefreshTokenQuery();

  useEffect(() => {
    // Try to refresh token on app startup
    const initializeAuth = async () => {
      try {
        await refreshToken().unwrap();
      } catch (error) {}
    };

    initializeAuth();
  }, [refreshToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default AuthProvider;
