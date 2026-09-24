import { useEffect, useState } from "react";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * It uses a media query listener to reactively update when the system theme changes on macOS/Windows.
 */
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial value on mount
    setColorScheme(mediaQuery.matches ? "dark" : "light");

    const listener = (event: MediaQueryListEvent) => {
      setColorScheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", listener);
    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  }, []);

  return colorScheme;
}
