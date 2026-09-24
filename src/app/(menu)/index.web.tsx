import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

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
