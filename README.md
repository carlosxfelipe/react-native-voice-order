# 🎙️ Voice Order — Pedido por Voz

POC de um app mobile para **pedidos de produtos por voz**. O usuário fala o que quer no chat e o sistema identifica os produtos no catálogo automaticamente.

## Como rodar

```bash
git clone https://github.com/carlosxfelipe/react-native-voice-order.git && cd react-native-voice-order
npm install
```

| Plataforma | Comando |
|---|---|
| Web | `npm run web` |
| iOS (Expo Go) | `npm run ios` |
| Android (Expo Go) | `npm run android` |
| iOS (dev build — necessário para speech) | `npm run ios:native` |
| Android (dev build — necessário para speech) | `npm run android:native` |

> **Nota:** O reconhecimento de voz (`expo-speech-recognition`) requer **development build** em dispositivos nativos. No Expo Go só funciona o chat por texto. Para testar voz no iOS/Android, utilize `npm run ios:native` ou `npm run android:native`.
>
> **Web mobile (Android/iOS via browser):** o reconhecimento de voz funciona diretamente pelo browser, sem precisar de dev build. A interação é por toque: toque para iniciar, fale, toque novamente para enviar.

## Estrutura

```
├── src/
│   ├── app/                         # Telas (Expo Router)
│   │   ├── (home)/                  # Tela inicial
│   │   ├── (chat)/                  # Chat com a SOL (assistente)
│   │   └── (menu)/                  # Menu/configurações
│   ├── hooks/
│   │   ├── speech/                  # Adapter de speech-to-text
│   │   │   ├── adapters/expo-adapter.ts   # expo-speech-recognition
│   │   │   └── adapters/rn-voice-adapter.ts # placeholder bare RN
│   │   └── use-voice-order.ts       # Cola speech + parser
│   ├── stores/
│   │   └── chat-store.ts            # Estado global do chat (persiste entre abas)
│   ├── utils/
│   │   └── platform.ts              # Helpers de plataforma (ex: isMobileWeb)
│   └── services/
│       └── voice-order/             # Parser de pedido por voz (puro TS, zero deps)
│           ├── parser.ts            # "duas coca lata" → { product, qty: 2 }
│           ├── matcher.ts           # Fuzzy matching (Dice coefficient)
│           ├── normalizer.ts        # Remove acentos, expande abreviações
│           └── quantity-parser.ts   # "meia dúzia" → 6
└── data/
    └── products.json            # Catálogo de produtos
```

## Trocar para bare React Native

Para migrar o speech recognition de Expo para bare RN, mude **uma linha** em `src/hooks/speech/use-speech-recognition.ts`:

```diff
- export { useExpoSpeechRecognition as useSpeechRecognition } from "./adapters/expo-adapter";
+ export { useRNVoiceSpeechRecognition as useSpeechRecognition } from "./adapters/rn-voice-adapter";
```

O parser de pedido (`services/voice-order/`) não tem dependência de framework — copie direto.
