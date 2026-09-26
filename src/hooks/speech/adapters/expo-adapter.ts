/**
 * speech/adapters/expo-adapter.ts
 *
 * Adapter que usa expo-speech-recognition.
 * Funciona em iOS, Android e Web (a lib já suporta os 3).
 *
 * Para bare React Native (sem Expo), substitua por rn-voice-adapter.ts
 * que usa @react-native-voice/voice — a interface é a mesma.
 */

import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useCallback, useEffect, useRef, useState } from "react";

import type { UseSpeechRecognitionReturn } from "../types";

/**
 * Hook de speech recognition usando expo-speech-recognition.
 *
 * Uso:
 * ```ts
 * const { transcript, isListening, start, stop } = useExpoSpeechRecognition();
 * ```
 */
export function useExpoSpeechRecognition(): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  // Ref para acumular transcrições finais durante uma sessão contínua
  const accumulatedRef = useRef("");

  // Verifica disponibilidade
  useEffect(() => {
    try {
      const available =
        ExpoSpeechRecognitionModule.isRecognitionAvailable() ?? false;
      setIsAvailable(available);
    } catch {
      setIsAvailable(false);
    }
  }, []);

  // Registra event listeners via hooks do expo-speech-recognition
  useSpeechRecognitionEvent("start", () => {
    setIsListening(true);
    setError(null);
  });

  useSpeechRecognitionEvent("end", () => {
    setIsListening(false);
  });

  useSpeechRecognitionEvent("result", (event) => {
    const result = event.results[0];
    if (!result) return;

    const text = result.transcript ?? "";

    if (event.isFinal) {
      // Acumula a transcrição final
      const accumulated = accumulatedRef.current
        ? `${accumulatedRef.current} ${text}`
        : text;
      accumulatedRef.current = accumulated;
      setFinalTranscript(accumulated);
      setTranscript(accumulated);
    } else {
      // Mostra o resultado parcial junto com o que já foi acumulado
      const partial = accumulatedRef.current
        ? `${accumulatedRef.current} ${text}`
        : text;
      setTranscript(partial);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    setError(event.message ?? event.error ?? "Erro desconhecido");
    setIsListening(false);
  });

  const start = useCallback(
    async (lang: string = "pt-BR", contextualStrings: string[] = []) => {
      try {
        setError(null);
        accumulatedRef.current = "";
        setTranscript("");
        setFinalTranscript("");

        const result =
          await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
          setError("Permissão de microfone negada");
          return;
        }

        ExpoSpeechRecognitionModule.start({
          lang,
          interimResults: true,
          continuous: true,
          contextualStrings,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao iniciar reconhecimento",
        );
      }
    },
    [],
  );

  const stop = useCallback(async () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // Ignora erro se já parou
    }
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedRef.current = "";
    setTranscript("");
    setFinalTranscript("");
  }, []);

  return {
    transcript,
    finalTranscript,
    isListening,
    isAvailable,
    error,
    start,
    stop,
    resetTranscript,
  };
}
