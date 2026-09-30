/**
 * voice-order/parser.ts
 *
 * Parser principal: recebe texto livre e catálogo → retorna pedido estruturado.
 *
 * Fluxo:
 *  1. Separa o texto em segmentos (por "e", "mais", vírgula)
 *  2. Para cada segmento, extrai a quantidade
 *  3. Faz fuzzy match do restante contra o catálogo
 *  4. Retorna os itens encontrados e os trechos não reconhecidos
 */

import { buildIndex, findBestMatch, type ProductIndex } from "./matcher";
import { normalize } from "./normalizer";
import { extractQuantity } from "./quantity-parser";
import type { OrderItem, ParseResult, ParserOptions, Product } from "./types";

/** Palavras que servem como separadores entre itens do pedido. */
const SEPARATORS = /\b(?:e|mais|tambem|também|com)\b|[,;]/gi;

/** Palavras "ruído" que devem ser ignoradas antes do matching. */
const NOISE_WORDS = [
  "eu",
  "me",
  "mim",
  "a",
  "o",
  "as",
  "os",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "uns",
  "umas",
  "pra",
  "para",
  "la",
  "aqui",
  "quero",
  "queria",
  "queremos",
  "preciso",
  "manda",
  "mande",
  "vem",
  "venha",
  "traz",
  "traga",
  "bota",
  "bote",
  "coloca",
  "coloque",
  "poe",
  "ponha",
  "adiciona",
  "adicione",
  "separa",
  "separe",
  "mete",
  "meta",
  "ve",
  "veja",
  "gostaria",
  "agora",
  "ja",
  "por favor",
  "pfv",
  "pf",
  "favor",
  "pedido",
  "pode",
  "ser",
  "oi",
  "ola",
  "ei",
  "ae",
  "bom dia",
  "boa tarde",
  "boa noite",
  "boas",
  "salve",
  "eae",
  "fala",
];

/** Remove palavras-ruído do início e fim de um segmento. */
function removeNoise(text: string): string {
  let result = normalize(text);

  // Remove noise words do início
  let changed = true;
  while (changed) {
    changed = false;
    for (const noise of NOISE_WORDS) {
      const regex = new RegExp(`^${noise}\\b\\s*`, "i");
      if (regex.test(result)) {
        result = result.replace(regex, "").trim();
        changed = true;
      }
    }
  }

  // Remove noise words do fim
  changed = true;
  while (changed) {
    changed = false;
    for (const noise of NOISE_WORDS) {
      const regex = new RegExp(`\\s*\\b${noise}$`, "i");
      if (regex.test(result)) {
        result = result.replace(regex, "").trim();
        changed = true;
      }
    }
  }

  return result.trim();
}

/**
 * Classe principal do parser de pedido por voz.
 *
 * Uso:
 * ```ts
 * const parser = new VoiceOrderParser(products);
 * const result = parser.parse("quero duas coca lata e uma fanta");
 * ```
 */
export const DOMAIN_ALIASES: Record<string, string[]> = {
  kuat: ["quatro", "quati", "4", "quarto", "quartos"],
};

export class VoiceOrderParser {
  private index: ProductIndex;
  private options: Required<ParserOptions>;

  constructor(products: Product[], options?: ParserOptions) {
    this.index = buildIndex(products);
    this.options = {
      minConfidence: options?.minConfidence ?? 0.4,
      aliases: { ...DOMAIN_ALIASES, ...(options?.aliases ?? {}) },
    };
  }

  /** Atualiza o catálogo de produtos (re-indexa). */
  updateProducts(products: Product[]): void {
    this.index = buildIndex(products);
  }

  /**
   * Faz o parse de um texto de voz em itens de pedido.
   *
   * @param text - Texto transcrito da voz do usuário.
   * @returns ParseResult com itens encontrados e trechos não reconhecidos.
   */
  parse(text: string): ParseResult {
    const items: OrderItem[] = [];
    const unmatched: string[] = [];

    // 1. Separa em segmentos pelos separadores principais
    const rawSegments = text
      .split(SEPARATORS)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // 1b. Sub-divide segmentos que contêm números embutidos
    //     Ex: "duas cocas grandes três fantas" → ["duas cocas grandes", "três fantas"]
    const NUMBER_BOUNDARY =
      /(?<!\d)\b(um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|catorze|quinze|dezesseis|dezessete|dezoito|dezenove|vinte|\d+)\b/gi;

    const segments: string[] = [];
    for (const raw of rawSegments) {
      const matches = [...raw.matchAll(NUMBER_BOUNDARY)];
      // Só sub-divide se houver mais de um número no segmento
      if (matches.length <= 1) {
        segments.push(raw);
        continue;
      }
      let lastIndex = 0;
      for (let i = 1; i < matches.length; i++) {
        const boundary = matches[i].index!;
        const part = raw.slice(lastIndex, boundary).trim();
        if (part) segments.push(part);
        lastIndex = boundary;
      }
      const tail = raw.slice(lastIndex).trim();
      if (tail) segments.push(tail);
    }

    for (const segment of segments) {
      // 2. Remove ruído
      const cleaned = removeNoise(segment);
      if (!cleaned) continue;

      // 3. Extrai quantidade
      const { quantity, rest } = extractQuantity(cleaned);
      if (!rest) continue;

      // 4. Tenta resolver aliases customizados primeiro
      let searchText = rest;
      for (const [key, aliasList] of Object.entries(this.options.aliases)) {
        for (const alias of aliasList) {
          if (normalize(rest).includes(normalize(alias))) {
            searchText = key;
            break;
          }
        }
      }

      // 5. Fuzzy match contra o catálogo
      const match = findBestMatch(searchText, this.index);

      if (match && match.confidence >= this.options.minConfidence) {
        // Verifica se o produto já está na lista (agrupa quantidades)
        const existing = items.find(
          (item) => item.product.id === match.product.id,
        );
        if (existing) {
          existing.quantity += quantity;
          existing.matchedText += `, ${segment}`;
          // Mantém a maior confiança
          existing.confidence = Math.max(existing.confidence, match.confidence);
        } else {
          items.push({
            product: match.product,
            quantity,
            confidence: match.confidence,
            matchedText: segment,
          });
        }
      } else {
        unmatched.push(segment);
      }
    }

    return {
      items,
      unmatched,
      originalText: text,
    };
  }
}
