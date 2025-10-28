"use client";

import { authApi, useLogoutMutation } from "@/state/api/authApi";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slice/globalSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully!");
      dispatch(clearUser());
      dispatch(authApi.util.resetApiState());
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.data?.message || "Logout failed");
    }
  };

  return { handleLogout, logoutLoading };
}
