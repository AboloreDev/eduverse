"use client";

import { useGetUserProfileQuery } from "@/state/api/authApi";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slice/globalSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: userResponse, isLoading, isError } = useGetUserProfileQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (isError || !userResponse) {
      toast.error("Session expired. Please login again.");
      dispatch(clearUser());
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    // @ts-ignore
    const userRole = userResponse?.user.role;

    // Block unauthorized access
    if (pathname.startsWith("/user") && userRole !== "user") {
      toast.error("Access denied. User access only.");
      dispatch(clearUser());
      localStorage.removeItem("user");
      router.push("/login");

      return;
    }

    if (pathname.startsWith("/admin") && userRole !== "admin") {
      toast.error("Access denied. Admin access only.");
      dispatch(clearUser());
      localStorage.removeItem("user");
      router.push("/login");
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
