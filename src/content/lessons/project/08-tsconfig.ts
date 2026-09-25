import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj8",
  region: 10,
  title: "Разбор tsconfig и TypeScript 6",
  q: "Объясни по строчкам tsconfig своего проекта. Что поменялось в настройках по умолчанию в TypeScript 6?",
  answer: "Хороший ответ идёт по группам. Что проверять: `strict` и флаги сверх него вроде `noUncheckedIndexedAccess`. Как собирать: `target`, `lib`, `module`, `moduleResolution`, `jsx`, `noEmit`, если собирает Vite. Совместимость с инструментами: `isolatedModules` или `verbatimModuleSyntax`, `skipLibCheck`. Файлы: `include`, `types`, `paths`. TypeScript 6 (март 2026) поменял умолчания: `strict: true`, `module: esnext`, `target: es2025`, `types: []`, `esModuleInterop` всегда включён; устарели `target: es5`, `baseUrl`, `outFile`, `moduleResolution: node` и `classic` — в TypeScript 7 их уже не будет.",
  theory: {
    p: [
      "Типичный tsconfig приложения на Vite: `target: es2022`, `lib: [\"es2022\", \"dom\"]`, `module: esnext`, `moduleResolution: bundler`, `jsx: react-jsx`, `strict: true`, `noEmit: true` (JavaScript делает сборщик), `isolatedModules` или `verbatimModuleSyntax`, `skipLibCheck: true`, `include: [\"src\"]`. На собеседовании важно объяснить, зачем каждая строка, а не перечислить.",
      "Группы настроек. Проверка: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`. Выход: `target`, `module`, `outDir`, `declaration`, `sourceMap`, `noEmit`. Поиск модулей: `moduleResolution`, `paths`, `types`. Совместимость с инструментами: `isolatedModules`, `verbatimModuleSyntax`, `erasableSyntaxOnly`. Скорость: `skipLibCheck`, `incremental`, `composite`.",
      "TypeScript 6.0 — последняя версия на JavaScript и мост к 7.0. Умолчания стали современными: `strict: true`, `module: esnext`, `target: es2025`, `types: []`, `rootDir` — папка с tsconfig, `noUncheckedSideEffectImports: true`, `esModuleInterop` и `allowSyntheticDefaultImports` включены всегда. Устаревшее можно временно оставить с `\"ignoreDeprecations\": \"6.0\"`, но TypeScript 7 его не поддержит.",
      "Практика обновления: добавить `types`, если используются глобальные типы Node или тестов; заменить `baseUrl` на полные пути в `paths`; убрать `target: es5` и `moduleResolution: node`. Проверка `tsc --noEmit` после обновления покажет всё, что сломалось. В этом тренажёре компилятор — TypeScript 5.9 в строгом режиме, флаги меняет строка `// @flags:`.",
    ],
    example: `// @flags: noUncheckedIndexedAccess
// Как настройки проверки выглядят в коде: strict плюс noUncheckedIndexedAccess.
const env: { [key: string]: string } = { MODE: "dev" };
const mode = env.MODE;
mode.toUpperCase();                   // ошибка: значения может не быть
const safe = (env.MODE ?? "prod").toUpperCase();`,
    keys: ["tsconfig объясняют по группам: проверка, выход, поиск модулей, совместимость с инструментами, скорость.", "TypeScript 6: `strict`, `module: esnext`, `target: es2025`, `types: []` по умолчанию, `esModuleInterop` всегда.", "Устарели `es5`, `baseUrl`, `outFile`, `node10` и `classic`: `ignoreDeprecations` — временно, в TS 7 их нет."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Зачем в tsconfig проекта на Vite `noEmit: true`?",
      opts: ["JavaScript собирает Vite, а `tsc` нужен только для проверки типов", "Чтобы отключить проверку типов", "Чтобы не создавать source maps", "Так быстрее работает браузер"],
      a: 0,
      why: "Два инструмента — две роли: сборщик создаёт файлы, `tsc --noEmit` только проверяет.",
    },
    {
      type: "quiz",
      q: "Что из этого стало настройкой по умолчанию в TypeScript 6?",
      opts: ["`strict: true`", "`target: es5`", "`moduleResolution: node`", "`types`: все пакеты `@types`"],
      a: 0,
      why: "Строгий режим стал базой. `es5` и `node` объявлены устаревшими, а `types` по умолчанию пуст.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `mode` с флагом `noUncheckedIndexedAccess`?",
      probe: "mode",
      code: `// @flags: noUncheckedIndexedAccess
const env: { [key: string]: string } = { MODE: "dev" };
const mode = env.MODE;`,
      opts: ["string | undefined", "string", "\"dev\"", "undefined"],
      a: 0,
      why: "Чтение по index signature с этим флагом учитывает, что ключа может не быть.",
    },
  ],
};
