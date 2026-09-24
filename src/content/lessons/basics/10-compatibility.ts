import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b10",
  region: 0,
  title: "Совместимость типов",
  q: "Что такое структурная типизация и почему лишнее поле то ошибка, то нет?",
  answer: "TS сравнивает типы по структуре: объект подходит, если у него есть нужные свойства, а лишние не мешают. Исключение — свежие объектные литералы: там лишнее поле считается опечаткой. Для номинальной типизации используют branded types.",
  theory: {
    p: [
      "TypeScript сравнивает типы по форме, а не по имени — это структурная типизация. Объект подходит к типу, если в нём есть все нужные свойства нужных типов. Лишние свойства не мешают.",
      "Исключение — excess property checking. Если объектный литерал «свежий», то есть создан прямо в месте присваивания, лишние поля считаются опечаткой. Через промежуточную переменную проверка не срабатывает.",
      "Верх и низ системы типов: `unknown` принимает любое значение, но с ним ничего нельзя сделать без сужения. `never` не имеет значений и присваивается куда угодно. `any` ведёт себя и как верх, и как низ, поэтому он опасен.",
      "Если нужна номинальность, например чтобы не перепутать `UserId` и `OrderId`, используют branded types: пересечение с фиктивным полем, которое существует только в типах.",
    ],
    example: `interface Point { x: number; y: number }

const p3 = { x: 1, y: 2, z: 3 };
const a: Point = p3;                   // ок: лишнее поле не мешает
const b: Point = { x: 1, y: 2, z: 3 }; // ошибка: свежий литерал

let u: unknown = 42;
u.toFixed();                           // ошибка: сначала сузь
if (typeof u === "number") u.toFixed();`,
    keys: ["Совместимость — по форме, не по имени.", "Лишние поля ловятся только у свежих литералов.", "`unknown` — безопасный верх, `never` — низ."],
  },
  tasks: [
    {
      type: "quiz",
      q: "`interface Cat { name: string }` и `interface Dog { name: string }`. Можно ли передать `Dog` туда, где ждут `Cat`?",
      opts: ["Да, формы совпадают", "Нет, это разные интерфейсы", "Только через `as`", "Только если `Dog extends Cat`"],
      a: 0,
      why: "Совместимость проверяется по структуре. Одинаковые по форме типы взаимозаменяемы, как бы они ни назывались.",
    },
    {
      type: "predict",
      q: "Какой тип у `r`?",
      probe: "r",
      code: `declare const v: unknown;
const r = typeof v === "string" ? v : "none";`,
      opts: ["unknown", "string", "string | \"none\"", "any"],
      a: 1,
      why: "В первой ветке `v` сужен до `string`, во второй — литерал `\"none\"`, который входит в `string`. Union схлопывается в `string`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Сделай `UserId` номинальным (branded), чтобы обычную строку нельзя было передать в `loadUser` без `toUserId`. Здесь `as` разрешён внутри `toUserId`.",
      code: `type UserId = string;

function toUserId(raw: string): UserId {
  return raw;
}

function loadUser(id: UserId) {
  return id;
}`,
      tests: `// @ts-expect-error обычная строка не должна подходить
loadUser("u1");
loadUser(toUserId("u1"));`,
      forbid: ["any"],
      hint: "`type UserId = string & { readonly __brand: \"UserId\" }`, а в `toUserId` верни `raw as UserId`.",
      solution: `type UserId = string & { readonly __brand: "UserId" };

function toUserId(raw: string): UserId {
  return raw as UserId;
}

function loadUser(id: UserId) {
  return id;
}`,
    },
  ],
};
