"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  BookIcon,
  ChevronDownIcon,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
} from "lucide-react";
import MobileMenu from "./MobileMenu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useSignOut } from "@/hooks/use-signout";
import { ThemeToggle } from "./ThemeToggle";
import { useGetUserProfileQuery } from "@/state/api/authApi";
import { useAppSelector } from "@/state/redux";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const { handleLogout, logoutLoading } = useSignOut();
  const userProfile = useAppSelector((state) => state.global.user);

  const { data: userData } = useGetUserProfileQuery(undefined, {
    skip: !!userProfile,
  });

  // @ts-ignore
  const user = userProfile || userData?.user;

  const getInitials = (firstName?: string, lastName?: string): string => {
    return `${firstName?.charAt(0) ?? ""}${
      lastName?.charAt(0) ?? ""
    }`.toUpperCase();
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenu ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenu]);

  const dashboardRoute = user?.role === "admin" ? "/admin" : "/user/dashboard";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md shadow-sm prata-regular">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src="/company-logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
          EduVerse
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 items-center text-sm uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link px-2 py-1 ${
                pathname === link.href ? "active" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth Section (Desktop) */}
        <div className="hidden md:flex items-center gap-4 uppercase">
          {user ? (
            <DropdownMenu>
              <ThemeToggle />
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:bg-transparent flex items-center gap-1"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <ChevronDownIcon size={16} className="opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-64 p-4">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "user" && (
                  <DropdownMenuItem asChild>
                    <Link href="/user/courses" className="flex gap-3">
                      <BookIcon size={16} />
                      <span>Courses</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={dashboardRoute} className="flex gap-3">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  <div className="flex gap-3">
                    <LogOut size={16} />
                    {logoutLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Logging out...
                      </span>
                    ) : (
                      "Logout"
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <ThemeToggle />
              <Button size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/signup">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <DropdownMenu>
              <ThemeToggle />
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto p-0 hover:bg-transparent flex items-center gap-1"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <ChevronDownIcon size={16} className="opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-w-64 p-4">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.role === "user" && (
                  <DropdownMenuItem asChild>
                    <Link href="/user/courses" className="flex gap-3">
                      <BookIcon size={16} />
                      <span>Courses</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href={dashboardRoute} className="flex gap-3">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  <div className="flex gap-3">
                    <LogOut size={16} />
                    {logoutLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Logging out...
                      </span>
                    ) : (
                      "Logout"
                    )}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <button onClick={() => setIsMobileMenu(true)}>
            <Menu className="h-6 w-6 cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenu}
        onClose={() => setIsMobileMenu(false)}
      />
    </header>
  );
};

export default Navbar;
