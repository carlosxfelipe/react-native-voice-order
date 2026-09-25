import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { Icon } from "@/components/icon";
import { Text } from "@/components/text";
import { useTheme } from "@/hooks/use-theme";
import { useVoiceOrder } from "@/hooks/use-voice-order";
import products from "../../../data/products.json";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Olá! Eu sou a SOL, sua assistente virtual. Como posso ajudar com seu pedido hoje?",
    sender: "bot",
    timestamp: new Date(),
  },
];

export default function ChatScreen() {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    isListening,
    transcript,
    orderResult,
    isAvailable,
    error,
    startListening,
    stopListening,
    reset,
    parseText,
  } = useVoiceOrder(products as any);

  React.useEffect(() => {
    if (isListening && transcript) {
      setInputText(transcript);
    }
  }, [isListening, transcript]);

  React.useEffect(() => {
    if (orderResult) {
      if (orderResult.items.length > 0) {
        const orderSummary = orderResult.items
          .map((item) => `${item.quantity}x ${item.product.name}`)
          .join("\n");
        const botResponse: Message = {
          id: Date.now().toString(),
          text: `Entendi! Encontrei no catálogo:\n${orderSummary}`,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } else if (orderResult.unmatched.length > 0) {
        const botResponse: Message = {
          id: Date.now().toString(),
          text: `Desculpe, não consegui encontrar os itens solicitados no catálogo.`,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      }
      reset();
    }
  }, [orderResult, reset]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    const textToParse = inputText.trim();
    setInputText("");

    // Use parseText if typed manually, or if transcript finished
    parseText(textToParse);
  };

  const Container =
    Platform.OS === "web" ? (View as any) : KeyboardAvoidingView;

  return (
    <Container
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble,
                {
                  backgroundColor: isUser ? theme.primary : theme.background,
                  alignSelf: isUser ? "flex-end" : "flex-start",
                },
              ]}
            >
              {!isUser && (
                <Text style={[styles.botName, { color: theme.textSecondary }]}>
                  SOL
                </Text>
              )}
              <Text
                style={{
                  color: isUser ? theme.onPrimary : theme.text,
                }}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  {
                    color: isUser ? theme.onPrimary : theme.textSecondary,
                    textAlign: isUser ? "right" : "left",
                  },
                ]}
              >
                {msg.timestamp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isListening
                ? theme.primary + "1A" // 10% opacity primary color
                : theme.inputBackground,
              color: theme.text,
              borderWidth: 1,
              borderColor: isListening ? theme.primary : "transparent",
            },
          ]}
          placeholder={
            error
              ? `Erro: ${error}`
              : isListening
                ? "Fale seu pedido..."
                : "Digite sua mensagem..."
          }
          placeholderTextColor={
            error
              ? theme.notification
              : isListening
                ? theme.primary
                : theme.placeholder
          }
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <View style={styles.sendButton}>
          <Icon
            name={isListening ? "microphone" : "microphone-outline"}
            color={isListening ? theme.primary : theme.textSecondary}
            size={28}
            onPress={isListening ? stopListening : startListening}
          />
        </View>
        <View style={styles.sendButton}>
          <Icon
            name="send"
            color={theme.primary}
            size={28}
            onPress={handleSend}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
  },
  botName: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
    opacity: 0.7,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 6,
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    paddingHorizontal: 16,
    paddingBottom:
      Platform.OS === "ios" ? 100 : Platform.OS === "web" ? 12 : 24,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
