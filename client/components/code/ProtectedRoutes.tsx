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
  const { data: userResponse, isLoading, isError } = useGetUserProfileQuery();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !userResponse) {
      toast.error("Session expired. Please login again.");
      router.push("/auth/login");
      return;
    }

    const userRole = userResponse?.role;

    // Block unauthorized access
    if (pathname.startsWith("/dashboard/user") && userRole !== "user") {
      toast.error("Access denied. User access only.");
      router.push("/auth/login");
      return;
    }

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      toast.error("Access denied. Admin access only.");
      router.push("/auth/login");
      return;
    }
  }, [userResponse, isLoading, isError, pathname, router]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 />
      </div>
    );
  }

  // Show error if auth failed
  if (isError || !userResponse) {
    return null;
  }

  return <div>{children}</div>;
};

export default ProtectedRoute;
