/**
 * speech/types.ts
 *
 * Interface unificada de speech recognition.
 * Independente da implementação por baixo.
 */

export interface SpeechRecognitionState {
  /** Texto parcial (atualizado em tempo real enquanto fala). */
  transcript: string;
  /** Texto final consolidado (após parar de falar). */
  finalTranscript: string;
  /** Se está escutando ativamente. */
  isListening: boolean;
  /** Se speech recognition está disponível na plataforma. */
  isAvailable: boolean;
  /** Mensagem de erro, se houver. */
  error: string | null;
}

export interface SpeechRecognitionActions {
  /** Inicia o reconhecimento de voz. */
  start: (lang?: string, contextualStrings?: string[]) => Promise<void>;
  /** Para o reconhecimento e finaliza o resultado. */
  stop: () => Promise<void>;
  /** Limpa o transcript atual. */
  resetTranscript: () => void;
}

export type UseSpeechRecognitionReturn = SpeechRecognitionState &
  SpeechRecognitionActions;

/**
 * Interface do adapter — cada plataforma implementa essa interface.
 * Isso permite trocar a engine sem mudar o código do app.
 *
 * Adapters disponíveis:
 * - ExpoAdapter: usa expo-speech-recognition (Expo projects)
 * - WebAdapter: usa Web Speech API (browser fallback)
 * - (Futuro) RNVoiceAdapter: usa @react-native-voice/voice (bare RN)
 */
export interface SpeechAdapter {
  /** Verifica se o adapter está disponível na plataforma atual. */
  isAvailable(): boolean;
  /** Solicita permissões necessárias. Retorna true se concedidas. */
  requestPermissions(): Promise<boolean>;
  /** Inicia o reconhecimento. */
  start(options: SpeechStartOptions): void;
  /** Para o reconhecimento. */
  stop(): void;
  /** Registra callbacks de eventos. */
  onResult(callback: (transcript: string, isFinal: boolean) => void): void;
  /** Registra callback de erro. */
  onError(callback: (error: string) => void): void;
  /** Registra callback de início. */
  onStart(callback: () => void): void;
  /** Registra callback de fim. */
  onEnd(callback: () => void): void;
  /** Remove todos os listeners (cleanup). */
  removeAllListeners(): void;
}

export interface SpeechStartOptions {
  /** Idioma do reconhecimento. @default "pt-BR" */
  lang: string;
  /** Se deve retornar resultados intermediários. @default true */
  interimResults: boolean;
  /** Se deve continuar após silêncio. @default false */
  continuous: boolean;
}
