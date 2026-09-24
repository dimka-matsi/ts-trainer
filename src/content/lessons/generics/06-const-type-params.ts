import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g6",
  region: 4,
  title: "const у параметра типа",
  q: "Что делает модификатор `const` у параметра типа, `<const T>`?",
  answer: "Модификатор появился в TypeScript 5.0. С ним параметр типа выводится с точными значениями, как будто вызывающий написал `as const`. Без него из `[\"home\", \"about\"]` получится `string[]`, а с ним — кортеж `[\"home\", \"about\"]`. Вызывающему ничего дописывать не нужно.",
  theory: {
    p: [
      "Обычный параметр типа выводится с общими типами: для `list([\"home\", \"about\"])` получится `string[]`. Точные значения теряются, и дальше из них не получить union.",
      "Вызывающий может написать `as const` у аргумента, но об этом легко забыть. Модификатор `const` перед параметром типа, `<const T>`, делает то же самое на стороне функции: TypeScript выводит `T` так, как будто аргумент написан с `as const`.",
      "Ограничение обычно пишут как `readonly string[]`: тогда подходят и изменяемые массивы, и кортежи с `readonly`. С `readonly` в ограничении и результат получается `readonly`-кортежем.",
      "`const` работает и с объектами: для `<const T extends { mode: string }>` вызов с `{ mode: \"dark\" }` даст `T = { readonly mode: \"dark\" }`.",
    ],
    example: `function list<T extends readonly string[]>(items: T) {
  return items;
}
const a = list(["home", "about"]);   // string[]

function listConst<const T extends readonly string[]>(items: T) {
  return items;
}
const b = listConst(["home", "about"]); // readonly ["home", "about"]
type Page = (typeof b)[number];         // "home" | "about"

const c = list(["home", "about"] as const); // так тоже можно, но as const легко забыть`,
    keys: ["`<const T>` выводит точные значения, как `as const`.", "Вызывающему ничего не нужно дописывать.", "Для массивов ограничение пишут как `readonly ...[]`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `b`?",
      probe: "b",
      code: `function listConst<const T extends readonly string[]>(items: T) {
  return items;
}
const b = listConst(["home", "about"]);`,
      opts: ["readonly [\"home\", \"about\"]", "string[]", "readonly string[]", "(\"home\" | \"about\")[]"],
      a: 0,
      why: "`const` у параметра заставляет вывести аргумент как с `as const`: получается кортеж с точными значениями, который нельзя менять.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `a`?",
      probe: "a",
      code: `function list<T extends readonly string[]>(items: T) {
  return items;
}
const a = list(["home", "about"]);`,
      opts: ["string[]", "readonly [\"home\", \"about\"]", "[\"home\", \"about\"]", "readonly string[]"],
      a: 0,
      why: "Без `const` параметр выводится с общими типами: массив строк. Ограничение `readonly string[]` только разрешает передавать неизменяемые массивы и само тип не меняет.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`Route` должен быть union путей `\"/\" | \"/about\"`, но сейчас это `string`: `defineRoutes` теряет точные значения. Исправь объявление функции, не меняя её вызов и не дописывая `as const` к аргументу.",
      code: `function defineRoutes<T extends readonly string[]>(routes: T) {
  return routes;
}

const routes = defineRoutes(["/", "/about"]);
type Route = (typeof routes)[number];`,
      tests: `type t1 = Expect<Equal<Route, "/" | "/about">>;`,
      forbid: ["any", "as", "ignore"],
      must: ["const routes = defineRoutes([\"/\", \"/about\"]);"],
      hint: "Добавь `const` перед параметром типа: `<const T extends readonly string[]>`.",
      solution: `function defineRoutes<const T extends readonly string[]>(routes: T) {
  return routes;
}

const routes = defineRoutes(["/", "/about"]);
type Route = (typeof routes)[number];`,
    },
  ],
};
