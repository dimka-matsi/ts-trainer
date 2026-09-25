import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl11",
  region: 7,
  title: ".d.ts, declare и @types",
  q: "Что такое declaration file? Как типизировать JavaScript-библиотеку, у которой нет типов?",
  answer: "Declaration file `.d.ts` содержит только типы без кода: он описывает то, что уже существует во время работы — библиотеку на JavaScript, глобальные переменные, API окружения. Слово `declare` говорит «это есть, поверь»: `declare const VERSION: string`, `declare module \"left-pad\" { … }`. Типы популярных библиотек лежат в пакетах `@types/…` из DefinitelyTyped или идут вместе с библиотекой. Если типов нет, пишут свой `.d.ts` с `declare module`, начиная с того, что используется, а на крайний случай — `declare module \"lib\";`, и тогда всё из неё будет `any`.",
  theory: {
    p: [
      "`.d.ts` — файл только с объявлениями: типы, интерфейсы, сигнатуры функций без тел. Компилятор его не превращает в JavaScript. Так описаны встроенные API (`lib.dom.d.ts`), библиотеки и глобальные переменные, которые подставляет сборщик.",
      "`declare` — «это существует, но создано не здесь»: `declare const __APP_VERSION__: string` для переменной, которую вставляет сборщик, `declare function gtag(…): void` для скрипта аналитики. Проверки нет: если объявление не совпадает с реальностью, ошибка будет во время работы.",
      "Где взять типы библиотеки: в самой библиотеке (поле `types` в её `package.json`) или в пакете `@types/имя` из репозитория DefinitelyTyped. Если нет ни того, ни другого, пишут свой файл `types/left-pad.d.ts` с `declare module \"left-pad\" { export default function pad(s: string, n: number): string; }`.",
      "Быстрый обход — `declare module \"left-pad\";` без тела: импорт заработает, но всё из модуля будет `any`. Это допустимо как временная мера. Для модулей-файлов, например картинок, пишут шаблон: `declare module \"*.svg\" { const url: string; export default url; }`.",
    ],
    example: `// @filename: globals.d.ts
declare const __APP_VERSION__: string;
declare module "left-pad" {
  export default function pad(s: string, n: number): string;
}
declare module "*.svg" {
  const url: string;
  export default url;
}
// @filename: main.ts
import pad from "left-pad";
import logo from "./logo.svg";
const title: string = pad(__APP_VERSION__, 10) + logo;
pad(10, "x");                        // ошибка: аргументы перепутаны`,
    keys: ["`.d.ts` — только типы: описывает то, что уже существует во время работы.", "`declare` — «это есть, поверь»: без проверки, как и любое обещание компилятору.", "Типы берут из самой библиотеки или `@types/…`; если нет — свой `declare module`, в крайнем случае без тела (всё `any`)."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что делает `declare const __APP_VERSION__: string`?",
      opts: ["Говорит компилятору, что такая переменная существует, но создана не в этом коде", "Создаёт переменную со значением", "Импортирует переменную из пакета", "Проверяет, что переменная есть во время работы"],
      a: 0,
      why: "`declare` не создаёт код и ничего не проверяет. Значение подставит, например, сборщик.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `// @filename: types.d.ts
declare module "left-pad" {
  export default function pad(s: string, n: number): string;
}
// @filename: main.ts
import pad from "left-pad";
const r = pad("a", 3);`,
      opts: ["string", "any", "unknown", "void"],
      a: 0,
      why: "Объявление модуля описывает `pad` как функцию, которая возвращает строку.",
    },
    {
      type: "code",
      kind: "write",
      goal: "У библиотеки `slugify` нет типов. Опиши модуль: экспорт по умолчанию — функция, которая принимает строку и необязательный объект `{ lower?: boolean }` и возвращает строку.",
      code: `// @filename: slugify.d.ts
declare module "slugify";
// @filename: main.ts
import slugify from "slugify";
const s: string = slugify("Привет мир", { lower: true });`,
      tests: `// @ts-expect-error — первым аргументом должна быть строка
slugify(42);`,
      forbid: ["any", "ignore"],
      hint: "`declare module \"slugify\" { export default function slugify(s: string, options?: { lower?: boolean }): string; }`.",
      solution: `// @filename: slugify.d.ts
declare module "slugify" {
  export default function slugify(s: string, options?: { lower?: boolean }): string;
}
// @filename: main.ts
import slugify from "slugify";
const s: string = slugify("Привет мир", { lower: true });`,
    },
  ],
};
