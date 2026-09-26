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
    let fixed = text
      // Prioridade máxima: "640.4 guaraná" → "640 mil kuat guaraná" (Google juntou "mil kuat" em ".4")
      .replace(
        /\b(\d+)\.4\s+(?:de\s+)?guaran[aá](?!\w)/gi,
        "$1 mil kuat guaraná",
      )
      .replace(/\b(\d+)\.4\b/gi, "$1 mil kuat")
      // "640.000 4 de guaraná" → "640.000 kuat guaraná" (Google escreveu o número e separou o kuat como "4")
      .replace(
        /\b(\d[\d.]*)\s+4\s+(?:de\s+)?guaran[aá](?!\w)/gi,
        "$1 kuat guaraná",
      )
      .replace(/\b4\/4\b/g, "quatro kuat")
      .replace(/\bquatro quartos\b/gi, "quatro kuat")
      // Correção para quando "quatro kuat" vira apenas "quatro" no final da frase
      .replace(/\bquatro\s*[.!?]*$/gi, "quatro kuat")
      // Se vier uma quantidade antes de "quatro" ou "quarto(s)", sabemos que o segundo é a marca
      .replace(
        /\b(um|uma|1|dois|duas|2|tr[eê]s|3|quatro|4|cinco|5|seis|6|sete|7|oito|8|nove|9|dez|10)\s+quatro\b/gi,
        "$1 kuat",
      )
      .replace(
        /\b(um|uma|1|dois|duas|2|tr[eê]s|3|quatro|4|cinco|5|seis|6|sete|7|oito|8|nove|9|dez|10)\s+quartos?\b/gi,
        "$1 kuat",
      );
    return fixed;
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
