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
  "esModuleInterop", "allowSyntheticDefaultImports", "allowJs", "checkJs",
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

/** Кусок кода, который стал отдельным файлом: имя, текст и с какой строки и символа он начинается в общем коде. */
interface Section {
  path: string;
  text: string;
  line: number;
  offset: number;
}

/**
 * Делит код на файлы по строкам `// @filename: api.ts`, как песочница TypeScript. Строка-маркер остаётся в своём
 * файле комментарием, поэтому номера строк и позиции совпадают с общим кодом. Всё до первого маркера (например,
 * строка `// @flags:`) относится к первому файлу. Без маркеров весь код — файл /main.ts.
 */
export function splitFiles(code: string): Section[] {
  const lines = code.split("\n");
  const starts: { line: number; name: string }[] = [];
  lines.forEach((l, i) => {
    const m = /^\/\/ @filename:\s*([\w./-]+)\s*$/.exec(l);
    if (m) starts.push({ line: i, name: m[1]! });
  });
  if (!starts.length) return [{ path: MAIN, text: code, line: 0, offset: 0 }];
  const offsetOf = (line: number) => lines.slice(0, line).reduce((n, l) => n + l.length + 1, 0);
  return starts.map((st, i) => {
    const from = i === 0 ? 0 : st.line;
    const to = i + 1 < starts.length ? starts[i + 1]!.line : lines.length;
    return { path: "/" + st.name.replace(/^\.?\//, ""), text: lines.slice(from, to).join("\n"), line: from, offset: offsetOf(from) };
  });
}

export function createEngine(ts: TsApi, lib: string): Engine {
  const files = new Map<string, { version: number; text: string }>([
    ["/lib.d.ts", { version: 1, text: lib }],
    ["/prelude.d.ts", { version: 1, text: PRELUDE }],
    [MAIN, { version: 1, text: "" }],
  ]);
  const FIXED = new Set(["/lib.d.ts", "/prelude.d.ts"]);
  let sections: Section[] = [{ path: MAIN, text: "", line: 0, offset: 0 }];
  let version = 1;
  const base: TS.CompilerOptions = {
    strict: true,
    noLib: true,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
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
  /** Исходник файла в программе. JS-файлов без `allowJs` в программе нет — для них undefined. */
  const sourceFile = (path: string) => service.getProgram()?.getSourceFile(path);
  /** Файл и позиция внутри него для позиции в общем коде. */
  const locate = (pos: number) => {
    let sec = sections[0]!;
    for (const s of sections) if (s.offset <= pos) sec = s;
    return { sec, at: pos - sec.offset };
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
      const next = splitFiles(code);
      const same = next.length === sections.length && next.every((s, i) => s.path === sections[i]!.path && s.text === sections[i]!.text);
      if (same) return;
      version++;
      for (const path of [...files.keys()]) if (!FIXED.has(path) && !next.some((s) => s.path === path)) files.delete(path);
      for (const s of next) {
        const old = files.get(s.path);
        if (!old || old.text !== s.text) files.set(s.path, { version, text: s.text });
      }
      sections = next;
    },
    diagnostics() {
      return sections.flatMap((sec) => {
        const sf = sourceFile(sec.path);
        if (!sf) return [];
        const all = [...service.getSyntacticDiagnostics(sec.path), ...service.getSemanticDiagnostics(sec.path)];
        return all.map((d) => {
          const lc = d.start != null ? sf.getLineAndCharacterOfPosition(d.start) : { line: 0, character: 0 };
          return {
            line: sec.line + lc.line + 1,
            col: lc.character + 1,
            len: Math.max(1, d.length ?? 1),
            code: d.code,
            msg: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
          };
        });
      });
    },
    quickInfo(pos) {
      const { sec, at } = locate(pos);
      if (!sourceFile(sec.path)) return null;
      const q = service.getQuickInfoAtPosition(sec.path, at);
      return q ? ts.displayPartsToString(q.displayParts) : null;
    },
    completions(pos) {
      const { sec, at } = locate(pos);
      if (!sourceFile(sec.path)) return [];
      const res = service.getCompletionsAtPosition(sec.path, at, { includeCompletionsWithInsertText: false });
      if (!res) return [];
      return res.entries
        .filter((e) => !e.name.startsWith("__"))
        .sort((a, b) => a.sortText.localeCompare(b.sortText) || a.name.localeCompare(b.name))
        .map((e) => ({ name: e.name, kind: e.kind }));
    },
    declarations() {
      const out: Declaration[] = [];
      for (const sec of sections) {
        const sf = sourceFile(sec.path);
        if (!sf) continue;
        const push = (id: TS.Identifier) => out.push({ name: id.text, info: engine.quickInfo(sec.offset + id.getStart(sf)) ?? id.text });
        for (const st of sf.statements) {
          if ((ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isFunctionDeclaration(st) || ts.isClassDeclaration(st)) && st.name) {
            push(st.name);
          } else if (ts.isVariableStatement(st)) {
            for (const d of st.declarationList.declarations) if (ts.isIdentifier(d.name)) push(d.name);
          }
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
