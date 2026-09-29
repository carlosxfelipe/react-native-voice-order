import { Icon } from "@/components/icon";
import { useTheme } from "@/hooks/use-theme";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ChatLayout() {
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
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Chat",
          headerRight: () => (
            <Icon
              name="cart-outline"
              size={24}
              color={theme.text}
              style={Platform.OS === "web" ? { marginRight: 16 } : undefined}
            />
          ),
        }}
      />
    </Stack>
  );
}
