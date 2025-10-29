// File: src/components/shared/MobileMenu.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useGetUserProfileQuery } from "@/state/api/authApi";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();

  // ✅ Same query structure as Navbar
  const { data: userData } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  // ✅ Extract user consistently
  // @ts-ignore
  const user = userData?.user;

  // Debug log
  useEffect(() => {
    console.log("Mobile Menu - userData:", userData);
    console.log("Mobile Menu - user:", user);
  }, [userData, user]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 min-h-screen"
            onClick={onClose}
          />

          {/* Sidebar Menu */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 top-0 right-0 w-3/4 sm:w-1/2 min-h-screen z-50 flex flex-col p-6 gap-4 md:hidden bg-black dark:bg-white text-white dark:text-black overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={onClose}>
                <X className="h-6 w-6 cursor-pointer" />
              </button>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`nav-link px-2 py-1 ${
                  pathname === link.href ? "active" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* ✅ Auth Section - Fixed conditional rendering */}
            <div className="flex flex-col justify-start mt-10 gap-4">
              {user ? (
                // User is logged in
                <div className="space-y-3">
                  <div className="text-sm space-y-1">
                    <p className="text-xs opacity-70">Logged in as:</p>
                    <p className="font-bold text-base">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs opacity-70">{user.email}</p>
                  </div>
                  <div className="pt-2 border-t border-white/20 dark:border-black/20">
                    <Link
                      href={
                        user.role === "admin" ? "/admin" : "/user/dashboard"
                      }
                      onClick={onClose}
                      className="text-sm hover:underline"
                    >
                      Go to Dashboard →
                    </Link>
                  </div>
                </div>
              ) : (
                // User NOT logged in
                <div className="flex flex-col gap-3">
                  <Button size="sm" onClick={onClose} asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
                    onClick={onClose}
                    asChild
                  >
                    <Link href="/signup">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
