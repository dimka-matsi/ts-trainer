import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "fun3",
  region: 2,
  level: "junior",
  title: "Стрелочные функции",
  q: "Чем стрелочная функция отличается от обычной?",
  answer:
    "У стрелочной функции нет своего `this`: она берёт `this` из окружения, где создана, и `call`, `apply` или `bind` его не меняют. У неё нет `arguments`, и её нельзя вызвать через `new`. Поэтому стрелки удобны для колбэков внутри методов — они видят `this` метода. А вот как методы объекта их не используют: `this` у такого метода будет внешним, а не объектом.",
  theory: {
    p: [
      "Стрелочная функция — короткая запись: `(a, b) => a + b`. Если тело — одно выражение, оно возвращается без `return`. Чтобы вернуть объект, его оборачивают в скобки: `() => ({ ok: true })`, иначе фигурные скобки прочитаются как тело функции.",
      "Главное отличие — `this`. У стрелки нет своего `this`: она берёт его снаружи, как обычную переменную из замыкания. Какой `this` был там, где стрелку создали, такой она и видит — навсегда. `call`, `apply` и `bind` на стрелку не влияют. На верхнем уровне модуля `this` равен `undefined`.",
      "Отсюда главный приём: колбэк внутри метода пишут стрелкой, чтобы он видел `this` метода. `[1, 2, 3].forEach(() => this.count++)` внутри метода меняет счётчик объекта. Обычная функция на месте стрелки получила бы `this = undefined` при простом вызове.",
      "Когда стрелка не подходит. Метод объекта `{ hi: () => this.name }` видит внешний `this`, а не объект. Стрелку нельзя вызвать через `new` — будет `TypeError`. У неё нет `arguments` — нужен rest-параметр `...args`.",
    ],
    code: `const counter = {
  count: 0,
  start() {
    [1, 2, 3].forEach(() => {
      this.count++; // this взят из start, то есть counter
    });
    return this.count;
  },
};
console.log(counter.start()); // 3

const user = {
  name: "Аня",
  regular() { return this.name; },
  arrow: () => typeof this, // this снаружи объекта — undefined
};
console.log(user.regular(), user.arrow());

const make = () => ({ ok: true }); // объект в скобках
console.log(make().ok);

try {
  new make();
} catch (e) {
  console.log(e.name); // стрелку нельзя вызвать через new
}`,
    keys: [
      "У стрелки нет своего `this` — он берётся снаружи, из места создания. `call`, `apply` и `bind` его не меняют.",
      "Стрелки — для колбэков внутри методов. Для методов объекта они не подходят.",
      "У стрелки нет `arguments`, её нельзя вызвать через `new`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const user = {
  name: "Аня",
  regular() {
    return typeof this;
  },
  arrow: () => typeof this,
  later() {
    const inner = () => this.name;
    return inner();
  },
};
console.log(user.regular());
console.log(user.arrow());
console.log(user.later());`,
      opts: ["object\nundefined\nАня", "object\nobject\nАня", "object\nundefined\nundefined", "undefined\nundefined\nАня"],
      a: 0,
      why: "`regular` вызван как метод — `this` это `user`. `arrow` создана на верхнем уровне, где `this` — `undefined`. `inner` создана внутри метода и берёт его `this`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const getName = () => this;
const obj = { name: "Аня" };
console.log(getName.call(obj));
const bound = getName.bind(obj);
console.log(bound());`,
      opts: ["undefined\nundefined", "{ name: \"Аня\" }\n{ name: \"Аня\" }", "undefined\n{ name: \"Аня\" }", "{ name: \"Аня\" }\nundefined"],
      a: 0,
      why: "`this` стрелки задан местом создания — верхним уровнем, где он `undefined`. Ни `call`, ни `bind` его не меняют.",
    },
    {
      type: "sort",
      q: "Что есть у обычной функции, что у стрелочной, а что у обеих?",
      groups: ["только обычная", "только стрелочная", "обе"],
      items: [
        ["свой `this`, который зависит от вызова", 0],
        ["можно вызвать через `new`", 0],
        ["есть объект `arguments`", 0],
        ["`this` всегда берётся из места создания", 1],
        ["можно передать аргументом в другую функцию", 2],
        ["замыкает переменные внешней области", 2],
      ],
      why: "Обе — функции и замыкания. Отличия стрелки: нет своего `this` и `arguments`, нельзя `new`.",
    },
    {
      type: "quiz",
      q: "Почему метод объекта не пишут стрелкой `{ hi: () => this.name }`?",
      opts: [
        "`this` стрелки — внешний, а не объект, поэтому `this.name` не будет именем объекта",
        "Стрелку нельзя положить в свойство объекта",
        "Стрелка выполняется сразу при создании объекта",
        "Стрелка не может вернуть строку",
      ],
      a: 0,
      why: "Стрелка берёт `this` из места, где создан объектный литерал, — обычно это верхний уровень. Для методов нужна обычная функция или короткая запись `hi() {}`.",
    },
  ],
};
