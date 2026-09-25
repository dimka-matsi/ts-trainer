import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj4",
  region: 3,
  title: "Классы: сахар над прототипами",
  q: "Чем классы в JavaScript отличаются от функций-конструкторов? Как работают `extends`, `super`, статические и приватные поля?",
  answer:
    "Класс — удобная запись того же прототипного механизма: методы попадают в `prototype`, а `typeof` класса — `\"function\"`. Но есть отличия: класс нельзя вызвать без `new`, его тело всегда в строгом режиме, методы неперечисляемые, а объявление класса до его строки находится в мёртвой зоне. `extends` связывает прототипы, а в конструкторе наследника нужно вызвать `super()` до обращения к `this`. `static` — свойства самого класса, `#поле` — настоящее приватное поле, недоступное снаружи.",
  theory: {
    p: [
      "`class User { constructor(name) { this.name = name } hi() {} }` делает то же, что функция-конструктор с методом в прототипе: `User.prototype.hi` существует, а `typeof User` — `\"function\"`. Отличия: класс нельзя вызвать без `new` (`TypeError`), весь код класса строгий, методы не видны в `for...in`, а до строки объявления класс находится в мёртвой зоне, как `let`.",
      "`class Dog extends Animal` делает `Animal.prototype` прототипом `Dog.prototype`, поэтому объекты `Dog` видят методы обоих. В конструкторе наследника первым делом вызывают `super(...)`: объект создаёт родитель, и до `super` обращение к `this` бросает `ReferenceError`. `super.speak()` вызывает метод родителя из переопределённого метода.",
      "Поля класса пишут прямо в теле: `count = 0`. Они создаются у каждого объекта при создании. Приватные поля начинаются с `#`: `#balance` виден только внутри класса, снаружи обращение к нему — синтаксическая ошибка. `static` — свойства и методы самого класса, а не объектов: `User.create()`.",
      "Поле-стрелка `handle = () => { ... }` — частый приём против потери контекста: стрелка создаётся для каждого объекта и берёт `this` из конструктора. Её можно передавать как колбэк без `bind`. Цена — у каждого объекта своя копия функции.",
    ],
    code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " издаёт звук";
  }
}

class Dog extends Animal {
  #tricks = 0;            // приватное поле
  static count = 0;       // свойство класса
  constructor(name) {
    super(name);          // до обращения к this
    Dog.count++;
  }
  speak() {
    return super.speak() + ": гав"; // метод родителя
  }
  learn = () => ++this.#tricks; // стрелка в поле: this не теряется
}

const rex = new Dog("Рекс");
const learn = rex.learn;
learn();
console.log(rex.speak(), learn(), Dog.count);
console.log(typeof Animal, rex instanceof Animal);`,
    keys: [
      "Класс — запись поверх прототипов: методы в `prototype`, `typeof` — `\"function\"`. Без `new` не вызвать, до объявления — мёртвая зона.",
      "`extends` связывает прототипы. В конструкторе наследника `super()` вызывают до `this`.",
      "`static` — у самого класса, `#поле` — приватное. Поле-стрелка не теряет `this`, но копируется в каждый объект.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return this.name + " издаёт звук";
  }
}
class Dog extends Animal {
  speak() {
    return super.speak() + ": гав";
  }
}
const d = new Dog("Рекс");
console.log(d.speak());
console.log(typeof Animal);
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);`,
      opts: ["Рекс издаёт звук: гав\nfunction\ntrue", "Рекс: гав\nclass\ntrue", "Рекс издаёт звук: гав\nobject\nfalse", "undefined издаёт звук: гав\nfunction\ntrue"],
      a: 0,
      why: "У `Dog` нет своего конструктора — используется конструктор родителя, он записал `name`. `super.speak()` вызвал метод `Animal`. Класс — это функция, а `extends` связал прототипы.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `class Counter {
  #count = 0;
  static created = 0;
  constructor() {
    Counter.created++;
  }
  inc = () => {
    this.#count++;
    return this.#count;
  };
}
const c = new Counter();
new Counter();
const inc = c.inc;
inc();
console.log(inc());
console.log(Counter.created);
console.log(c.count);`,
      opts: ["2\n2\nundefined", "1\n1\n0", "2\n1\nundefined", "TypeError"],
      a: 0,
      why: "`inc` — стрелка в поле, её `this` навсегда объект `c`, поэтому вызов без объекта работает. `created` — одно на класс, его увеличили два конструктора. Приватное `#count` снаружи не видно, а обычного `count` нет.",
    },
    {
      type: "quiz",
      q: "Что будет, если в конструкторе наследника написать `this.x = 1` до `super()`?",
      opts: ["`ReferenceError`: `this` ещё не создан", "`x` запишется, всё работает", "`TypeError`: класс нельзя вызвать", "`super` вызовется автоматически"],
      a: 0,
      why: "В наследнике объект создаёт родительский конструктор. Пока `super()` не вызван, `this` не существует.",
    },
    {
      type: "run",
      goal: "Напиши класс `Stack` с методами `push(x)`, `pop()`, `peek()` и геттером `size`. Хранилище элементов должно быть приватным.",
      code: `class Stack {
  items = [];
  push(x) {
    this.items.push(x);
  }
  pop() {
    return this.items.pop();
  }
  peek() {}
  get size() {
    return 0;
  }
}`,
      tests: [
        ["(() => { const s = new Stack(); s.push(1); s.push(2); const top = s.pop(); return [top, s.peek(), s.size]; })()", "[2,1,1]"],
        ["(() => { const s = new Stack(); return [s.pop(), s.size]; })()", "[null,0]"],
        ["(() => { const s = new Stack(); s.push(1); return s.items; })()", "undefined"],
      ],
      solution: `class Stack {
  #items = [];
  push(x) {
    this.#items.push(x);
  }
  pop() {
    return this.#items.pop();
  }
  peek() {
    return this.#items[this.#items.length - 1];
  }
  get size() {
    return this.#items.length;
  }
}`,
      hint: "Переименуй поле в `#items` — тогда оно приватное. `peek` возвращает последний элемент, `size` — длину массива.",
    },
  ],
};
