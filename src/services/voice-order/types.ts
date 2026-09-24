/**
 * voice-order/types.ts
 *
 * Tipos do módulo de pedido por voz.
 * Sem dependência de framework — fácil de transpor.
 */

/** Produto do catálogo — campos mínimos que o parser precisa. */
export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  [key: string]: unknown;
}

/** Um item reconhecido no pedido. */
export interface OrderItem {
  /** Produto encontrado no catálogo. */
  product: Product;
  /** Quantidade solicitada (default: 1). */
  quantity: number;
  /** Score de confiança do match (0–1). */
  confidence: number;
  /** Trecho do texto original que gerou esse match. */
  matchedText: string;
}

/** Resultado completo do parsing. */
export interface ParseResult {
  /** Itens reconhecidos com sucesso. */
  items: OrderItem[];
  /** Trechos que não foram reconhecidos como produtos. */
  unmatched: string[];
  /** Texto original completo. */
  originalText: string;
}

/** Configurações opcionais do parser. */
export interface ParserOptions {
  /**
   * Score mínimo de confiança para aceitar um match (0–1).
   * @default 0.4
   */
  minConfidence?: number;
  /**
   * Aliases customizados para produtos.
   * Ex: { "coca": ["coca-cola", "coquinha"], "monster": ["monstrinho"] }
   */
  aliases?: Record<string, string[]>;
}
