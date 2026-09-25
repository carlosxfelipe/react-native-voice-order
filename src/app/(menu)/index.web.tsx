import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Pressable, Linking } from "react-native";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useResponsive } from "@/hooks/use-responsive";
import { useTheme } from "@/hooks/use-theme";

export default function MenuScreen() {
  const theme = useTheme();
  const { isDesktop } = useResponsive();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: !isDesktop,
          headerRight: () => (
            <Icon
              name="cog"
              size={22}
              color={theme.text}
              onPress={() => console.log("Settings pressed!")}
              style={{ marginRight: 16 }}
            />
          ),
        }}
      />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={styles.title}>Menu</Text>

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundElement },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() =>
            Linking.openURL(
              "https://github.com/carlosxfelipe/react-native-voice-order",
            )
          }
        >
          <Icon name="github" size={24} color={theme.text} />
          <Text style={[styles.menuItemText, { color: theme.text }]}>
            Ver no GitHub
          </Text>
          <Icon name="open-in-new" size={20} color={theme.textSecondary} />
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
});
