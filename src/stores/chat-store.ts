/**
 * stores/chat-store.ts
 *
 * Store simples em memória para as mensagens do chat.
 * Manter fora do componente garante que a conversa persista
 * ao navegar entre tabs, mesmo que a tela seja desmontada.
 */

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    text: "Olá! Eu sou a SOL, sua assistente virtual. Como posso ajudar com seu pedido hoje?",
    sender: "bot",
    timestamp: new Date(),
  },
];

/** Mensagens persistidas durante a sessão. */
export let chatMessages: ChatMessage[] = [...INITIAL_MESSAGES];

/** Atualiza as mensagens no store. */
export function setChatMessages(
  update: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[]),
): ChatMessage[] {
  const next = typeof update === "function" ? update(chatMessages) : update;
  chatMessages = next;
  return next;
}

/** Limpa o histórico, voltando à mensagem inicial. */
export function clearChatMessages(): ChatMessage[] {
  chatMessages = [...INITIAL_MESSAGES];
  return chatMessages;
}
