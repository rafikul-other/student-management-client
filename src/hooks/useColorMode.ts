import { useState } from "react";

type ColorMode = "light" | "dark";

export const useColorMode = () => {
  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem("color-theme");
    return (stored as ColorMode) || "dark";
  });

  const toggleColorMode = () => {
    const newMode = colorMode === "dark" ? "light" : "dark";
    setColorMode(newMode);
    localStorage.setItem("color-theme", newMode);
    document.body.classList.toggle("dark", newMode === "dark");
  };

  return [colorMode, toggleColorMode] as const;
};