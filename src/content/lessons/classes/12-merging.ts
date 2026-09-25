import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl12",
  region: 7,
  title: "Declaration merging и расширение модулей",
  q: "Что такое declaration merging? Как расширить тип сторонней библиотеки или глобальный тип?",
  answer: "Declaration merging — TypeScript сливает несколько объявлений с одним именем в одно. Два `interface Box` становятся одним интерфейсом со всеми полями — поэтому интерфейсы, в отличие от `type`, можно дополнять. На этом держится расширение модулей (module augmentation): в своём файле пишут `declare module \"express\" { interface Request { user?: User } }`, и тип библиотеки получает новое поле. Глобальные типы дополняют через `declare global { interface Window { … } }` в файле-модуле.",
  theory: {
    p: [
      "Два объявления `interface Box { width: number }` и `interface Box { height: number }` сливаются в один `Box` с обоими полями. С `type` так нельзя — повторное объявление будет ошибкой. Сливаться могут интерфейсы, пространства имён, а также класс или функция с пространством имён.",
      "Расширение модуля. Библиотека объявляет `interface Request`, а приложению нужно поле `user`, которое добавляет свой middleware. В своём файле-модуле пишут `declare module \"библиотека\" { interface Request { user?: User } }` — и после этого везде `req.user` типизирован. Так расширяют Express, Vue, i18n-библиотеки, темы styled-components.",
      "Расширение глобальной области: `declare global { interface Window { analytics: Analytics } }`. Работает только в файле-модуле, поэтому часто рядом стоит `export {}`. Так же дополняют встроенные типы — например, добавляют метод к `Array`, если его подключили полифилом.",
      "Правило: дополнять можно только интерфейсы и пространства имён, новые экспорты в чужой модуль так не добавить. Расширения держат в отдельном `.d.ts` в проекте, чтобы было видно, где тип библиотеки изменён.",
    ],
    example: `// @filename: shop-api.d.ts
declare module "shop-api" {
  export interface User { id: number }
}
// @filename: augment.ts
import "shop-api";
declare module "shop-api" {
  interface User { role: string }
}
declare global {
  interface Window { appVersion: string }
}
// @filename: main.ts
import type { User } from "shop-api";
const u: User = { id: 1, role: "admin" };
const v: string = window.appVersion;
const bad: User = { id: 2 };         // ошибка: role теперь обязателен`,
    keys: ["Одноимённые интерфейсы сливаются в один, `type` так не умеет.", "Module augmentation: `declare module \"lib\" { interface X { … } }` дополняет тип библиотеки.", "`declare global { … }` в файле-модуле дополняет глобальные типы, например `Window`."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Почему типы библиотек расширяют интерфейсами, а не `type`?",
      opts: ["Одноимённые интерфейсы сливаются, а повторный `type` — ошибка", "`type` нельзя экспортировать", "Интерфейсы быстрее", "Так требует ESLint"],
      a: 0,
      why: "Declaration merging работает только для интерфейсов и пространств имён.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `interface Box { width: number }
interface Box { height: number }
declare const b: Box;
const r = b.height + b.width;`,
      opts: ["number", "never", "unknown", "string"],
      a: 0,
      why: "Оба объявления слились: у `Box` есть и `width`, и `height`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Добавь в глобальный `Window` поле `analytics` с методом `track(event: string): void`, чтобы код ниже компилировался.",
      code: `// @filename: globals.ts
export {};
// @filename: main.ts
window.analytics.track("page_view");`,
      tests: `// @ts-expect-error — событие должно быть строкой
window.analytics.track(1);`,
      forbid: ["any", "ignore"],
      must: ["declare global"],
      hint: "В `globals.ts`: `declare global { interface Window { analytics: { track(event: string): void } } }`.",
      solution: `// @filename: globals.ts
export {};
declare global {
  interface Window {
    analytics: { track(event: string): void };
  }
}
// @filename: main.ts
window.analytics.track("page_view");`,
    },
  ],
};
