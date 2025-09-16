import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/code/ThemeProvider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
