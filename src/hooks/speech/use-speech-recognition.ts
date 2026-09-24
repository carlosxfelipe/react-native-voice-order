/**
 * speech/use-speech-recognition.ts
 *
 * Hook principal de speech recognition.
 *
 * Ponto único de import para o app:
 * ```ts
 * import { useSpeechRecognition } from "@/hooks/speech/use-speech-recognition";
 * ```
 *
 * Para trocar o adapter (ex: migrar para bare RN), basta mudar
 * o import abaixo de expo-adapter para rn-voice-adapter.
 */

// ====================================================================
// 🔄 TROQUE O ADAPTER AQUI para mudar a engine de speech recognition
// ====================================================================
export { useExpoSpeechRecognition as useSpeechRecognition } from "./adapters/expo-adapter";

// Para bare React Native (futuro):
// export { useRNVoiceSpeechRecognition as useSpeechRecognition } from "./adapters/rn-voice-adapter";
