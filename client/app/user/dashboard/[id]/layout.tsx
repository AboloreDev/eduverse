"use client";

import React, { ReactNode, useEffect, useState } from "react";
import CourseSidebar from "../components/CourseSidebar";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const CourseLayout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="flex h-screen flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b lg:hidden">
        <h1 className="text-lg font-semibold">My Course</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:block w-80 border-r shrink-0 px-4 overflow-y-auto">
        <CourseSidebar />
      </div>

      {/* Sidebar for Mobile (Slide-in) */}
      <AnimatePresence>
        {isOpen && (
          <div>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Slide-in */}
            <motion.div
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-zinc-900 border-r z-50 p-4"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ duration: 0.3 }}
            >
              <CourseSidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</div>
    </div>
  );
};

export default CourseLayout;
