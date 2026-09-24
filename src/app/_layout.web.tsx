import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Slot,
  ThemeProvider,
  useRouter,
  useSegments,
} from "expo-router";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { Colors } from "@/constants/theme";
import { BREAKPOINT } from "@/constants/layout";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function WebLayout() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const scheme =
    colorScheme === "unspecified" ? "light" : (colorScheme ?? "light");
  const colors = Colors[scheme];
  const router = useRouter();
  const segments = useSegments();

  const navItems = [
    {
      name: "Home",
      path: "/(home)",
      activeIcon: "home",
      inactiveIcon: "home-outline",
    },
    { name: "Menu", path: "/(menu)", activeIcon: "menu", inactiveIcon: "menu" },
  ] as const;

  const [fontsLoaded] = useFonts({
    MaterialDesignIcons: require("@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const isDesktop = width >= BREAKPOINT;

  // Scenario 1: Small screens (Mobile Web) -> Keep the Bottom Navigation Bar identical to the native app
  if (!isDesktop) {
    return (
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={styles.content}>
            <Slot />
          </View>
          {/* Bottom Navbar */}
          <View
            style={[
              styles.bottomNav,
              {
                backgroundColor: colors.background,
                borderTopColor: colors.backgroundElement,
              },
            ]}
          >
            {navItems.map((item) => {
              const isActive =
                item.path === "/(menu)"
                  ? (segments as string[]).includes("(menu)")
                  : !(segments as string[]).includes("(menu)");
              return (
                <Pressable
                  key={item.path}
                  onPress={() => router.push(item.path)}
                  style={({ pressed }) => [
                    styles.bottomNavItem,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Icon
                    name={isActive ? item.activeIcon : item.inactiveIcon}
                    size={24}
                    color={isActive ? colors.text : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.bottomNavLabel,
                      {
                        color: isActive ? colors.text : colors.textSecondary,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ThemeProvider>
    );
  }

  // Scenario 2: Large screens (Desktop/Tablet) -> Top Navbar

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Top Navbar */}
        <View
          style={[
            styles.navbar,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.backgroundElement,
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Expo Starter</Text>
          </View>
          <View style={styles.navLinks}>
            {navItems.map((item) => {
              const isActive =
                item.path === "/(menu)"
                  ? (segments as string[]).includes("(menu)")
                  : !(segments as string[]).includes("(menu)");
              return (
                <Pressable
                  key={item.path}
                  onPress={() => router.push(item.path)}
                  style={({ hovered }) => [
                    styles.navItem,
                    isActive && { borderBottomColor: colors.text },
                    !isActive &&
                      hovered && { borderBottomColor: colors.border },
                    hovered && {
                      backgroundColor: colors.backgroundElement + "40",
                    },
                  ]}
                >
                  {({ hovered }) => (
                    <>
                      <Icon
                        name={
                          isActive || hovered
                            ? item.activeIcon
                            : item.inactiveIcon
                        }
                        size={20}
                        color={
                          isActive || hovered
                            ? colors.text
                            : colors.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.navText,
                          {
                            color:
                              isActive || hovered
                                ? colors.text
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Main content area */}
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    height: 64,
    borderBottomWidth: 1,
  },
  logoContainer: {
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  navLinks: {
    flexDirection: "row",
    gap: 24,
    height: "100%",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
    height: "100%",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // React Native Web support for smooth transitions
    ...({
      transitionProperty: "all",
      transitionDuration: "150ms",
    } as any),
  },
  navText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    height: 64,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: 2,
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
});
