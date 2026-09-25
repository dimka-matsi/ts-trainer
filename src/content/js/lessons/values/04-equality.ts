import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "val4",
  region: 0,
  level: "junior",
  title: "== и ===, NaN и Object.is",
  q: "Чем `==` отличается от `===`? Почему `NaN !== NaN` и что такое `Object.is`?",
  answer:
    "`===` сравнивает без приведения: разные типы — сразу `false`. `==` сначала приводит типы: строку и логическое значение к числу, объект к примитиву, а `null` и `undefined` равны только друг другу. `NaN` не равен ничему, даже себе, поэтому его проверяют через `Number.isNaN`. `Object.is` почти как `===`, но считает `NaN` равным `NaN` и различает `0` и `-0` — так React сравнивает состояние.",
  theory: {
    p: [
      "Строгое равенство `===` не приводит типы: `1 === \"1\"` — `false`. Нестрогое `==` приводит: `1 == \"1\"` — `true`. Правила `==`: `null` и `undefined` равны друг другу и больше ничему; строка и логическое значение сравниваются с числом как числа; объект с примитивом — через приведение объекта к примитиву. Отсюда `\"\" == 0` и `\"0\" == false` — оба `true`.",
      "В коде почти всегда пишут `===`. Единственное частое исключение — `x == null`: оно истинно и для `null`, и для `undefined`, и больше ни для чего. Сравнения `<`, `>=` устроены по-другому, чем `==`: `null >= 0` — `true`, потому что `null` приводится к `0`, хотя `null == 0` — `false`.",
      "`NaN` — результат неудачной арифметики — не равен ничему, даже себе: `NaN === NaN` — `false`. Проверяют его через `Number.isNaN(x)`. Старая глобальная `isNaN` сначала приводит к числу, поэтому `isNaN(\"abc\")` — `true`, хотя это строка.",
      "`Object.is(a, b)` — третий вид сравнения. Он как `===`, но `Object.is(NaN, NaN)` — `true`, а `Object.is(0, -0)` — `false`. Так сравнивает состояние React. Метод массива `includes` находит `NaN`, а `indexOf` — нет: `indexOf` сравнивает через `===`.",
    ],
    code: `console.log(1 == "1");          // true: строка приведена к числу
console.log(1 === "1");         // false: разные типы
console.log(null == undefined); // true
console.log(null == 0);         // false: null равен только undefined
console.log(null >= 0);         // true: для >= null становится 0
console.log(NaN === NaN);       // false
console.log(Number.isNaN(NaN)); // true
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(0, -0));    // false`,
    keys: [
      "`===` без приведения, `==` с приведением. Пиши `===`, исключение — `x == null` для проверки на `null` и `undefined` сразу.",
      "`NaN` не равен даже себе. Проверка — `Number.isNaN(x)`, а не глобальная `isNaN`.",
      "`Object.is` — как `===`, но `NaN` равен `NaN`, а `0` не равен `-0`. Так сравнивает React.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `console.log(null == undefined);
console.log(null == 0);
console.log(null >= 0);
console.log("" == 0);
console.log("0" == false);
console.log(NaN === NaN);`,
      opts: [
        "true\nfalse\ntrue\ntrue\ntrue\nfalse",
        "true\ntrue\ntrue\ntrue\ntrue\nfalse",
        "false\nfalse\nfalse\ntrue\nfalse\nfalse",
        "true\nfalse\nfalse\nfalse\ntrue\ntrue",
      ],
      a: 0,
      why: "`null` при `==` равен только `undefined`, а при `>=` приводится к `0`. Пустая строка и `\"0\"` становятся числом `0`, `false` — тоже `0`. `NaN` не равен даже себе.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `console.log([NaN].includes(NaN));
console.log([NaN].indexOf(NaN));
console.log(Object.is(0, -0));
console.log(0 === -0);`,
      opts: ["true\n-1\nfalse\ntrue", "false\n-1\nfalse\ntrue", "true\n0\ntrue\ntrue", "true\n-1\ntrue\nfalse"],
      a: 0,
      why: "`includes` сравнивает так, что `NaN` равен `NaN`, а `indexOf` — через `===`, поэтому `NaN` не находит. `Object.is` различает `0` и `-0`, а `===` — нет.",
    },
    {
      type: "quiz",
      q: "Когда `==` в коде уместно?",
      opts: [
        "`x == null` — проверка сразу на `null` и `undefined`",
        "Для сравнения строки из формы с числом",
        "Всегда, оно быстрее `===`",
        "Для сравнения двух объектов по содержимому",
      ],
      a: 0,
      why: "`x == null` истинно только для `null` и `undefined`, это короче двух проверок. В остальных случаях приведение прячет ошибки, поэтому пишут `===`. Объекты по содержимому не сравнивает ни то, ни другое.",
    },
    {
      type: "run",
      goal: "Напиши `same(a, b)`, которая сравнивает как `Object.is`: `NaN` равен `NaN`, а `0` не равен `-0`. Сам `Object.is` использовать нельзя.",
      code: `function same(a, b) {
  return a === b;
}`,
      tests: [
        ["same(NaN, NaN)", "true"],
        ["same(0, -0)", "false"],
        ["same(-0, -0)", "true"],
        ["same(1, 1)", "true"],
        ["same(\"1\", 1)", "false"],
      ],
      solution: `function same(a, b) {
  if (a !== a && b !== b) return true; // только NaN не равен себе
  if (a === 0 && b === 0) return 1 / a === 1 / b; // 1 / -0 — это -Infinity
  return a === b;
}`,
      hint: "`NaN` — единственное значение, для которого `x !== x`. А `0` и `-0` различаются делением: `1 / 0` — `Infinity`, `1 / -0` — `-Infinity`.",
      forbid: [{ re: "Object\\.is\\b", msg: "Без `Object.is`" }],
    },
  ],
};
