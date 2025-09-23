"use client";

import { useLogoutMutation } from "@/state/api/authApi";
import { useAppDispatch } from "@/state/redux";
import { clearUser } from "@/state/slice/globalSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useSignOut() {
  const router = useRouter();
  const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.data?.message || "Logout failed");
    }
  };

  return { handleLogout, logoutLoading };
}
