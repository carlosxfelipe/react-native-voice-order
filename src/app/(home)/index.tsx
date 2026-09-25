import { Stack, useRouter } from "expo-router";
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";

import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Icon
              name="bell-outline"
              size={22}
              color={theme.text}
              onPress={() => console.log("Bell pressed!")}
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
        <View style={styles.header}>
          <Icon name="microphone-message" size={48} color={theme.primary} />
          <Text style={styles.title}>Pedido por Voz</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Como funciona a mágica por trás do chat?
          </Text>
        </View>

        <View
          style={[styles.card, { backgroundColor: theme.backgroundElement }]}
        >
          <View style={styles.cardHeader}>
            <Icon name="robot-dead-outline" size={24} color={theme.primary} />
            <Text style={styles.cardTitle}>Sem Inteligência Artificial</Text>
          </View>
          <Text style={[styles.cardText, { color: theme.text }]}>
            Isolamos a complexidade. Não utilizamos LLMs (como ChatGPT) para
            extrair os dados. Todo o processamento é feito localmente com
            algoritmos determinísticos e ultrarrápidos.
          </Text>
        </View>

        <View
          style={[styles.card, { backgroundColor: theme.backgroundElement }]}
        >
          <View style={styles.cardHeader}>
            <Icon name="cog-transfer-outline" size={24} color={theme.primary} />
            <Text style={styles.cardTitle}>O Fluxo de Parsing</Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.primary }]}>1</Text>
            <Text style={[styles.stepText, { color: theme.text }]}>
              Extraímos quantidades ("duas", "meia dúzia")
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.primary }]}>2</Text>
            <Text style={[styles.stepText, { color: theme.text }]}>
              Limpamos ruídos verbais ("eu quero", "me traz")
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.primary }]}>3</Text>
            <Text style={[styles.stepText, { color: theme.text }]}>
              Normalizamos plurais e tamanhos ("grande" → "2 Litros")
            </Text>
          </View>
          <View style={styles.step}>
            <Text style={[styles.stepNumber, { color: theme.primary }]}>4</Text>
            <Text style={[styles.stepText, { color: theme.text }]}>
              Comparamos os itens com o catálogo usando Fuzzy Match (Coeficiente
              de Dice) para lidar com erros e sinônimos.
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.8 },
          ]}
          onPress={() => router.push("/(chat)")}
        >
          <Text style={[styles.buttonText, { color: theme.onPrimary }]}>
            Ir para o Chat
          </Text>
          <Icon name="arrow-right" size={20} color={theme.onPrimary} />
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
    padding: 24,
    gap: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardText: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.9,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    gap: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
    width: 20,
    textAlign: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 100,
    gap: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
