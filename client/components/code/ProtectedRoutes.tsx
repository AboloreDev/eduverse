"use client";

import { useGetUserProfileQuery } from "@/state/api/authApi";
import React, { useEffect, useState } from "react";
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
  const dispatch = useAppDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
  } = useGetUserProfileQuery();

  useEffect(() => {
    const checkAuth = () => {
      if (isLoading) {
        return;
      }

      // CASE 3: API call failed or returned error
      if (isError && !userResponse) {
        const errorMessage = "Session expired. Please login again.";
        toast.error(errorMessage);
        dispatch(clearUser());
        setIsCheckingAuth(false);
        router.push("/login");
        return;
      }

      // CASE 5: Role-based access control
      // @ts-ignore
      const userRole = userResponse.user.role;

      // Check if user is trying to access wrong role's routes
      if (pathname.startsWith("/user/courses") && userRole !== "user") {
        // Other /user routes are restricted to user role only
        toast.error("Access denied");
        setIsCheckingAuth(false);
        router.push("/login");
        return;
      }

      if (pathname.startsWith("/admin") && userRole !== "admin") {
        toast.error("Access denied. Admin access only.");
        setIsCheckingAuth(false);
        router.push("/login");
        return;
      }

      // All checks passed
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [userResponse, isLoading, isError, error, pathname, router, dispatch]);

  // Show loading spinner while checking authentication
  if (isCheckingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  // Don't render if auth check failed
  if (isError || !userResponse) {
    return null;
  }

  // All checks passed - render protected content
  return <>{children}</>;
};

export default ProtectedRoute;
