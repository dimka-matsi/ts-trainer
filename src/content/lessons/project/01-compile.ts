import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj1",
  region: 10,
  title: "tsc, Babel, esbuild и SWC",
  q: "Чем `tsc` отличается от Babel, SWC и esbuild? Что делает `isolatedModules`? Что изменил TypeScript 7?",
  answer: "`tsc` — полный компилятор: проверяет типы всего проекта и может создать JavaScript и `.d.ts`. Babel, esbuild и SWC только стирают типы из каждого файла по отдельности, ничего не проверяя, — поэтому они в десятки раз быстрее, и сборщики вроде Vite используют их. Обычная схема: сборщик собирает, а `tsc --noEmit` проверяет типы в редакторе и CI. `isolatedModules` запрещает конструкции, которые нельзя скомпилировать, глядя на один файл, — например, реэкспорт типа без `export type`. TypeScript 7.0 (июль 2026) переписан на Go и проверяет в разы быстрее, но пока без стабильного программного API для инструментов вроде typescript-eslint.",
  theory: {
    p: [
      "`tsc` делает две разные работы: проверку типов, для которой нужен весь проект, и выдачу JavaScript — стирание типов и понижение синтаксиса под `target`. Для проверки он читает все файлы и `.d.ts` зависимостей, поэтому на больших проектах это медленно.",
      "Babel, esbuild и SWC делают только вторую часть и по одному файлу: вырезают аннотации и отдают JavaScript. Ошибки типов они не видят вообще. Поэтому в проектах на Vite, Next.js и других сборщиках типы проверяют отдельно: редактор на лету и `tsc --noEmit` в CI или в `npm run typecheck`.",
      "Поштучная компиляция не всё может понять. Реэкспорт `export { User } from \"./types\"`: без чтения другого файла не ясно, тип это или значение, и оставлять ли строку в JavaScript. `isolatedModules` заставляет писать так, чтобы каждый файл компилировался сам: `export type { User }`, без `const enum` из других файлов. Его включают всегда, когда собирает не `tsc`; более строгая замена — `verbatimModuleSyntax`.",
      "TypeScript 7.0 (8 июля 2026 года) — компилятор, переписанный на Go: проверка типов в 8–12 раз быстрее за счёт нативного кода и параллельности. Язык тот же. Но в 7.0 нет стабильного программного API, поэтому инструменты, которые встраивают компилятор (typescript-eslint, проверка шаблонов Vue и Svelte), пока работают на TypeScript 6, а API ждут в 7.1. В этом тренажёре работает TypeScript 5.9 — примеры от этого не меняются.",
    ],
    example: `// @flags: isolatedModules
// @filename: types.ts
export type User = { id: number };
export const LIMIT = 10;
// @filename: index.ts
export { User } from "./types";          // ошибка: тип без export type
export type { User as U } from "./types";
export { LIMIT } from "./types";`,
    keys: ["`tsc` проверяет типы всего проекта; Babel, esbuild и SWC только стирают типы по одному файлу.", "Схема: сборщик собирает, `tsc --noEmit` проверяет. `isolatedModules` делает код пригодным для поштучной компиляции.", "TypeScript 7.0 — компилятор на Go, в разы быстрее; стабильный API для инструментов — в 7.1."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Проект собирается Vite без ошибок, но в коде есть ошибка типов. Почему сборка прошла?",
      opts: ["esbuild только стирает типы и не проверяет их — нужен отдельный `tsc --noEmit`", "Vite исправил ошибку сам", "Ошибки типов не важны в продакшене", "Vite проверяет только файлы `.tsx`"],
      a: 0,
      why: "Транспиляторы не делают проверку типов. Её запускают отдельно — в редакторе, CI и перед коммитом.",
    },
    {
      type: "quiz",
      q: "Что главное изменилось в TypeScript 7.0?",
      opts: ["Компилятор переписан на Go и работает в разы быстрее, а язык остался тем же", "Появились новые типы вроде `Nominal<T>`", "Удалены интерфейсы", "TypeScript стал частью браузеров"],
      a: 0,
      why: "7.0 — про скорость проверки. Синтаксис и правила типов не менялись.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "С `isolatedModules` реэкспорт не компилируется. Исправь его так, чтобы строку можно было обработать без чтения другого файла.",
      code: `// @flags: isolatedModules
// @filename: model.ts
export type Product = { id: number; title: string };
// @filename: index.ts
export { Product } from "./model";`,
      forbid: ["any", "ignore"],
      hint: "Реэкспорт типа помечают: `export type { Product } from \"./model\";`.",
      solution: `// @flags: isolatedModules
// @filename: model.ts
export type Product = { id: number; title: string };
// @filename: index.ts
export type { Product } from "./model";`,
    },
  ],
};
