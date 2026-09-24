/**
 * voice-order/quantity-parser.ts
 *
 * Extrai quantidades de texto em português.
 * "duas coca" → { quantity: 2, rest: "coca" }
 * "meia dúzia de fanta" → { quantity: 6, rest: "fanta" }
 */

/** Mapa de números por extenso em pt-BR. */
const NUMBER_WORDS: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14,
  catorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  cem: 100,
  cento: 100,
};

/** Expressões compostas de quantidade. */
const QUANTITY_EXPRESSIONS: Record<string, number> = {
  "meia duzia": 6,
  "uma duzia": 12,
  "duas duzias": 24,
  "um par": 2,
  "meio litro": 1, // trata como unidade
};

export interface QuantityMatch {
  /** Quantidade extraída. */
  quantity: number;
  /** Texto restante sem a parte da quantidade. */
  rest: string;
}

/**
 * Extrai a quantidade de um segmento de texto.
 * Retorna a quantidade encontrada e o texto restante (sem a parte numérica).
 */
export function extractQuantity(text: string): QuantityMatch {
  const trimmed = text.trim();

  // 1. Tenta expressões compostas primeiro ("meia dúzia de", "um par de")
  for (const [expr, qty] of Object.entries(QUANTITY_EXPRESSIONS)) {
    const regex = new RegExp(`^${expr}(?:\\s+de\\s+)?`, "i");
    const match = trimmed.match(regex);
    if (match) {
      return { quantity: qty, rest: trimmed.slice(match[0].length).trim() };
    }
  }

  // 2. Tenta número no início do texto ("2 coca", "10 fanta")
  const numericMatch = trimmed.match(/^(\d+)\s+(.*)/);
  if (numericMatch) {
    return {
      quantity: parseInt(numericMatch[1], 10),
      rest: numericMatch[2].trim(),
    };
  }

  // 3. Tenta número por extenso no início ("duas coca", "cinco monster")
  const words = trimmed.split(/\s+/);
  const firstWord = words[0]?.toLowerCase();

  if (firstWord && NUMBER_WORDS[firstWord] !== undefined) {
    return {
      quantity: NUMBER_WORDS[firstWord],
      rest: words.slice(1).join(" ").trim(),
    };
  }

  // 4. Tenta composições ("vinte e cinco")
  if (words.length >= 3 && words[1] === "e") {
    const tens = NUMBER_WORDS[words[0]?.toLowerCase()];
    const units = NUMBER_WORDS[words[2]?.toLowerCase()];
    if (tens !== undefined && units !== undefined && tens >= 20) {
      return {
        quantity: tens + units,
        rest: words.slice(3).join(" ").trim(),
      };
    }
  }

  // 5. Sem quantidade explícita → default 1
  return { quantity: 1, rest: trimmed };
}
