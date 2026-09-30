import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useTheme } from "@/hooks/use-theme";
import { useCartStore } from "@/stores/cart-store";
import { Stack } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

export default function ChatLayout() {
  const theme = useTheme();
  const totalItems = useCartStore((state) => state.totalItems);

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
            <View
              style={[
                styles.cartWrapper,
                Platform.OS === "web" && styles.cartWrapperWeb,
              ]}
            >
              <Icon name="cart-outline" size={24} color={theme.text} />
              {totalItems > 0 && (
                <View
                  style={[styles.badge, { backgroundColor: theme.primary }]}
                >
                  <Text style={styles.badgeText}>
                    {totalItems > 99 ? "99+" : String(totalItems)}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cartWrapper: {
    position: "relative",
  },
  cartWrapperWeb: {
    marginRight: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 11,
  },
});
