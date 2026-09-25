import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "fun1",
  region: 2,
  level: "junior",
  title: "Способы объявить функцию и параметры",
  q: "Чем Function Declaration отличается от Function Expression? Как работают параметры по умолчанию и rest-параметры?",
  answer:
    "Function Declaration — `function f() {}` отдельной инструкцией: она создаётся заранее и доступна во всей области. Function Expression — функция как значение, например `const f = function () {}`: она появляется, только когда выполнение дойдёт до этой строки. Параметр по умолчанию подставляется, когда аргумент не передан или равен `undefined`, но не при `null`. Rest-параметр `...args` собирает оставшиеся аргументы в настоящий массив.",
  theory: {
    p: [
      "Функцию можно объявить тремя способами. Function Declaration — `function sum(a, b) {}` отдельной инструкцией. Function Expression — функция внутри выражения: `const sum = function (a, b) {}`. Стрелочная функция — `const sum = (a, b) => a + b`, у неё свои особенности, о них отдельный урок. Declaration создаётся до выполнения кода, поэтому её можно вызвать выше по тексту. Expression существует только после выполнения своей строки.",
      "Функции в JavaScript — обычные значения, объекты «первого класса». Их кладут в переменные, передают аргументами, возвращают из других функций, хранят в свойствах. У функции есть свойства: `name` — имя, `length` — число параметров до первого параметра со значением по умолчанию или rest-параметра.",
      "Параметр по умолчанию `function greet(name = \"гость\")` подставляется, когда аргумент не передали или передали `undefined`. `null` — это переданное значение, и по умолчанию оно не заменяется. Значение по умолчанию вычисляется при каждом вызове и может ссылаться на параметры слева: `function f(a, b = a * 2)`.",
      "Rest-параметр `...args` собирает все оставшиеся аргументы в массив — он всегда последний. Раньше для этого был объект `arguments`: он есть в обычных функциях, похож на массив, но массивом не является — у него нет `map` и `filter`. В новом коде пишут `...args`.",
    ],
    code: `console.log(declared(2)); // работает до объявления
function declared(x) { return x * 2; }

const expressed = function (x) { return x * 3; };
const arrow = (x) => x * 4;
console.log(expressed(2), arrow(2));

function greet(name = "гость", greeting = "Привет") {
  return greeting + ", " + name;
}
console.log(greet());           // Привет, гость
console.log(greet(undefined, "Здравствуй")); // undefined заменён
console.log(greet(null));       // null — это значение, не заменяется

function sum(...numbers) {      // настоящий массив
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3), sum.length, sum.name);`,
    keys: [
      "Declaration создаётся заранее и доступна во всей области, Expression — только после своей строки.",
      "Значение по умолчанию подставляется для пропущенного аргумента и `undefined`, но не для `null`.",
      "`...args` — настоящий массив оставшихся аргументов. `arguments` — старый псевдомассив, только в обычных функциях.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function greet(name = "гость", greeting = "Привет") {
  return greeting + ", " + name;
}
console.log(greet());
console.log(greet(undefined, "Здравствуй"));
console.log(greet(null));`,
      opts: [
        "Привет, гость\nЗдравствуй, гость\nПривет, null",
        "Привет, гость\nЗдравствуй, undefined\nПривет, гость",
        "Привет, гость\nЗдравствуй, гость\nПривет, гость",
        "Привет, undefined\nЗдравствуй, undefined\nПривет, null",
      ],
      a: 0,
      why: "Значение по умолчанию срабатывает на `undefined` — и когда аргумент пропущен, и когда передан явно. `null` — настоящее значение, его не заменяют.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function f(a, b = 2, ...rest) {}
function g(...all) {
  return all.length;
}
console.log(f.length);
console.log(g(1, 2, 3));
console.log(typeof g);`,
      opts: ["1\n3\nfunction", "3\n3\nfunction", "2\n3\nobject", "1\n1\nfunction"],
      a: 0,
      why: "`length` считает параметры до первого со значением по умолчанию — здесь только `a`. `...all` собрал три аргумента в массив. `typeof` для функции — `\"function\"`.",
    },
    {
      type: "quiz",
      q: "Что будет при вызове `f()` в строке выше `const f = function () {}`?",
      opts: [
        "`ReferenceError`: `const` до объявления в мёртвой зоне",
        "Функция выполнится",
        "`TypeError`: `f` — это `undefined`",
        "Вернётся `undefined`",
      ],
      a: 0,
      why: "Function Expression живёт в переменной, и правила — как у переменной. Для `const` до объявления — мёртвая зона. С `var` было бы `TypeError`: переменная есть, но в ней `undefined`.",
    },
    {
      type: "run",
      goal: "Напиши `sum(...numbers)`: сумма любого количества аргументов, для вызова без аргументов — `0`.",
      code: `function sum(a, b) {
  return a + b;
}`,
      tests: [
        ["sum()", "0"],
        ["sum(5)", "5"],
        ["sum(1, 2, 3)", "6"],
        ["sum(10, -2, 3, 4)", "15"],
      ],
      solution: `function sum(...numbers) {
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}`,
      hint: "Собери аргументы rest-параметром `...numbers` — получится массив. Сложи его элементы в цикле, начиная с `0`.",
    },
  ],
};
