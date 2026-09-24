/**
 * voice-order/matcher.ts
 *
 * Fuzzy matching de texto contra produtos do catálogo.
 * Usa similaridade de tokens — sem dependências externas.
 */

import { normalize, expandAbbreviations, generateTokens } from "./normalizer";
import type { Product } from "./types";

export interface MatchResult {
  product: Product;
  confidence: number;
}

/** Índice pré-processado de produtos para busca rápida. */
export interface ProductIndex {
  entries: Array<{
    product: Product;
    tokens: string[];
    normalizedName: string;
    expandedName: string;
  }>;
}

/**
 * Cria um índice de busca a partir do catálogo.
 * Chamar uma vez e reutilizar — evita reprocessar a cada query.
 */
export function buildIndex(products: Product[]): ProductIndex {
  return {
    entries: products.map((product) => ({
      product,
      tokens: generateTokens(product.name, product.brand),
      normalizedName: normalize(product.name),
      expandedName: expandAbbreviations(product.name),
    })),
  };
}

/**
 * Calcula similaridade entre duas strings (0–1).
 * Usa coeficiente de Dice sobre bigramas.
 */
function diceCoefficient(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;

  const bigramsA = new Set<string>();
  for (let i = 0; i < a.length - 1; i++) {
    bigramsA.add(a.substring(i, i + 2));
  }

  const bigramsB = new Set<string>();
  for (let i = 0; i < b.length - 1; i++) {
    bigramsB.add(b.substring(i, i + 2));
  }

  let intersection = 0;
  for (const bigram of bigramsA) {
    if (bigramsB.has(bigram)) intersection++;
  }

  return (2 * intersection) / (bigramsA.size + bigramsB.size);
}

/**
 * Verifica se o query contém todas as palavras-chave significativas.
 * Retorna um score baseado na proporção de palavras encontradas.
 */
function wordOverlap(query: string, target: string): number {
  const queryWords = new Set(query.split(" ").filter((w) => w.length >= 2));
  const targetWords = target.split(" ").filter((w) => w.length >= 2);

  if (targetWords.length === 0) return 0;

  let matches = 0;
  for (const tw of targetWords) {
    for (const qw of queryWords) {
      // Aceita match parcial (ex: "coca" match "coca cola")
      if (qw.includes(tw) || tw.includes(qw)) {
        matches++;
        break;
      }
    }
  }

  return matches / targetWords.length;
}

/**
 * Busca o melhor match para um texto de query no índice.
 * Combina múltiplas estratégias de matching.
 */
export function findBestMatch(
  query: string,
  index: ProductIndex
): MatchResult | null {
  const normalizedQuery = normalize(query);
  const expandedQuery = expandAbbreviations(query);

  if (!normalizedQuery) return null;

  let bestMatch: MatchResult | null = null;

  for (const entry of index.entries) {
    let maxScore = 0;

    // Estratégia 1: Dice coefficient contra nome normalizado
    const diceName = diceCoefficient(normalizedQuery, entry.normalizedName);
    maxScore = Math.max(maxScore, diceName);

    // Estratégia 2: Dice coefficient contra nome expandido
    const diceExpanded = diceCoefficient(expandedQuery, entry.expandedName);
    maxScore = Math.max(maxScore, diceExpanded);

    // Estratégia 3: Match exato de substring
    if (
      entry.normalizedName.includes(normalizedQuery) ||
      normalizedQuery.includes(entry.normalizedName)
    ) {
      const shorter = Math.min(
        normalizedQuery.length,
        entry.normalizedName.length
      );
      const longer = Math.max(
        normalizedQuery.length,
        entry.normalizedName.length
      );
      const substringScore = shorter / longer;
      maxScore = Math.max(maxScore, substringScore * 0.9 + 0.1);
    }

    // Estratégia 4: Word overlap
    const overlap = wordOverlap(normalizedQuery, entry.normalizedName);
    maxScore = Math.max(maxScore, overlap * 0.85);

    // Estratégia 5: Match contra tokens individuais
    for (const token of entry.tokens) {
      if (normalizedQuery.includes(token) || token.includes(normalizedQuery)) {
        const shorter = Math.min(normalizedQuery.length, token.length);
        const longer = Math.max(normalizedQuery.length, token.length);
        const tokenScore = (shorter / longer) * 0.8;
        maxScore = Math.max(maxScore, tokenScore);
      }

      const diceToken = diceCoefficient(normalizedQuery, token);
      if (diceToken > 0.5) {
        maxScore = Math.max(maxScore, diceToken * 0.8);
      }
    }

    // Estratégia 6: Match por marca (bonus)
    const brandNorm = normalize(entry.product.brand);
    if (normalizedQuery.includes(brandNorm) && brandNorm.length >= 3) {
      maxScore = Math.max(maxScore, maxScore + 0.1, 0.3);
    }

    if (maxScore > (bestMatch?.confidence ?? 0)) {
      bestMatch = { product: entry.product, confidence: Math.min(maxScore, 1) };
    }
  }

  return bestMatch;
}
