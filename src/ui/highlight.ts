export type TokenKind = "k" | "s" | "t" | "c" | "slot" | null;
export interface Token { text: string; kind: TokenKind }

const KEYWORDS = new Set([
  "function", "if", "else", "return", "declare", "interface", "type", "typeof", "instanceof", "in", "const", "let", "var",
  "async", "await", "class", "extends", "implements", "as", "keyof", "readonly", "infer", "new", "this", "for", "of", "is",
  "asserts", "public", "private", "satisfies", "true", "false", "switch", "case", "default",
]);
const TYPES = new Set(["string", "number", "boolean", "null", "void", "unknown", "never", "any", "undefined"]);

/** Простая подсветка одной строки TypeScript. §N§ — место для условия в сортировщике. */
export function tokenize(line: string): Token[] {
  const re = /(\/\/.*$)|("[^"]*"|'[^']*'|`[^`]*`)|(§\d+§)|([A-Za-z_$][\w$]*)/g;
  const out: Token[] = [];
  let last = 0;
  for (let m = re.exec(line); m; m = re.exec(line)) {
    if (m.index > last) out.push({ text: line.slice(last, m.index), kind: null });
    last = re.lastIndex;
    if (m[1]) out.push({ text: m[1], kind: "c" });
    else if (m[2]) out.push({ text: m[2], kind: "s" });
    else if (m[3]) out.push({ text: m[3].slice(1, -1), kind: "slot" });
    else {
      const w = m[4]!;
      out.push({ text: w, kind: KEYWORDS.has(w) ? "k" : TYPES.has(w) || /^[A-Z]/.test(w) ? "t" : null });
    }
  }
  if (last < line.length) out.push({ text: line.slice(last), kind: null });
  return out;
}
