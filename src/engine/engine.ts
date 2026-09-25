import type * as TS from "typescript";
import { PRELUDE } from "./lib";

export type TsApi = typeof TS;

export interface Diagnostic {
  line: number;
  col: number;
  /** Длина подсвеченного фрагмента в символах (не меньше 1). */
  len: number;
  code: number;
  msg: string;
}

export interface Completion {
  name: string;
  /** Вид: property, method, function, keyword, var… — как у TypeScript. */
  kind: string;
}

export interface Declaration {
  name: string;
  info: string;
}

/** Обёртка над LanguageService с одним редактируемым файлом /main.ts. */
export interface Engine {
  readonly version: string;
  set(code: string): void;
  diagnostics(): Diagnostic[];
  quickInfo(pos: number): string | null;
  /** Варианты автодополнения в позиции pos. */
  completions(pos: number): Completion[];
  declarations(): Declaration[];
  transpile(code: string): string;
}

const MAIN = "/main.ts";

/** Флаги, которые пример может включить первой строкой `// @flags: noUncheckedIndexedAccess, strictNullChecks=false`. */
const FLAG_NAMES = [
  "strict", "noImplicitAny", "strictNullChecks", "strictFunctionTypes", "strictBindCallApply", "strictPropertyInitialization",
  "noImplicitThis", "useUnknownInCatchVariables", "noUncheckedIndexedAccess", "exactOptionalPropertyTypes",
  "noImplicitOverride", "noPropertyAccessFromIndexSignature", "noImplicitReturns", "noFallthroughCasesInSwitch",
  "verbatimModuleSyntax", "isolatedModules", "erasableSyntaxOnly", "experimentalDecorators",
] as const;

/** Разбирает строку `// @flags:` в начале кода. Неизвестные имена пропускаются. */
export function parseFlags(code: string): Record<string, boolean> {
  const m = /^\/\/ @flags:([^\n]*)/.exec(code);
  const out: Record<string, boolean> = {};
  if (!m) return out;
  for (const part of m[1]!.split(",")) {
    const [name, value] = part.trim().split("=");
    if (name && (FLAG_NAMES as readonly string[]).includes(name)) out[name] = value !== "false";
  }
  return out;
}

export function createEngine(ts: TsApi, lib: string): Engine {
  const files = new Map<string, { version: number; text: string }>([
    ["/lib.d.ts", { version: 1, text: lib }],
    ["/prelude.d.ts", { version: 1, text: PRELUDE }],
    [MAIN, { version: 1, text: "" }],
  ]);
  const base: TS.CompilerOptions = {
    strict: true,
    noLib: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.ESNext,
    noEmit: true,
    allowUnreachableCode: true,
    useDefineForClassFields: true,
  };
  let options: TS.CompilerOptions = base;
  let flagsKey = "{}";
  const host: TS.LanguageServiceHost = {
    getScriptFileNames: () => [...files.keys()],
    getScriptVersion: (f) => String(files.get(f)?.version ?? 0),
    getScriptSnapshot: (f) => {
      const file = files.get(f);
      return file ? ts.ScriptSnapshot.fromString(file.text) : undefined;
    },
    getCurrentDirectory: () => "/",
    getCompilationSettings: () => options,
    getDefaultLibFileName: () => "/lib.d.ts",
    fileExists: (f) => files.has(f),
    readFile: (f) => files.get(f)?.text,
    readDirectory: () => [],
    directoryExists: () => true,
    getDirectories: () => [],
  };
  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const sourceFile = () => {
    const sf = service.getProgram()?.getSourceFile(MAIN);
    if (!sf) throw new Error("main.ts не найден в программе");
    return sf;
  };

  const engine: Engine = {
    version: ts.version,
    set(code) {
      // Флаги из первой строки `// @flags:` действуют только для этого кода.
      const flags = parseFlags(code);
      const key = JSON.stringify(flags);
      if (key !== flagsKey) {
        flagsKey = key;
        options = { ...base, ...flags };
      }
      const main = files.get(MAIN)!;
      if (main.text !== code) files.set(MAIN, { version: main.version + 1, text: code });
    },
    diagnostics() {
      const all = [...service.getSyntacticDiagnostics(MAIN), ...service.getSemanticDiagnostics(MAIN)];
      const sf = sourceFile();
      return all.map((d) => {
        const lc = d.start != null ? sf.getLineAndCharacterOfPosition(d.start) : { line: 0, character: 0 };
        return {
          line: lc.line + 1,
          col: lc.character + 1,
          len: Math.max(1, d.length ?? 1),
          code: d.code,
          msg: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
        };
      });
    },
    quickInfo(pos) {
      const q = service.getQuickInfoAtPosition(MAIN, pos);
      return q ? ts.displayPartsToString(q.displayParts) : null;
    },
    completions(pos) {
      const res = service.getCompletionsAtPosition(MAIN, pos, { includeCompletionsWithInsertText: false });
      if (!res) return [];
      return res.entries
        .filter((e) => !e.name.startsWith("__"))
        .sort((a, b) => a.sortText.localeCompare(b.sortText) || a.name.localeCompare(b.name))
        .map((e) => ({ name: e.name, kind: e.kind }));
    },
    declarations() {
      const sf = sourceFile();
      const out: Declaration[] = [];
      const push = (id: TS.Identifier) => out.push({ name: id.text, info: engine.quickInfo(id.getStart(sf)) ?? id.text });
      for (const st of sf.statements) {
        if ((ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name) {
          push(st.name);
        } else if (ts.isVariableStatement(st)) {
          for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) push(d.name);
        }
      }
      return out;
    },
    transpile(code) {
      return ts.transpile(code, { target: ts.ScriptTarget.ES2017 });
    },
  };
  return engine;
}
