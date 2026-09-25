import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "fun4",
  region: 2,
  level: "middle",
  title: "Потеря контекста и bind",
  q: "Что такое потеря контекста? Как её исправить?",
  answer:
    "Потеря контекста — когда метод передают как колбэк: `run(user.hi)`. Передаётся сама функция без объекта, и её потом вызывают простым вызовом, поэтому `this` уже не `user`. Исправляют двумя способами: обернуть в стрелку `() => user.hi()` или привязать через `user.hi.bind(user)`. `bind` умеет ещё и частичное применение: `multiply.bind(null, 2)` фиксирует первый аргумент.",
  theory: {
    p: [
      "Метод — это просто функция в свойстве объекта. Выражение `user.hi` достаёт функцию, но объект к ней не прилипает. Когда эту функцию передают куда-то — в свою функцию, в таймер, в обработчик — её вызовут без объекта перед точкой, и `this` будет другим: `undefined` при простом вызове или тем, что решит вызывающий код. В браузере `setTimeout` вызывает функцию с `this`, равным глобальному объекту, а не `user`.",
      "Первое решение — обёртка-стрелка: `run(() => user.hi())`. Теперь вызов `user.hi()` написан явно, как метод. Минус: если `user` к моменту вызова поменяется, вызовется новый объект. Второе — `bind`: `run(user.hi.bind(user))` создаёт функцию, у которой `this` зафиксирован сразу.",
      "`bind` принимает не только `this`, но и начальные аргументы — это частичное применение. `multiply.bind(null, 2)` возвращает функцию, которой нужен только второй аргумент. `null` здесь значит «`this` не важен».",
      "`apply` раньше часто использовали, чтобы передать массив как список аргументов: `Math.max.apply(null, numbers)`. Сейчас то же делает spread: `Math.max(...numbers)`.",
    ],
    code: `const user = {
  name: "Аня",
  hi() {
    return this ? this.name : "контекст потерян";
  },
};

function run(callback) {
  return callback(); // простой вызов
}

console.log(run(user.hi));            // контекст потерян
console.log(run(() => user.hi()));    // обёртка: Аня
console.log(run(user.hi.bind(user))); // bind: Аня

function multiply(a, b) {
  return a * b;
}
const double = multiply.bind(null, 2); // частичное применение
console.log(double(5));                // 10
console.log(Math.max(...[3, 7, 2]), Math.max.apply(null, [3, 7, 2]));`,
    keys: [
      "Метод, переданный как значение, теряет объект: его вызовут без объекта перед точкой.",
      "Исправления: обёртка `() => user.hi()` или `user.hi.bind(user)`.",
      "`bind` фиксирует и `this`, и первые аргументы — частичное применение.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const user = {
  name: "Аня",
  hi() {
    return this ? this.name : "потерян";
  },
};
function run(callback) {
  return callback();
}
console.log(run(user.hi));
console.log(run(() => user.hi()));
console.log(run(user.hi.bind(user)));`,
      opts: ["потерян\nАня\nАня", "Аня\nАня\nАня", "потерян\nпотерян\nАня", "потерян\nАня\nпотерян"],
      a: 0,
      why: "`run` вызывает колбэк простым вызовом: `this` — `undefined`. Обёртка вызывает `user.hi()` как метод, а `bind` привязал `user` заранее.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function greet(greeting, name) {
  return greeting + ", " + name + this.mark;
}
const polite = greet.bind({ mark: "!" }, "Здравствуйте");
console.log(polite("Аня"));
console.log(polite.call({ mark: "?" }, "Борис"));`,
      opts: ["Здравствуйте, Аня!\nЗдравствуйте, Борис!", "Здравствуйте, Аня!\nЗдравствуйте, Борис?", "Аня, Здравствуйте!\nБорис, Здравствуйте!", "Здравствуйте, Аня!\nБорис, undefined?"],
      a: 0,
      why: "`bind` зафиксировал `this` и первый аргумент. Вызов `polite(\"Аня\")` дописывает второй аргумент. `call` не может перебить привязанный `this`.",
    },
    {
      type: "quiz",
      q: "Какой вариант НЕ исправит потерю контекста при передаче `user.hi` в чужую функцию?",
      opts: ["`const hi = user.hi` и передать `hi`", "`() => user.hi()`", "`user.hi.bind(user)`", "`function () { return user.hi(); }`"],
      a: 0,
      why: "Сохранение в переменную — та же потеря: достаётся функция без объекта. Остальные варианты вызывают метод на `user` явно или через привязку.",
    },
    {
      type: "run",
      goal: "Напиши `myBind(fn, ctx, ...preset)` — свою версию `bind`: возвращает функцию, которая вызывает `fn` с `this = ctx` и аргументами `preset`, а за ними — аргументами вызова. Встроенный `bind` использовать нельзя.",
      code: `function myBind(fn, ctx, ...preset) {
  return fn;
}`,
      tests: [
        ["myBind(function () { return this.name; }, { name: \"Аня\" })()", "\"Аня\""],
        ["(() => { function f(a, b) { return this.x + a + b; } return myBind(f, { x: 5 }, 1)(2); })()", "8"],
        ["(() => { function f(...args) { return args; } return myBind(f, null, 1, 2)(3, 4); })()", "[1,2,3,4]"],
      ],
      solution: `function myBind(fn, ctx, ...preset) {
  return function (...args) {
    return fn.apply(ctx, [...preset, ...args]);
  };
}`,
      hint: "Верни новую функцию, которая собирает свои аргументы через `...args` и вызывает `fn.apply(ctx, [...preset, ...args])` или `fn.call(ctx, ...preset, ...args)`.",
      forbid: [{ re: "\\.bind\\(", msg: "Без встроенного `bind`" }],
    },
  ],
};
