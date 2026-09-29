import { Stack } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  DeviceEventEmitter,
} from "react-native";
import { useRouter } from "expo-router";

import { clearChatMessages } from "@/stores/chat-store";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useTheme } from "@/hooks/use-theme";

export default function MenuScreen() {
  const theme = useTheme();
  const router = useRouter();

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

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundElement },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => {
            clearChatMessages(); // reseta o store mesmo se o ChatScreen estiver desmontado
            DeviceEventEmitter.emit("clearChat"); // atualiza o state React se estiver montado
            router.push("/(chat)");
          }}
        >
          <Icon name="delete" size={24} color={theme.notification} />
          <Text style={[styles.menuItemText, { color: theme.notification }]}>
            Limpar Histórico do Chat
          </Text>
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
