/**
 * speech/adapters/rn-voice-adapter.ts
 *
 * PLACEHOLDER — Adapter para @react-native-voice/voice (bare React Native).
 *
 * Para usar:
 * 1. npm install @react-native-voice/voice
 * 2. Implemente seguindo a mesma interface do expo-adapter.ts
 * 3. Troque o import em use-speech-recognition.ts
 *
 * A API do @react-native-voice/voice é baseada em eventos:
 * - Voice.start('pt-BR')
 * - Voice.stop()
 * - Voice.onSpeechResults = (e) => e.value[0]
 * - Voice.onSpeechPartialResults = (e) => e.value[0]
 * - Voice.onSpeechError = (e) => e.error
 */

import type { UseSpeechRecognitionReturn } from "../types";

export function useRNVoiceSpeechRecognition(): UseSpeechRecognitionReturn {
  // TODO: Implementar com @react-native-voice/voice
  throw new Error(
    "RN Voice adapter não implementado. " +
      "Instale @react-native-voice/voice e implemente este adapter.",
  );
}
