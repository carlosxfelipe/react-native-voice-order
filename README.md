# 🎙️ Voice Order — Pedido por Voz

POC de um app mobile para **pedidos de produtos por voz**. O usuário fala o que quer no chat e o sistema identifica os produtos no catálogo automaticamente.

## Como rodar

```bash
git clone <repo-url> && cd react-native-voice-order
npm install
```

| Plataforma | Comando |
|---|---|
| Web | `npm run web` |
| iOS (Expo Go) | `npm run ios` |
| Android (Expo Go) | `npm run android` |
| iOS (dev build — necessário para speech) | `npm run ios:native` |

> **Nota:** O reconhecimento de voz (`expo-speech-recognition`) requer **development build**. No Expo Go só funciona o chat por texto.

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
