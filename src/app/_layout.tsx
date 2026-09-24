import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from "expo-router";
import { Platform } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Icon } from "@/components/icon";
import { IosNativeTabs } from "@/layouts/ios-native-tabs";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const scheme =
    colorScheme === "unspecified" ? "light" : (colorScheme ?? "light");
  const colors = Colors[scheme];

  const [fontsLoaded] = useFonts({
    MaterialDesignIcons: require("@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  if (Platform.OS === "ios") {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <IosNativeTabs colors={colors} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 17,
          },
          headerShadowVisible: false,
          headerTitleAlign: "center",
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false, // Hide the global header here to use the Stack's header
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color as string}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(menu)"
          options={{
            headerShown: false,
            title: "Menu",
            tabBarIcon: ({ color, focused }) => (
              <Icon
                name={focused ? "menu" : "menu"}
                size={24}
                color={color as string}
              />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
