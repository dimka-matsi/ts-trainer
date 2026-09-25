import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob9",
  region: 3,
  title: "Symbol и unique symbol",
  q: "Что такое `unique symbol` и зачем символы как ключи объектов?",
  answer: "Символ — уникальное значение, которое создаёт `Symbol(\"описание\")`: два символа с одинаковым описанием не равны. Поэтому символы используют как ключи, которые не пересекутся с обычными строковыми полями и не попадут в `JSON.stringify` и `Object.keys`. Чтобы TypeScript знал конкретный символ и мог использовать его как ключ в типе, символ объявляют через `const` — тогда у него тип `unique symbol`. У `let` тип просто `symbol`.",
  theory: {
    p: [
      "`Symbol(\"id\")` создаёт новое уникальное значение: `Symbol(\"id\") === Symbol(\"id\")` — `false`. Описание нужно только для отладки. Символ-ключ не конфликтует с полями-строками и не виден в `Object.keys` и `JSON.stringify` — удобно для служебных данных.",
      "`const ID = Symbol(\"id\")` получает тип `unique symbol` — тип одного конкретного символа. TypeScript печатает его через имя константы: `typeof ID`. Такой символ можно использовать как ключ в типе: `{ [ID]: number }`. А `let other = Symbol()` — просто `symbol`, любой символ.",
      "`unique symbol` бывает только у `const` и у `readonly static` свойств класса: переменной `let` нельзя пообещать, что в ней всегда один и тот же символ. Объявить символ без значения можно через `declare const KEY: unique symbol`.",
      "Встроенные символы задают поведение объекта: `Symbol.iterator` делает объект перебираемым в `for…of`, `Symbol.toPrimitive` управляет преобразованием. С ними связан следующий урок про итераторы.",
    ],
    example: `const ID = Symbol("id");            // unique symbol
let other = Symbol("id");           // symbol

type Entity = { [ID]: number; name: string };
const e: Entity = { [ID]: 1, name: "Аня" };
const n = e[ID];                    // number

let bad: unique symbol = Symbol();  // ошибка: unique symbol только у const`,
    keys: ["Символ уникален: одинаковое описание не делает символы равными.", "`const S = Symbol()` — тип `unique symbol`, его можно использовать как ключ в типе.", "Символ-ключ не виден в `Object.keys` и `JSON.stringify`, а `Symbol.iterator` делает объект перебираемым."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `n`?",
      probe: "n",
      code: `const ID = Symbol("id");
type Entity = { [ID]: number; name: string };
const e: Entity = { [ID]: 1, name: "Аня" };
const n = e[ID];`,
      opts: ["number", "symbol", "unknown", "string"],
      a: 0,
      why: "`ID` — `unique symbol`, поэтому TypeScript знает, какое поле читается, и берёт его тип.",
    },
    {
      type: "quiz",
      q: "Почему `let key: unique symbol = Symbol()` не компилируется?",
      opts: ["`unique symbol` бывает только у `const`: `let` можно переназначить другим символом", "Символы нельзя хранить в переменных", "Нужен `new Symbol()`", "Нужно описание в скобках"],
      a: 0,
      why: "Тип `unique symbol` обещает один конкретный символ, а `let` этого обещания не держит.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши тип `Tagged`: у объекта есть поле по символу `TAG` со строковым значением и обычное поле `value` — число.",
      code: `const TAG = Symbol("tag");
type Tagged = { value: number };`,
      tests: `const t: Tagged = { [TAG]: "важно", value: 1 };
const s: string = t[TAG];
// @ts-expect-error — без поля TAG нельзя
const bad: Tagged = { value: 1 };`,
      forbid: ["any", "ignore"],
      hint: "Ключ-символ в типе пишут в квадратных скобках: `[TAG]: string`.",
      solution: `const TAG = Symbol("tag");
type Tagged = { [TAG]: string; value: number };`,
    },
  ],
};
