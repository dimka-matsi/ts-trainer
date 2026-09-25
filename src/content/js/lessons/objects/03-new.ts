import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj3",
  region: 3,
  title: "Что делает new",
  q: "Что происходит при вызове функции с `new`?",
  answer:
    "`new User(\"Аня\")` делает четыре шага. Создаёт пустой объект. Делает его прототипом `User.prototype`. Вызывает `User` с `this`, равным этому объекту, и переданными аргументами. Если функция вернула объект — результатом будет он, иначе — созданный объект. Методы кладут в `User.prototype`, чтобы все объекты делили одну копию, а `instanceof` проверяет, есть ли `User.prototype` в цепочке прототипов.",
  theory: {
    p: [
      "Функция-конструктор — обычная функция, которую вызывают через `new`. По договорённости её имя пишут с большой буквы. Внутри она заполняет `this`: `this.name = name`. До классов так описывали «типы» объектов, и классы работают так же, просто запись короче.",
      "Шаги `new F(...args)`: создать пустой объект; поставить ему прототип `F.prototype`; вызвать `F` с `this` = новый объект; вернуть этот объект. Исключение: если `F` сама вернула объект, результатом будет он. Примитив в `return` игнорируется.",
      "Методы пишут не в `this`, а в `F.prototype`: `User.prototype.hi = function () {}`. Тогда метод существует в одном экземпляре, а все объекты находят его по цепочке. Если записать метод в `this` внутри конструктора, у каждого объекта будет своя копия функции.",
      "`obj instanceof F` проверяет, встречается ли `F.prototype` в цепочке прототипов `obj`. Если вызвать конструктор без `new`, в строгом режиме `this` будет `undefined`, и `this.name = name` бросит `TypeError`.",
    ],
    code: `function User(name) {
  this.name = name;           // this — новый объект
}
User.prototype.hi = function () {
  return "Я " + this.name;
};

const a = new User("Аня");
const b = new User("Борис");
console.log(a.hi(), b.hi());
console.log(a.hi === b.hi);                    // true: метод один
console.log(Object.getPrototypeOf(a) === User.prototype);
console.log(a instanceof User);

try {
  User("Вера");               // без new: this = undefined
} catch (e) {
  console.log(e.name);
}`,
    flow: {
      actors: ["new User(\"Аня\")", "Новый объект", "User.prototype", "Функция User"],
      steps: [
        { from: 0, to: 1, label: "1. создать пустой объект {}" },
        { from: 1, to: 2, label: "2. прототип объекта = User.prototype" },
        { from: 0, to: 3, label: "3. вызвать User с this = новый объект", note: "this.name = \"Аня\"" },
        { from: 3, to: 0, label: "4. функция не вернула объект — результат: новый объект" },
      ],
    },
    keys: [
      "`new F()`: пустой объект → прототип `F.prototype` → вызов `F` с этим `this` → возврат объекта.",
      "Если конструктор вернул объект, `new` вернёт его. Примитив в `return` игнорируется.",
      "Методы кладут в `F.prototype`, они общие для всех объектов. `instanceof` ищет `F.prototype` в цепочке.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function A() {
  this.x = 1;
  return { x: 2 };
}
function B() {
  this.x = 1;
  return 5;
}
console.log(new A().x);
console.log(new B().x);`,
      opts: ["2\n1", "1\n1", "2\n5", "1\nundefined"],
      a: 0,
      why: "`A` вернула объект — его и получил `new`. `B` вернула число, примитив в `return` игнорируется, и результатом стал созданный объект.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function Cat(name) {
  this.name = name;
  this.say = function () {
    return "мяу";
  };
}
Cat.prototype.run = function () {
  return "бежит";
};
const a = new Cat("Мурка");
const b = new Cat("Барсик");
console.log(a.say === b.say);
console.log(a.run === b.run);
console.log(Object.hasOwn(a, "run"));`,
      opts: ["false\ntrue\nfalse", "true\ntrue\nfalse", "false\nfalse\ntrue", "true\nfalse\ntrue"],
      a: 0,
      why: "`say` создаётся заново при каждом вызове конструктора — у каждого объекта своя функция. `run` лежит в прототипе один раз и не является собственным свойством.",
    },
    {
      type: "order",
      q: "Расставь шаги, которые выполняет `new User(\"Аня\")`.",
      items: [
        "создать пустой объект",
        "сделать его прототипом `User.prototype`",
        "вызвать `User` с `this`, равным новому объекту",
        "вернуть новый объект, если `User` не вернула свой объект",
      ],
      why: "Прототип ставится до вызова, поэтому уже внутри конструктора объект видит методы из `User.prototype`.",
    },
    {
      type: "run",
      goal: "Напиши `myNew(Constructor, ...args)` — то же, что `new Constructor(...args)`, но без оператора `new`.",
      code: `function myNew(Constructor, ...args) {
  return {};
}`,
      tests: [
        ["(() => { function P(n) { this.n = n; } P.prototype.get = function () { return this.n; }; const p = myNew(P, 5); return [p.get(), p instanceof P]; })()", "[5,true]"],
        ["(() => { function Q() { this.a = 1; return { z: 1 }; } return myNew(Q); })()", "{\"z\":1}"],
        ["(() => { function R() { this.a = 1; return 7; } return myNew(R); })()", "{\"a\":1}"],
      ],
      solution: `function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  const isObject = result !== null && (typeof result === "object" || typeof result === "function");
  return isObject ? result : obj;
}`,
      hint: "Создай объект с нужным прототипом через `Object.create(Constructor.prototype)`, вызови конструктор через `apply` с этим объектом как `this`. Если он вернул объект — верни его, иначе — созданный.",
      forbid: [{ re: "\\bnew\\b", msg: "Без оператора `new`" }],
    },
  ],
};
