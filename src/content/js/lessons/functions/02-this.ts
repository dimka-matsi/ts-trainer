import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "fun2",
  region: 2,
  title: "Как определяется this",
  q: "Как определяется `this` в JavaScript? Чем отличаются `call`, `apply` и `bind`?",
  answer:
    "У обычной функции `this` определяется в момент вызова, а не объявления. Вызов как метода `obj.f()` — `this` равен `obj`. Простой вызов `f()` — `undefined` в строгом режиме и глобальный объект без него. Вызов через `new` — новый объект. `call` и `apply` вызывают функцию сразу с заданным `this`, разница в аргументах: у `call` — списком, у `apply` — массивом. `bind` не вызывает, а возвращает новую функцию с навсегда привязанным `this`.",
  theory: {
    p: [
      "`this` — это объект, с которым работает функция. У обычных функций он не привязан к месту объявления: одна и та же функция в разных вызовах получает разный `this`. Решает то, как её вызвали. Правил четыре.",
      "Первое — вызов как метода: `user.hi()`. Объект перед точкой становится `this`. Второе — простой вызов `hi()` без объекта перед точкой: в строгом режиме `this` равен `undefined`, а в старом нестрогом режиме — глобальному объекту (`window` в браузере). Весь код курса строгий, как в модулях. Третье — вызов через `new`: `this` — только что созданный объект, это разберём в регионе про объекты.",
      "Четвёртое — явная привязка. `f.call(obj, a, b)` вызывает `f` сразу, с `this = obj` и аргументами списком. `f.apply(obj, [a, b])` — то же, но аргументы массивом. `f.bind(obj)` ничего не вызывает, а возвращает новую функцию, у которой `this` навсегда равен `obj`. Такую функцию уже не перепривязать: повторный `bind`, `call` и вызов как метода её `this` не меняют.",
      "Приоритет правил: `new` сильнее всех, дальше `bind`, затем `call` и `apply`, затем вызов как метода, и последним — простой вызов. На собеседовании часто дают метод, сохранённый в переменную: `const hi = user.hi; hi()` — это уже простой вызов, и `this` теряется.",
    ],
    code: `const user = {
  name: "Аня",
  hi() {
    return this ? this.name : "this = " + this;
  },
};
console.log(user.hi());        // метод: this = user

const hi = user.hi;
console.log(hi());             // простой вызов: this = undefined

const admin = { name: "Борис" };
console.log(user.hi.call(admin));     // явно: this = admin
console.log(user.hi.apply(admin, [])); // то же, аргументы массивом

const bound = user.hi.bind(admin);
console.log(bound());                  // Борис
console.log(bound.call({ name: "Вера" })); // bind не перебить: Борис`,
    keys: [
      "`this` определяется при вызове: метод — объект перед точкой, простой вызов — `undefined` в строгом режиме, `new` — новый объект.",
      "`call` и `apply` вызывают сразу с заданным `this` (аргументы списком или массивом), `bind` возвращает новую функцию.",
      "Привязку `bind` не перебить. Метод, сохранённый в переменную, теряет `this`.",
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
    return this.name;
  },
};
const hi = user.hi;
console.log(user.hi());
try {
  console.log(hi());
} catch (e) {
  console.log(e.name);
}`,
      opts: ["Аня\nTypeError", "Аня\nАня", "Аня\nundefined", "undefined\nTypeError"],
      a: 0,
      why: "`hi()` — простой вызов, в строгом режиме `this` равен `undefined`. Чтение `undefined.name` бросает `TypeError`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function show() {
  return this.label;
}
const a = { label: "A" };
const b = { label: "B" };
const bound = show.bind(a);
console.log(show.call(b));
console.log(bound());
console.log(bound.call(b));
const c = { label: "C", bound };
console.log(c.bound());`,
      opts: ["B\nA\nA\nA", "B\nA\nB\nC", "B\nA\nA\nC", "A\nA\nB\nC"],
      a: 0,
      why: "`call(b)` задаёт `this = b`. `bind(a)` навсегда привязал `a`: ни `call`, ни вызов как метода `c.bound()` это не меняют.",
    },
    {
      type: "match",
      q: "Сопоставь вызов и чему равен `this` внутри обычной функции (строгий режим).",
      pairs: [
        ["`user.hi()`", "`user`"],
        ["`hi()`", "`undefined`"],
        ["`hi.call(admin)`", "`admin`"],
        ["`new Hi()`", "новый объект"],
      ],
      why: "Обычная функция получает `this` в момент вызова, и форма вызова решает всё.",
    },
    {
      type: "quiz",
      q: "Чем `bind` отличается от `call`?",
      opts: [
        "`bind` возвращает новую функцию с привязанным `this`, а `call` сразу вызывает функцию",
        "`bind` передаёт аргументы массивом, а `call` — списком",
        "`call` работает только со стрелочными функциями",
        "Ничем, это синонимы",
      ],
      a: 0,
      why: "Массивом передаёт аргументы `apply`. `bind` нужен, когда функцию вызовет кто-то другой позже — например, обработчик или таймер.",
    },
  ],
};
