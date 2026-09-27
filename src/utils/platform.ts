import { Platform } from "react-native";

export const isMobileWeb =
  Platform.OS === "web" &&
  typeof navigator !== "undefined" &&
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
