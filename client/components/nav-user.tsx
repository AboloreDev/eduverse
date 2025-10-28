"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconHome,
  IconLogout,
  IconNotification,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useEffect } from "react";
import { setUser } from "@/state/slice/globalSlice";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSignOut } from "@/hooks/use-signout";

export function NavUser() {
  const { isMobile } = useSidebar();
  const userDetails = useAppSelector((state) => state.global.user);
  const dispatch = useAppDispatch();
  const { handleLogout, logoutLoading } = useSignOut();

  // Rehydrate user from localStorage when navbar mounts
  useEffect(() => {
    if (!userDetails) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        dispatch(setUser(JSON.parse(savedUser)));
      }
    }
  }, [userDetails, dispatch]);

  const getInitials = (firstName?: string, lastName?: string): string => {
    return `${firstName?.charAt(0) ?? ""}${
      lastName?.charAt(0) ?? ""
    }`.toUpperCase();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${userDetails?.firstName}`}
                  alt="User Avatar"
                />
                <AvatarFallback className="rounded-lg">
                  {" "}
                  {getInitials(userDetails?.firstName, userDetails?.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userDetails?.firstName} {userDetails?.lastName}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {userDetails?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${userDetails?.firstName}`}
                    alt="User Avatar"
                  />
                  <AvatarFallback className="rounded-lg">
                    {getInitials(userDetails?.firstName, userDetails?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {" "}
                    {userDetails?.firstName} {userDetails?.lastName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userDetails?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={"/"}>
                  <IconHome />
                  Homepage
                </Link>
              </DropdownMenuItem>
              {userDetails?.role === "user" && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href={"/user/dashboard/billing"}>
                      <IconCreditCard />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={"/user/dashboard/profile"}>
                      <IconNotification />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={logoutLoading}
              >
                <IconLogout />
                {logoutLoading ? "Logging out..." : "Logout"}
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
