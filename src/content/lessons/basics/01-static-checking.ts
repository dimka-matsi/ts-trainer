import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b1",
  region: 0,
  title: "Статическая проверка",
  q: "Что делает TypeScript и чего он не делает во время работы программы?",
  answer: "TypeScript проверяет код до запуска: находит опечатки в названиях свойств, забытые вызовы функций и сравнения, которые никогда не сработают. Перед запуском типы удаляются, и получается обычный JavaScript. Поэтому во время работы программы TypeScript ничего не проверяет, и данные с сервера нужно проверять отдельно.",
  theory: {
    p: [
      "TypeScript — это JavaScript, в котором можно указывать типы. Программа `tsc`, компилятор TypeScript, читает код, сверяет типы и сообщает об ошибках ещё до запуска. Такая проверка называется статической: для неё код не выполняется.",
      "TypeScript находит не только ошибки, из-за которых программа падает. `user.nmae` в JavaScript тихо вернёт `undefined`, а TypeScript подчеркнёт опечатку. Ещё он замечает функцию без скобок в условии (`if (isReady)` вместо `if (isReady())`) и сравнение, которое никогда не будет истинным.",
      "Чтобы код запустился в браузере или в Node, `tsc` превращает его в обычный JavaScript. Это называется компиляцией. Типы при этом удаляются целиком, и во время работы программы их нет. Если сервер пришлёт данные другой формы, TypeScript об этом не узнает.",
      "Даже если в коде есть ошибки типов, `tsc` по умолчанию всё равно создаст `.js`-файлы. Чтобы при ошибках файлы не создавались, включают настройку `noEmitOnError`. Настройка `strict` включает набор строгих проверок. В новых проектах её включают сразу, в этой песочнице она тоже включена.",
    ],
    example: `const user = { name: "Ann", age: 30 };
user.nmae;            // ошибка: опечатка в имени свойства

function isReady() { return true; }
if (isReady) { }      // ошибка: функция не вызвана

const x = Math.random() < 0.5 ? "a" : "b";
if (x === "c") { }    // ошибка: x никогда не равен "c"`,
    keys: ["TypeScript проверяет код до запуска.", "При компиляции типы удаляются, во время работы их нет.", "`tsc` создаёт JS даже при ошибках, если не включить `noEmitOnError`."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что останется от записи `name: string` в функции `function greet(name: string)` после компиляции в JavaScript?",
      opts: ["Ничего: получится `function greet(name)`", "Проверка `typeof name === \"string\"`", "Комментарий с типом", "Ошибка при вызове с числом"],
      a: 0,
      why: "Типы нужны только компилятору и удаляются целиком. Проверка типа в собранном JavaScript не появляется, поэтому вызов с числом во время работы программы пройдёт без ошибки.",
      example: `// Код на TypeScript:
function greet(name: string) {
  return "Привет, " + name;
}

// Что получится после компиляции:
// function greet(name) {
//   return "Привет, " + name;
// }`,
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `n`?",
      probe: "n",
      code: `const user = { name: "Ann", tags: ["a", "b"] };
const n = user.tags.length;`,
      opts: ["number", "string", "any", "string[]"],
      a: 0,
      why: "TypeScript сам определил тип `user` по значению: у поля `tags` тип `string[]`, то есть массив строк. Длина массива `length` всегда число.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "В коде три ошибки, TypeScript нашёл их до запуска. Исправь их так, чтобы программа делала задуманное: проверяла возраст, печатала имя и сообщение для обычного пользователя.",
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
      hint: "Функцию `isAdult` нужно вызвать со скобками. Свойство называется `name`. А `role` может быть только `\"senior\"` или `\"regular\"`.",
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
