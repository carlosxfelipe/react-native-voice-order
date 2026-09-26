/**
 * voice-order/index.ts
 *
 * Exports públicos do módulo de pedido por voz.
 */

export { VoiceOrderParser, DOMAIN_ALIASES } from "./parser";
export { extractQuantity } from "./quantity-parser";
export { normalize, expandAbbreviations } from "./normalizer";
export { buildIndex, findBestMatch } from "./matcher";

export type { Product, OrderItem, ParseResult, ParserOptions } from "./types";
