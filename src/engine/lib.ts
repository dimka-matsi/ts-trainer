/**
 * Сборка lib.d.ts для встроенного компилятора.
 * Берём файлы стандартной библиотеки из пакета typescript и добавляем
 * минимальные декларации окружения (console, fetch, document),
 * которые нужны примерам в уроках.
 */

/** Файлы из node_modules/typescript/lib, порядок важен. */
export const LIB_FILES = [
  "lib.decorators.d.ts",
  "lib.decorators.legacy.d.ts",
  "lib.es5.d.ts",
  "lib.es2015.symbol.d.ts",
  "lib.es2015.symbol.wellknown.d.ts",
  "lib.es2015.iterable.d.ts",
  "lib.es2015.generator.d.ts",
  "lib.es2015.core.d.ts",
  "lib.es2015.collection.d.ts",
  "lib.es2015.promise.d.ts",
  "lib.es2016.array.include.d.ts",
  "lib.es2017.object.d.ts",
  "lib.es2017.string.d.ts",
] as const;

const ENV_DECLARATIONS = `
declare var console: { log(...data: any[]): void; error(...data: any[]): void; warn(...data: any[]): void };
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number): number;
interface Response { ok: boolean; status: number; json(): Promise<any>; text(): Promise<string> }
declare function fetch(input: string, init?: { method?: string; body?: string }): Promise<Response>;
interface Element { id: string; className: string }
interface HTMLElement extends Element { innerText: string; hidden: boolean; focus(): void }
interface HTMLInputElement extends HTMLElement { value: string; checked: boolean }
interface HTMLCanvasElement extends HTMLElement { width: number; height: number }
interface Document { getElementById(elementId: string): HTMLElement | null; querySelector(selectors: string): Element | null }
declare var document: Document;
interface Window { document: Document; innerWidth: number }
declare var window: Window;
`;

/** Склеивает исходники lib-файлов в один lib.d.ts. */
export function buildLib(sources: readonly string[]): string {
  const stripped = sources.map((src) => src.replace(/^\/\/\/ <reference.*$/gm, ""));
  return stripped.join("\n") + ENV_DECLARATIONS;
}

/**
 * Типы React для уроков «TS и React»: настоящие файлы пакета @types/react. Они не входят в программу сразу,
 * а подгружаются, только когда код импортирует `react` или использует JSX в файле `.tsx`.
 */
export const REACT_TYPE_FILES = ["index.d.ts", "global.d.ts", "jsx-runtime.d.ts"] as const;
export const REACT_TYPES_DIR = "/node_modules/@types/react/";

/**
 * Заглушка вместо пакета csstype (900 КБ): React берёт из него только тип CSS-свойств.
 * Стили в уроках не разбираются, поэтому достаточно словаря свойств.
 */
export const CSSTYPE_STUB = `export interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
  [property: string]: string | number | undefined;
}
export interface PropertiesHyphen<TLength = (string & {}) | 0, TTime = string & {}> extends Properties<TLength, TTime> {}
`;

/** Файлы, которые компилятор может прочитать по запросу: типы React и заглушка csstype. */
export function reactExtras(read: (file: (typeof REACT_TYPE_FILES)[number]) => string): Record<string, string> {
  const out: Record<string, string> = { "/node_modules/csstype/index.d.ts": CSSTYPE_STUB };
  for (const f of REACT_TYPE_FILES) out[REACT_TYPES_DIR + f] = read(f);
  return out;
}

/** Хелперы для тестов на типы, доступны в каждом упражнении. */
export const PRELUDE = `type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;
type Expect<T extends true> = T;
`;
