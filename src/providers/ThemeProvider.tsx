import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark";

type ThemeColors = {
  background: string;
  titleText: string;
  labelText: string;
  placeholderText: string;
  border: string;
  accent: string;
};

interface ThemeContextType {
  mode: Theme;
  colors: ThemeColors;
}

const colorSchemes: Record<Theme, ThemeColors> = {
  light: {
    background: "#fafafa",
    titleText: "#1d1d1d",
    labelText: "#6b6b6b",
    placeholderText: "#b0b0b0",
    border: "#d4d4d4",
    accent: "#ff4800",
  },
  dark: {
    background: "#1a1a1a",
    titleText: "#f0f0f0",
    labelText: "#a0a0a0",
    placeholderText: "#666666",
    border: "#3a3a3a",
    accent: "#ff4800",
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const scheme: Theme = useColorScheme() ?? "light";
  const colors = colorSchemes[scheme];

  return (
    <ThemeContext.Provider value={{ mode: scheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
