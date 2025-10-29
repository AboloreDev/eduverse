"use client";

import { useGetUserProfileQuery } from "@/state/api/authApi";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: userResponse,
    isLoading,
    isError,
  } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (isLoading) return;

    // Handle authentication errors or token expiry
    if (!userResponse) {
      toast.error("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    // @ts-ignore
    const userRole = userResponse?.user?.role;

    // Block unauthorized access
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      toast.error("Access denied. admin access only.");
      router.push("/login");
      return;
    }

    if (pathname.startsWith("/user") && userRole !== "user") {
      toast.error("Access denied. user access only.");
      router.push("/login");
      return;
    }
  }, [userResponse, isLoading, isError, pathname, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Show error if auth failed
  if (!userResponse) {
    return null; // Will redirect to login
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
