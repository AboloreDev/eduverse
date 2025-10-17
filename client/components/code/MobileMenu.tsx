"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/state/redux";
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
  const userProfile = useAppSelector((state) => state.global.user);
  const { data: userData } = useGetUserProfileQuery();

  // @ts-ignore
  const user = userProfile || userData?.user;

  // Get initials
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) ?? ""}${
      lastName?.charAt(0) ?? ""
    }`.toUpperCase();
  };

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
            className="fixed bottom-0 top-0 right-0 w-1/2 min-h-screen z-50 flex flex-col p-6 gap-4 md:hidden bg-black dark:bg-white text-white dark:text-black overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={onClose}>
                <X className="h-6 w-6 cursor-pointer" />
              </button>
            </div>
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

            {/* Auth Section */}
            <div className="flex justify-start mt-10 items-center gap-4 uppercase">
              {!user && (
                <>
                  <Button size="sm">
                    <Link href={"/login"}>Login</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="text-black">
                    <Link href={"/signup"}>Register</Link>
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
