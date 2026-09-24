import { Stack } from "expo-router";
import { Platform, ScrollView, StyleSheet } from "react-native";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useTheme } from "@/hooks/use-theme";

export default function MenuScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Icon
              name="cog"
              size={22}
              color={theme.text}
              onPress={() => console.log("Settings pressed!")}
              style={Platform.OS === "web" ? { marginRight: 16 } : undefined}
            />
          ),
        }}
      />
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.contentContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text>Menu</Text>
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
  },
});
