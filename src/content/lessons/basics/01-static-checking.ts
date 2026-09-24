import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b1",
  region: 0,
  title: "Статическая проверка",
  q: "Что делает TypeScript и чего он не делает в рантайме?",
  answer: "TypeScript — статический типчекер: он проверяет код до запуска и ловит опечатки в свойствах, невызванные функции и несовпадения типов. Типы стираются при компиляции, поэтому в рантайме TS ничего не проверяет: данные из сети нужно валидировать отдельно.",
  theory: {
    p: [
      "TypeScript — статический типчекер для JavaScript: он анализирует код до запуска и сообщает об ошибках, которые иначе всплыли бы у пользователя.",
      "Он ловит не только то, что упало бы с исключением. `user.nmae` в JS молча вернёт `undefined`, а TS покажет ошибку. Так же ловятся невызванные функции (`if (isReady)` вместо `if (isReady())`) и сравнения, которые никогда не бывают истинными.",
      "Типы стираются при компиляции: в итоговом JS нет ни аннотаций, ни интерфейсов. Поэтому TS не проверяет данные в рантайме — ответ сервера может не совпасть с типом, и TS об этом не узнает.",
      "`tsc` по умолчанию выпускает JS даже при ошибках типов, флаг `noEmitOnError` это меняет. Режим `strict` включает набор строгих проверок, в новых проектах он должен быть включён. В этой песочнице `strict` включён.",
    ],
    example: `const user = { name: "Ann", age: 30 };
user.nmae;            // ошибка: опечатка в имени свойства

function isReady() { return true; }
if (isReady) { }      // ошибка: функция не вызвана

const x = Math.random() < 0.5 ? "a" : "b";
if (x === "c") { }    // ошибка: x никогда не равен "c"`,
    keys: ["TS проверяет код до запуска, а не во время.", "Типы стираются: в рантайме их нет.", "Ошибки типов не мешают эмиту JS без `noEmitOnError`."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что останется от `interface User { name: string }` в скомпилированном JavaScript?",
      opts: ["Ничего", "Пустой объект `User`", "Класс `User`", "Функция-проверка `isUser`"],
      a: 0,
      why: "Интерфейсы, type alias и аннотации существуют только для компилятора и полностью стираются. Поэтому TypeScript не может проверить данные во время выполнения.",
    },
    {
      type: "predict",
      q: "Какой тип у `n`?",
      probe: "n",
      code: `const user = { name: "Ann", tags: ["a", "b"] };
const n = user.tags.length;`,
      opts: ["number", "number | undefined", "any", "string[]"],
      a: 0,
      why: "Тип `user` выведен из литерала: `{ name: string; tags: string[] }`. У массива свойство `length` имеет тип `number`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Исправь три ошибки, которые TypeScript нашёл до запуска. Смысл кода не меняй: условие должно проверять обычного пользователя.",
      code: `const user = { name: "Ann", age: 30 };

function isAdult() {
  return user.age >= 18;
}

if (isAdult) {
  console.log(user.nmae.toUpperCase());
}

const role = user.age > 60 ? "senior" : "regular";
if (role === "junior") {
  console.log("обычный пользователь");
}`,
      forbid: ["any", "as", "ignore"],
      must: ["isAdult()", "user.name"],
      hint: "Функцию нужно вызвать, свойство называется `name`, а у `role` всего два возможных значения.",
      solution: `const user = { name: "Ann", age: 30 };

function isAdult() {
  return user.age >= 18;
}

if (isAdult()) {
  console.log(user.name.toUpperCase());
}

const role = user.age > 60 ? "senior" : "regular";
if (role === "regular") {
  console.log("обычный пользователь");
}`,
    },
  ],
};
