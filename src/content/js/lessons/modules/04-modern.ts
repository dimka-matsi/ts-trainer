import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "mod4",
  region: 8,
  level: "middle",
  title: "Что нового в ES2020–ES2025",
  q: "Какие новые возможности JavaScript последних лет ты используешь?",
  answer:
    "Каждый год выходит новая версия стандарта. ES2020 дал `?.`, `??`, `BigInt`, `Promise.allSettled` и динамический `import()`. ES2021 — `??=`, `||=`, `&&=`, `replaceAll`, `Promise.any` и разделители в числах `1_000_000`. ES2022 — приватные поля `#`, `await` на верхнем уровне, `.at(-1)`, `Object.hasOwn` и `cause` у ошибок. ES2023 — немутирующие `toSorted`, `toReversed`, `with` и `findLast`. ES2024 — `Object.groupBy` и `Promise.withResolvers`. ES2025 — методы множеств у `Set`, помощники итераторов, `Promise.try` и `RegExp.escape`.",
  theory: {
    p: [
      "Стандарт ECMAScript выходит каждый июнь, и в него попадают предложения, прошедшие все стадии комитета TC39. Большую часть этих возможностей ты уже встречал в курсе: `?.` и `??`, `BigInt`, `Promise.allSettled` и `any`, приватные поля, `Object.hasOwn`, `toSorted`, методы `Set`, помощники итераторов. Этот урок собирает их вместе и добавляет недостающее.",
      "Логическое присваивание (ES2021): `a ??= b` записывает `b`, только если `a` — `null` или `undefined`; `a ||= b` — если `a` ложно; `a &&= b` — если истинно. Разделители в числах: `1_000_000`. `str.replaceAll(\"-\", \"+\")` заменяет все вхождения без регулярного выражения.",
      "ES2022: `arr.at(-1)` — последний элемент, отрицательный индекс считается с конца, работает и у строк. `await` на верхнем уровне модулей. Статические блоки в классах `static { ... }`. ES2023: `findLast` и `findLastIndex` ищут с конца. ES2024: `Object.groupBy(list, fn)` группирует в объект, `Map.groupBy` — в `Map`; `Promise.withResolvers()` отдаёт промис вместе с `resolve` и `reject`.",
      "ES2025: `Promise.try(fn)` запускает функцию и превращает и результат, и синхронную ошибку в промис; `RegExp.escape(str)` экранирует строку для регулярного выражения; импорт JSON-модулей `import data from \"./data.json\" with { type: \"json\" }`. Прежде чем использовать новинку, проверь поддержку браузерами на caniuse или MDN — старые браузеры закрывают полифилами или сборщиком.",
    ],
    code: `const nums = [1, 2, 3, 4];
console.log(nums.at(-1), "строка".at(0));          // 4 с

let title = null;
title ??= "Без названия";                           // только для null и undefined
let retries = 0;
retries ||= 3;                                      // для любого ложного
console.log(title, retries, 1_000_000 + 1);

console.log("a-b-c".replaceAll("-", "+"));
console.log(nums.findLast((n) => n % 2 === 1));     // 3 — поиск с конца
console.log(Object.groupBy(nums, (n) => (n % 2 ? "odd" : "even")));

const { promise, resolve } = Promise.withResolvers();
promise.then((v) => console.log("withResolvers:", v));
resolve("готово");

Promise.try(() => JSON.parse("{плохо"))             // синхронная ошибка → отклонённый промис
  .catch((e) => console.log("Promise.try поймал", e.name));`,
    keys: [
      "ES2020–ES2021: `?.`, `??`, `??=`, `||=`, `&&=`, `replaceAll`, `Promise.any`, `1_000_000`.",
      "ES2022–ES2024: `#приватные`, `await` в модулях, `.at()`, `Object.hasOwn`, `toSorted`, `findLast`, `Object.groupBy`, `Promise.withResolvers`.",
      "ES2025: методы `Set`, помощники итераторов, `Promise.try`, `RegExp.escape`. Поддержку проверяют на MDN и caniuse.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const nums = [1, 2, 3];
console.log(nums.at(-1));
let a = null;
a ??= "по умолчанию";
let b = 0;
b ||= 10;
let c = 0;
c ??= 10;
console.log(a, b, c);
console.log("a-b-c".replaceAll("-", "+"));`,
      opts: ["3\nпо умолчанию 10 0\na+b+c", "undefined\nпо умолчанию 10 10\na+b-c", "3\nnull 10 0\na+b+c", "1\nпо умолчанию 0 0\na+b+c"],
      a: 0,
      why: "`at(-1)` — последний элемент. `??=` сработал для `null`, но не для `0`, а `||=` заменил ложный `0`. `replaceAll` заменяет все вхождения.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const { promise, resolve } = Promise.withResolvers();
promise.then((v) => console.log("получили", v));
resolve(42);
console.log("сначала синхронно");
console.log(Object.groupBy([1, 2, 3, 4], (n) => (n % 2 ? "odd" : "even")));`,
      opts: [
        "сначала синхронно\n{ odd: [1, 3], even: [2, 4] }\nполучили 42",
        "получили 42\nсначала синхронно\n{ odd: [1, 3], even: [2, 4] }",
        "сначала синхронно\n{ even: [2, 4], odd: [1, 3] }\nполучили 42",
        "сначала синхронно\n[[1, 3], [2, 4]]\nполучили 42",
      ],
      a: 0,
      why: "`resolve` выполнил промис, но обработчик `then` — микрозадача, он ждёт конца синхронного кода. Ключи `groupBy` идут в порядке первого появления: сначала `1` дал `odd`.",
    },
    {
      type: "match",
      q: "Сопоставь возможность и что она делает.",
      pairs: [
        ["`arr.at(-1)`", "последний элемент массива"],
        ["`x ??= y`", "записать `y`, если `x` — `null` или `undefined`"],
        ["`Object.groupBy`", "разложить элементы по группам в объект"],
        ["`Promise.withResolvers`", "промис вместе с его `resolve` и `reject`"],
      ],
      why: "Все эти возможности заменяют частые самописные помощники: `arr[arr.length - 1]`, `if (x == null) x = y`, группировку через `reduce`.",
    },
    {
      type: "quiz",
      q: "Что делает `Promise.try(fn)` из ES2025?",
      opts: [
        "Вызывает `fn` и превращает и результат, и синхронную ошибку в промис",
        "Повторяет `fn`, пока промис не выполнится",
        "Ловит все необработанные отклонения на странице",
        "Запускает `fn` в отдельном потоке",
      ],
      a: 0,
      why: "Раньше писали `new Promise((r) => r(fn()))`, чтобы синхронная ошибка `fn` не вылетела мимо `.catch`. `Promise.try` делает то же короче.",
    },
  ],
};
