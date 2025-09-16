"use client";

import React, { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
