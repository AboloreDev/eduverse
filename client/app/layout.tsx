import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/code/ThemeProvider";
import { Toaster } from "sonner";
import Providers from "./providers";

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
        <Toaster closeButton position="top-right" />
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
