"use client";

import React from "react";

import { useAppDispatch, useAppSelector } from "@/state/redux";
import { toast } from "sonner";
import { useUpdateTenantMutation } from "@/state/api/authApi";
import { setUser } from "@/state/slice/globalSlice";
import Settings from "./Settings";

const UserProfilePage = () => {
  const dispatch = useAppDispatch();
  // get the user from the redux state using predefined AppSelector
  const user = useAppSelector((state) => state.global.user);
  // get the useTenantMutation from the API
  const [updateTenant, { isLoading }] = useUpdateTenantMutation();
  // set Initial Data
  const initialData = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
  };

  // handle the submit using the api
  const handleSubmit = async (data: typeof initialData) => {
    try {
      if (user?.id) {
        await updateTenant({
          id: user.id,
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
          },
        }).unwrap();
        dispatch(
          setUser({
            ...user,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
          })
        );
        toast.success("User Updated Successfully");
      }
    } catch (error: any) {
      toast.error("Failed to update Tenant", error);
    }
  };

  return (
    <div>
      <Settings
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserProfilePage;
