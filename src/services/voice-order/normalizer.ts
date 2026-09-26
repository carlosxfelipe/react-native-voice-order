/**
 * voice-order/normalizer.ts
 *
 * Normalização de texto para facilitar comparação.
 * Remove acentos, padroniza abreviações, converte para minúsculas.
 */

/** Remove acentos e diacríticos de um texto. */
export function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Normaliza um texto: lowercase, sem acentos, sem pontuação. */
export function normalize(text: string): string {
  // Remove pontos entre números (separador de milhar do pt-BR) antes de limpar a pontuação
  const textWithoutThousandSeparators = text.replace(/(\d)\.(\d)/g, "$1$2");

  return removeAccents(textWithoutThousandSeparators)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Expande abreviações comuns de catálogo.
 * Ex: "lt" → "lata", "pet" → "pet", "c/" → "com", "s/" → "sem"
 */
const ABBREVIATIONS: Record<string, string> = {
  lt: "lata",
  "c/": "com",
  "s/": "sem",
  cg: "com gas",
  sg: "sem gas",
  gar: "garrafa",
  grf: "garrafa",
  ref: "refrigerante",
  cerv: "cerveja",
  gua: "guarana",
  pess: "pessego",
  lar: "laranja",
  ml: "",
  l: "",
  // Tamanhos subjetivos
  grande: "garrafa 2l 2 litros 1.5l",
  pequeno: "lata 350ml",
  pequena: "lata 350ml",
  litrao: "1l 1 litro",
  // Plurais
  latas: "lata",
  garrafas: "garrafa",
  litros: "l",
};

/** Expande abreviações conhecidas no texto. */
export function expandAbbreviations(text: string): string {
  let result = normalize(text);

  for (const [abbr, full] of Object.entries(ABBREVIATIONS)) {
    // Só substitui se for uma palavra isolada (word boundary)
    const regex = new RegExp(`\\b${abbr}\\b`, "gi");
    result = result.replace(regex, full);
  }

  return result.replace(/\s+/g, " ").trim();
}

/**
 * Gera variações de um nome de produto para matching.
 * Ex: "Coca-Cola LATA 350ml" → ["coca cola lata 350", "coca cola lata", "coca cola", "coca"]
 */
export function generateTokens(productName: string, brand: string): string[] {
  const normalized = normalize(productName);
  const brandNorm = normalize(brand);
  const expanded = expandAbbreviations(productName);

  const tokens = new Set<string>();

  // Nome completo normalizado
  tokens.add(normalized);
  // Nome expandido (abreviações)
  tokens.add(expanded);
  // Marca isolada
  tokens.add(brandNorm);

  // Palavras individuais significativas (3+ chars)
  const words = normalized.split(" ").filter((w) => w.length >= 3);
  for (const word of words) {
    tokens.add(word);
  }

  // Combinações de marca + palavras-chave
  const keywords = words.filter((w) => w !== brandNorm);
  for (const kw of keywords) {
    tokens.add(`${brandNorm} ${kw}`);
  }

  return Array.from(tokens);
}
