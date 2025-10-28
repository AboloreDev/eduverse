"use client";

import { motion } from "framer-motion";
import React from "react";
import Image from "next/image";

const partners = [
  "/microsoft.jpg",
  "/udemy.jpg",
  "/coursera.jpg",
  "/youtube.jpg",
  "/edx.jpg",
  "/claude.jpg",
  "/copilot.jpg",
  "/ai.jpg",
];

const Partners = () => {
  return (
    <div className="flex justify-center flex-wrap items-center gap-10 mb-16 opacity-70 w-full">
      {partners.map((logo, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
        >
          <Image
            src={logo}
            alt="Partner logo"
            width={100}
            height={40}
            className="object-contain  transition"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default Partners;
