import { BREAKPOINT } from "@/constants/layout";
import { useWindowDimensions } from "react-native";

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < BREAKPOINT,
    isDesktop: width >= BREAKPOINT,
  };
}
