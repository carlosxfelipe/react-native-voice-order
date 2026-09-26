/**
 * hooks/use-voice-order.ts
 *
 * Hook que conecta speech recognition + voice order parser.
 * Cola as duas camadas: voz → texto → pedido estruturado.
 *
 * Uso:
 * ```ts
 * const { isListening, transcript, orderResult, startListening, stopListening } =
 *   useVoiceOrder(products);
 * ```
 */

import { useCallback, useMemo, useRef, useState } from "react";

import { useSpeechRecognition } from "./speech/use-speech-recognition";
import {
  VoiceOrderParser,
  DOMAIN_ALIASES,
  type ParseResult,
  type Product,
  type ParserOptions,
} from "@/services/voice-order";

export interface UseVoiceOrderReturn {
  /** Se está escutando ativamente. */
  isListening: boolean;
  /** Texto parcial em tempo real. */
  transcript: string;
  /** Texto final (após parar de falar). */
  finalTranscript: string;
  /** Resultado do parsing (itens encontrados). */
  orderResult: ParseResult | null;
  /** Se speech recognition está disponível. */
  isAvailable: boolean;
  /** Erro, se houver. */
  error: string | null;
  /** Inicia a escuta. */
  startListening: () => Promise<void>;
  /** Para a escuta e faz o parse. */
  stopListening: () => Promise<void>;
  /** Faz parse de um texto digitado (sem áudio). */
  parseText: (text: string) => ParseResult;
  /** Limpa tudo (transcript + resultado). */
  reset: () => void;
}

export function useVoiceOrder(
  products: Product[],
  parserOptions?: ParserOptions,
): UseVoiceOrderReturn {
  const speech = useSpeechRecognition();
  const [orderResult, setOrderResult] = useState<ParseResult | null>(null);

  // Cria o parser uma vez e re-cria se os produtos mudarem
  const parser = useMemo(
    () => new VoiceOrderParser(products, parserOptions),
    [products, parserOptions],
  );

  // Ref para saber se deve parsear ao finalizar
  const shouldParseRef = useRef(false);

  const parseText = useCallback(
    (text: string): ParseResult => {
      const result = parser.parse(text);
      setOrderResult(result);
      return result;
    },
    [parser],
  );

  const startListening = useCallback(async () => {
    setOrderResult(null);
    shouldParseRef.current = true;

    const allAliases = { ...DOMAIN_ALIASES, ...(parserOptions?.aliases ?? {}) };
    const contextualStrings: string[] = [
      ...products.map((p) => p.name),
      ...products.map((p) => p.brand),
      ...Object.keys(allAliases),
      ...(Object.values(allAliases).flat() as string[]),
    ];
    // Remove duplicatas e strings vazias
    const uniqueContextualStrings = [...new Set(contextualStrings)].filter(
      Boolean,
    ) as string[];

    await speech.start("pt-BR", uniqueContextualStrings);
  }, [speech, products, parserOptions]);

  const stopListening = useCallback(async () => {
    await speech.stop();
    // Não faz o parse automaticamente aqui.
    // O texto transcrito ficará no hook (e no inputText)
    // para o usuário poder revisar e enviar clicando no botão.
    shouldParseRef.current = false;
  }, [speech, parseText]);

  const reset = useCallback(() => {
    speech.resetTranscript();
    setOrderResult(null);
    shouldParseRef.current = false;
  }, [speech]);

  const fixTranscript = (text: string) => {
    return text
      .replace(/\b4\/4\b/g, "4 kuat")
      .replace(/\bquatro quartos\b/gi, "4 kuat");
  };

  return {
    isListening: speech.isListening,
    transcript: fixTranscript(speech.transcript),
    finalTranscript: fixTranscript(speech.finalTranscript),
    orderResult,
    isAvailable: speech.isAvailable,
    error: speech.error,
    startListening,
    stopListening,
    parseText,
    reset,
  };
}
