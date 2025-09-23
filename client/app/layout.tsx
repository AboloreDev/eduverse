import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/code/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "./providers";
import AuthProvider from "@/components/code/AuthProvider";

export const metadata: Metadata = {
  title: "EduVerse",
  description: "Your educational universe awaits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`poppins-regular`}>
        <Toaster />
        <Providers>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
