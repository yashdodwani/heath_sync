import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function CustomThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
