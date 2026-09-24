/**
 * Teste simples do VoiceOrderParser.
 * Roda com: npx tsx src/services/voice-order/__tests__/parser.test.ts
 */

import { VoiceOrderParser } from "../parser";
import products from "../../../../data/products.json";

const parser = new VoiceOrderParser(products);

const tests = [
  "quero duas coca lata e uma fanta laranja",
  "me manda 3 monster",
  "5 sprite 2 litros",
  "uma cerveja sol lata",
  "meia dúzia de coca cola zero 600",
  "quero jack daniels com coca cola",
  "água crystal sem gás",
  "duas schweppes citrus lata e 10 coca lata",
  "manda pra mim uma del valle pêssego",
  "kuat guaraná 2 litros",
];

console.log("=".repeat(60));
console.log("🧪 Voice Order Parser — Testes");
console.log("=".repeat(60));

for (const input of tests) {
  const result = parser.parse(input);
  console.log(`\n🎤 "${input}"`);

  if (result.items.length > 0) {
    for (const item of result.items) {
      console.log(
        `  ✅ ${item.quantity}x ${item.product.name} (${item.product.sku}) — confiança: ${(item.confidence * 100).toFixed(0)}%`,
      );
    }
  }

  if (result.unmatched.length > 0) {
    console.log(`  ❌ Não reconhecido: ${result.unmatched.join(", ")}`);
  }
}

console.log("\n" + "=".repeat(60));
