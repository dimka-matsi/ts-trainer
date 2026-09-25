import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "val1",
  region: 0,
  title: "Восемь типов и typeof",
  q: "Какие типы данных есть в JavaScript? Что вернёт `typeof null` и почему?",
  answer:
    "В JavaScript восемь типов: семь примитивов — `number`, `bigint`, `string`, `boolean`, `undefined`, `null`, `symbol` — и `object`. Массивы, функции и даты — тоже объекты. `typeof null` возвращает `\"object\"`: это ошибка первой версии языка, которую не исправили, чтобы не сломать старые сайты. Поэтому `null` проверяют через `=== null`, а массив — через `Array.isArray`.",
  theory: {
    p: [
      "Значение в JavaScript — либо примитив, либо объект. Примитивов семь: `number` (все числа, целые и дробные), `bigint` (целые числа любой длины, пишутся с `n` на конце), `string`, `boolean`, `undefined` (значение не задано), `null` (значения нет, это сказали явно) и `symbol` (уникальный ключ). Всё остальное — `object`: обычные объекты, массивы, функции, даты.",
      "Оператор `typeof` возвращает строку с названием типа. У него две странности. `typeof null` даёт `\"object\"` — ошибка из первой версии языка, её оставили ради совместимости. А `typeof` для функции даёт `\"function\"`, хотя функция — тоже объект: для удобства её выделили отдельно.",
      "Массив для `typeof` — просто `\"object\"`. Чтобы отличить массив, есть `Array.isArray(x)`. Чтобы проверить `null`, пишут `x === null`. Проверка «это обычный объект» обычно выглядит так: `typeof x === \"object\" && x !== null && !Array.isArray(x)`.",
      "Весь код в этом курсе выполняется в строгом режиме, как в современных модулях. Нажми «Запустить» под примером: вывод появится ниже, как в консоли браузера. Строки в консоли печатаются без кавычек.",
    ],
    code: `console.log(typeof 42);             // number
console.log(typeof "текст");        // string
console.log(typeof true);           // boolean
console.log(typeof undefined);      // undefined
console.log(typeof 10n);            // bigint
console.log(typeof Symbol("id"));   // symbol
console.log(typeof null);           // object — старая ошибка языка
console.log(typeof {});             // object
console.log(typeof []);             // object — массив тоже объект
console.log(typeof function () {}); // function, хотя это объект
console.log(Array.isArray([]));     // true`,
    keys: [
      "Восемь типов: семь примитивов (`number`, `bigint`, `string`, `boolean`, `undefined`, `null`, `symbol`) и `object`.",
      "`typeof null === \"object\"` — ошибка первой версии языка. `null` проверяют через `=== null`.",
      "Массив и функция — объекты. Массив определяют через `Array.isArray`, функцию — через `typeof x === \"function\"`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `console.log(typeof null);
console.log(typeof undefined);
console.log(typeof function () {});
console.log(typeof []);
console.log(typeof NaN);`,
      opts: [
        "object\nundefined\nfunction\nobject\nnumber",
        "null\nundefined\nfunction\narray\nnumber",
        "object\nundefined\nobject\nobject\nNaN",
        "null\nundefined\nfunction\nobject\nundefined",
      ],
      a: 0,
      why: "`typeof null` — `\"object\"` по исторической ошибке. Для функций `typeof` делает исключение и возвращает `\"function\"`. Массив — объект. `NaN` («не число») — значение типа `number`.",
    },
    {
      type: "sort",
      q: "Разложи значения: примитив или объект?",
      groups: ["примитив", "объект"],
      items: [
        ["`42`", 0],
        ["`\"текст\"`", 0],
        ["`null`", 0],
        ["`10n`", 0],
        ["`[1, 2]`", 1],
        ["`function () {}`", 1],
        ["`new Date()`", 1],
        ["`{ a: 1 }`", 1],
      ],
      why: "`null` — примитив, хотя `typeof` говорит `\"object\"`. Массивы, функции и даты — объекты.",
    },
    {
      type: "quiz",
      q: "Как надёжно проверить, что значение — массив?",
      opts: ["`Array.isArray(x)`", "`typeof x === \"array\"`", "`typeof x === \"object\"`", "`x.length !== undefined`"],
      a: 0,
      why: "`typeof` для массива возвращает `\"object\"`, типа `\"array\"` у него нет. У строки тоже есть `length`, так что проверка по `length` ошибётся.",
    },
    {
      type: "run",
      goal: "Напиши `getType(value)`: она работает как `typeof`, но для `null` возвращает `\"null\"`, а для массива — `\"array\"`.",
      code: `function getType(value) {
  return typeof value;
}`,
      tests: [
        ["getType(null)", "\"null\""],
        ["getType([1, 2])", "\"array\""],
        ["getType({})", "\"object\""],
        ["getType(() => 1)", "\"function\""],
        ["getType(10n)", "\"bigint\""],
        ["getType(\"x\")", "\"string\""],
      ],
      solution: `function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}`,
      hint: "Сначала отдельно проверь `null` через `===`, потом массив через `Array.isArray`, а для остального верни `typeof`.",
    },
  ],
};
