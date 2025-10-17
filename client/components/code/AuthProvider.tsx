"use client";

import { useRefreshTokenMutation } from "@/state/api/authApi";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slice/globalSlice";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken().unwrap();
      } catch (error) {
        dispatch(clearUser());
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/");
      }
    };

    initializeAuth();
  }, [refreshToken, dispatch, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
