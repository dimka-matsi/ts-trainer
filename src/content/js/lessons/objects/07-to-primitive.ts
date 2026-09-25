import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj7",
  region: 3,
  title: "Как объект становится примитивом",
  q: "Как объект превращается в примитив? Почему `[] == ![]` — это `true`?",
  answer:
    "Когда объекту нужно стать примитивом, движок сначала ищет метод `Symbol.toPrimitive` и передаёт ему подсказку: `\"number\"`, `\"string\"` или `\"default\"`. Если метода нет, для подсказки `\"string\"` пробует `toString`, потом `valueOf`, а для остальных — наоборот. У обычных объектов `valueOf` возвращает сам объект, поэтому в итоге срабатывает `toString`. В `[] == ![]` справа `![]` — это `false`, слева пустой массив становится строкой `\"\"`, и обе стороны приводятся к числу `0`.",
  theory: {
    p: [
      "Операции вроде `+`, `-`, `==`, шаблонных строк и `String(obj)` работают с примитивами, поэтому объект сначала превращают в примитив. Движок передаёт подсказку — какой тип нужнее: `\"string\"` для шаблонных строк и `String()`, `\"number\"` для арифметики, кроме плюса, и сравнений `<`, `>`, `\"default\"` для `+` и `==`.",
      "Порядок: если у объекта есть метод `[Symbol.toPrimitive](hint)` — вызвать его. Иначе при подсказке `\"string\"` вызвать `toString()`, а если он вернул не примитив — `valueOf()`. При `\"number\"` и `\"default\"` — наоборот: сначала `valueOf()`, потом `toString()`. Если оба вернули объекты — `TypeError`.",
      "У обычного объекта и массива `valueOf` возвращает сам объект — не примитив, поэтому в итоге работает `toString`: массив даёт элементы через запятую, объект — `\"[object Object]\"`. У `Date` особое правило: для подсказки `\"default\"` она ведёт себя как строка, поэтому `date + 1` склеит строку, а `date - 1` даст число миллисекунд.",
      "Разбор `[] == ![]`. Сначала `![]`: массив — объект, объект истинен, значит, `![]` — `false`. Сравнение объекта с логическим значением через `==`: логическое становится числом `0`, массив — примитивом `\"\"`, пустая строка — числом `0`. `0 == 0` — `true`. Своему классу можно задать приведение через `Symbol.toPrimitive` — так делают денежные суммы и векторы.",
    ],
    code: `const price = {
  amount: 100,
  [Symbol.toPrimitive](hint) {
    console.log("подсказка:", hint);
    return hint === "string" ? this.amount + " ₽" : this.amount;
  },
};
console.log(\`Цена: \${price}\`); // string
console.log(price * 2);        // number
console.log(price + 1);        // default

const legacy = {
  valueOf() { return 42; },
  toString() { return "сорок два"; },
};
console.log(legacy + 1, String(legacy)); // 43 сорок два

console.log([] == ![]);        // true
console.log(new Date(0) - 0, typeof (new Date(0) + 1)); // 0 string`,
    keys: [
      "Сначала `Symbol.toPrimitive(hint)`. Без него: для строки — `toString`, потом `valueOf`, для числа и `default` — наоборот.",
      "У объектов и массивов `valueOf` возвращает сам объект, поэтому работает `toString`: `\"\"`, `\"1,2\"`, `\"[object Object]\"`.",
      "`[] == ![]`: справа `false`, слева `\"\"`, оба становятся `0`. `Date` с `+` склеивается как строка.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `console.log([] == ![]);
console.log([] + {});
console.log([1] == 1);
console.log({} == "[object Object]");`,
      opts: ["true\n[object Object]\ntrue\ntrue", "false\n[object Object]\nfalse\nfalse", "true\n0\ntrue\nfalse", "false\n[object Object]\ntrue\ntrue"],
      a: 0,
      why: "Слева в первой строке `\"\"`, справа `false`, оба становятся `0`. Массив `[1]` превращается в строку `\"1\"`, а она в число `1`. Обычный объект становится строкой `\"[object Object]\"`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const obj = {
  valueOf() {
    return 10;
  },
  toString() {
    return "объект";
  },
};
console.log(obj + 5);
console.log(\`\${obj}\`);
console.log(obj > 9);`,
      opts: ["15\nобъект\ntrue", "объект5\nобъект\ntrue", "15\n10\ntrue", "15\nобъект\nfalse"],
      a: 0,
      why: "Для `+` подсказка `\"default\"` — сначала `valueOf`, получилось `10 + 5`. Шаблонная строка просит `\"string\"` — работает `toString`. Сравнение просит число — `valueOf`.",
    },
    {
      type: "run",
      goal: "Напиши класс `Money(amount)`: в арифметике он ведёт себя как число `amount`, а в шаблонной строке и `String()` — как строка `\"<amount> ₽\"`.",
      code: `class Money {
  constructor(amount) {
    this.amount = amount;
  }
}`,
      tests: [
        ["new Money(100) * 2", "200"],
        ["`${new Money(50)}`", "\"50 ₽\""],
        ["String(new Money(7))", "\"7 ₽\""],
        ["new Money(1) + new Money(2)", "3"],
      ],
      solution: `class Money {
  constructor(amount) {
    this.amount = amount;
  }
  [Symbol.toPrimitive](hint) {
    return hint === "string" ? this.amount + " ₽" : this.amount;
  }
}`,
      hint: "Добавь метод `[Symbol.toPrimitive](hint)`: для подсказки `\"string\"` верни строку с рублями, иначе число.",
    },
  ],
};
