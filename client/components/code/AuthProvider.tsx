"use client";

import { useLazyRefreshTokenQuery } from "@/state/api/authApi";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slice/globalSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshToken, { isLoading }] = useLazyRefreshTokenQuery();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken().unwrap();
      } catch (error) {
        toast.error("Token refresh failed");
        dispatch(clearUser());
        localStorage.removeItem("user");
        router.push("/");
      }
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
