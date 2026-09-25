import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj2",
  region: 3,
  level: "middle",
  title: "Прототипы и цепочка прототипов",
  q: "Что такое прототип и прототипное наследование? Чем `__proto__` отличается от `prototype`?",
  answer:
    "У каждого объекта есть скрытая ссылка на другой объект — прототип. Если свойства нет в самом объекте, движок ищет его в прототипе, потом в прототипе прототипа и так до `null` — это цепочка прототипов. Запись свойства всегда создаёт собственное свойство и прототип не меняет. `__proto__` — устаревший способ прочитать прототип объекта, сейчас пишут `Object.getPrototypeOf`. А `prototype` — обычное свойство функции: объект, который станет прототипом всех объектов, созданных этой функцией через `new`.",
  theory: {
    p: [
      "У каждого объекта есть скрытая ссылка `[[Prototype]]` на другой объект или `null`. Прочитать её — `Object.getPrototypeOf(obj)`, создать объект с заданным прототипом — `Object.create(proto)`. Старое свойство `obj.__proto__` делает то же, но его оставили только ради совместимости.",
      "Поиск свойства идёт по цепочке. Нет свойства в самом объекте — смотрим в прототипе, нет там — в его прототипе, и так до `null`. Поэтому у массива есть `map`: он лежит в `Array.prototype`. А у любого объекта есть `toString` из `Object.prototype` — конца почти всех цепочек.",
      "Запись и удаление работают только с самим объектом. `rabbit.eats = false` создаёт собственное свойство `rabbit`, которое закрывает унаследованное, а прототип не меняется. Методы из прототипа при этом получают `this` — объект перед точкой, а не прототип. Поэтому один метод в прототипе обслуживает тысячи объектов.",
      "Не путай `__proto__` и `prototype`. `__proto__` есть у любого объекта — это его прототип. `prototype` — свойство функций: объект, который станет прототипом для всех, кого создадут через `new ЭтаФункция()`. Так связаны `[]` и `Array.prototype`: массивы создаёт `Array`. `for...in` перебирает и унаследованные перечисляемые свойства, `Object.keys` — только собственные.",
    ],
    code: `const animal = {
  eats: true,
  describe() { return this.name + " ест: " + this.eats; },
};
const rabbit = Object.create(animal); // прототип rabbit — animal
rabbit.name = "Кролик";

console.log(rabbit.eats);                    // true — из прототипа
console.log(Object.hasOwn(rabbit, "eats"));  // false
console.log(rabbit.describe());              // this — это rabbit

rabbit.eats = false;                         // собственное свойство
console.log(animal.eats, rabbit.eats);       // true false

const arr = [1, 2];
console.log(Object.getPrototypeOf(arr) === Array.prototype);
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype);
console.log(Object.getPrototypeOf(Object.prototype)); // null — конец цепочки`,
    flow: {
      actors: ["arr", "Array.prototype", "Object.prototype", "null"],
      steps: [
        { from: 0, to: 1, label: "arr.toString(): в самом arr нет — ищем в Array.prototype", note: "нашли toString массивов, поиск остановлен" },
        { from: 0, to: 1, label: "arr.hasOwnProperty: нет ни в arr, ни в Array.prototype" },
        { from: 1, to: 2, label: "поиск идёт дальше — найден в Object.prototype" },
        { from: 2, to: 3, label: "arr.nothing: нет нигде, дальше только null", note: "результат — undefined" },
      ],
    },
    keys: [
      "У объекта есть скрытая ссылка на прототип. Свойство ищется по цепочке прототипов до `null`.",
      "Запись создаёт собственное свойство и не меняет прототип. `this` в унаследованном методе — объект перед точкой.",
      "`__proto__` (лучше `Object.getPrototypeOf`) — прототип объекта. `prototype` — свойство функции для объектов, созданных через `new`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const animal = { eats: true };
const rabbit = Object.create(animal);
console.log(rabbit.eats);
console.log(Object.hasOwn(rabbit, "eats"));
console.log("eats" in rabbit);
rabbit.eats = false;
console.log(animal.eats);`,
      opts: ["true\nfalse\ntrue\ntrue", "true\ntrue\ntrue\nfalse", "undefined\nfalse\nfalse\ntrue", "true\nfalse\nfalse\nfalse"],
      a: 0,
      why: "`eats` найден в прототипе, но собственным не является — `hasOwn` даёт `false`, а `in` видит и унаследованное. Запись `rabbit.eats = false` создала собственное свойство, `animal` не изменился.",
    },
    {
      type: "order",
      q: "Расставь, где движок ищет метод при вызове `[1, 2].hasOwnProperty(\"0\")`.",
      items: [
        "собственные свойства массива",
        "`Array.prototype`",
        "`Object.prototype` — метод найден здесь",
      ],
      why: "Поиск идёт от объекта вверх по цепочке. `hasOwnProperty` лежит в `Object.prototype`, после него — `null`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const base = {
  greet() {
    return "Я " + this.name;
  },
};
const a = Object.create(base);
a.name = "Аня";
const b = Object.create(a);
b.name = "Борис";
console.log(b.greet());
console.log(Object.getPrototypeOf(b) === a);`,
      opts: ["Я Борис\ntrue", "Я Аня\ntrue", "Я undefined\nfalse", "Я Борис\nfalse"],
      a: 0,
      why: "`greet` найден через два звена цепочки: `b` → `a` → `base`. Но вызван он как `b.greet()`, поэтому `this` — это `b`.",
    },
    {
      type: "quiz",
      q: "Что такое `Array.prototype`?",
      opts: [
        "Объект с методами массивов, который становится прототипом каждого массива",
        "Прототип самой функции `Array`",
        "Копия каждого массива",
        "Список всех массивов программы",
      ],
      a: 0,
      why: "`prototype` — свойство функции-конструктора. Прототип самой функции `Array` — это `Function.prototype`, не путай их.",
    },
  ],
};
