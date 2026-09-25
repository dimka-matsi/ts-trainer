import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc5",
  region: 6,
  title: "Template literal types",
  q: "Что умеют template literal types? Как вытащить параметры из строки маршрута `/users/:id`?",
  answer: "Template literal type собирает строковый тип по шаблону: `${Size}-${Color}`. Если в шаблоне union, получается все сочетания, как декартово произведение. Вместе с `infer` шаблон разбирает строку: `S extends ${string}:${infer P}/${infer Rest}` вытаскивает имя параметра, а рекурсия проходит по всей строке. Так типизируют параметры маршрутов, имена событий `onXChanged`, CSS-классы и ключи переводов.",
  theory: {
    p: [
      "Шаблонная строка в позиции типа работает как в JavaScript, только с типами: `user-${number}` — любая строка вида «user-42». Если подставить union, TypeScript перечислит все сочетания: два размера и два цвета дают четыре класса.",
      "С mapped types шаблоны генерируют имена: для каждого ключа настроек — обработчик `on${Capitalize<K>}Changed`. Это частая задача на собеседовании: «сделай типобезопасный `on(event, handler)`».",
      "Разбор строк: `infer` внутри шаблона. `S extends ${infer Head}/${infer Tail}` делит строку по первому `/`. Для маршрута `/users/:id/posts/:postId` нужно найти каждый кусок после `:` — рекурсивно: взять первый параметр и повторить для остатка.",
      "Ограничения. Слишком большой union сочетаний TypeScript не построит — есть лимит около 100 000 членов. Разбор длинных строк упирается в глубину рекурсии. Для вывода подсказок это обычно не проблема, но строить такими типами целые парсеры не стоит.",
    ],
    example: `type Size = "s" | "m";
type Color = "red" | "blue";
type Cls = \`\${Size}-\${Color}\`;          // "s-red" | "s-blue" | "m-red" | "m-blue"

type RouteParams<S> =
  S extends \`\${string}:\${infer P}/\${infer Rest}\` ? P | RouteParams<\`/\${Rest}\`>
  : S extends \`\${string}:\${infer P}\` ? P
  : never;
type P = RouteParams<"/users/:id/posts/:postId">;  // "id" | "postId"

const c: Cls = "l-red";                   // ошибка: такого сочетания нет`,
    keys: ["Шаблон с union даёт все сочетания строк.", "С mapped types шаблоны генерируют имена ключей: `on${Capitalize<K>}Changed`.", "`infer` внутри шаблона разбирает строку, рекурсия проходит её целиком."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `Cls`?",
      probe: "Cls",
      code: `type Size = "s" | "m";
type Color = "red" | "blue";
type Cls = \`\${Size}-\${Color}\`;`,
      opts: ["\"s-red\" | \"s-blue\" | \"m-red\" | \"m-blue\"", "string", "\"s-red\" | \"m-blue\"", "`${Size}-${Color}`"],
      a: 0,
      why: "Шаблон с двумя union перебирает все пары: 2 × 2 = 4 строки.",
    },
    {
      type: "quiz",
      q: "Как в типе проверить, что строка начинается с `/api/`, и получить остаток пути?",
      opts: ["Условием с шаблоном `/api/${infer Rest}`: в ветке «да» `Rest` — остаток пути", "`S extends string ? S : never`", "`S[\"/api/\"]`", "`keyof S`"],
      a: 0,
      why: "`infer` внутри шаблона сопоставляет начало строки и называет остаток.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `Handlers<T>`: для каждого ключа `K` объекта настроек — метод `on{K с большой буквы}Changed`, который принимает новое значение этого поля.",
      code: `type Handlers<T> = {};`,
      tests: `type Settings = { theme: string; size: number };
type t1 = Expect<Equal<Handlers<Settings>, { onThemeChanged: (value: string) => void; onSizeChanged: (value: number) => void }>>;`,
      forbid: ["any", "ignore"],
      hint: "`[K in keyof T & string as on${Capitalize<K>}Changed]: (value: T[K]) => void`.",
      solution: `type Handlers<T> = {
  [K in keyof T & string as \`on\${Capitalize<K>}Changed\`]: (value: T[K]) => void;
};`,
    },
  ],
};
