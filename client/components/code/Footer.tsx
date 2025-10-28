"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Container from "./Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" mt-20">
      <Container>
        <div className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Eduverse</h2>
            <p className="text-lg text-gray-500 max-w-xs">
              Empowering learners and educators through interactive and
              accessible education tools.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-md text-slate-500">
              <li>
                <Link href="/" className="hover:text-emerald-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600">
                  About
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-3">Stay Updated</h4>
            <p className="text-md text-gray-500 mb-3">
              Subscribe to our newsletter for the latest updates and resources.
            </p>
            <form className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="border-slate-500 focus:border-none"
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>

      {/* Divider */}
      <div className=" mt-10 mb-5 pt-6 text-center text-sm text-gray-500">
        © {currentYear} Eduverse. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
