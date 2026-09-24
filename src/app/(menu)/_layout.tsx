import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";

export default function MenuLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 17,
        },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerBackButtonDisplayMode: "minimal", // Hide back button text on iOS
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Menu",
        }}
      />
    </Stack>
  );
}
