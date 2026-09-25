import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "arr5",
  region: 4,
  title: "for...of, итераторы и генераторы",
  q: "Чем `for...in` отличается от `for...of`? Что такое итератор и генератор?",
  answer:
    "`for...in` перебирает ключи объекта строками, включая унаследованные перечисляемые, — он для объектов. `for...of` перебирает значения итерируемых объектов: массивов, строк, `Map` и `Set`. Итерируемый объект имеет метод `Symbol.iterator`, который возвращает итератор — объект с методом `next()`, отдающим `{ value, done }`. Генератор — функция со звёздочкой `function*`: она возвращает итератор и останавливается на каждом `yield`, поэтому значения считаются лениво, по запросу.",
  theory: {
    p: [
      "`for (const key in obj)` перебирает имена свойств — всегда строки, в том числе унаследованные перечисляемые. Для массивов он не подходит: даст индексы строками и лишние свойства. `for (const value of iterable)` перебирает значения и работает только с итерируемыми объектами. Обычный объект не итерируемый: `for...of` по нему бросит `TypeError`, перебирают `Object.entries(obj)`.",
      "Протокол итерации. Объект итерируемый, если у него есть метод с ключом `Symbol.iterator`, возвращающий итератор. Итератор — объект с методом `next()`, который каждый раз отдаёт `{ value, done }`; когда `done: true`, перебор окончен. На этом протоколе работают `for...of`, spread, деструктуризация массивов, `Array.from`, `new Map(entries)`.",
      "Генератор пишется как `function*`. Его вызов не выполняет тело, а возвращает итератор. Каждый `next()` выполняет код до следующего `yield` и отдаёт его значение. Значение из `return` приходит с `done: true`, поэтому `for...of` и spread его не видят. Генератор ленивый: можно описать бесконечную последовательность и брать из неё сколько нужно.",
      "В ES2025 у итераторов появились методы-помощники: `iterator.map()`, `filter()`, `take(n)`, `drop(n)`, `toArray()`. Они тоже ленивые: `naturals().filter(isEven).take(3).toArray()` обработает ровно столько элементов, сколько нужно.",
    ],
    code: `const arr = ["a", "b"];
arr.extra = "x";
for (const i in arr) console.log("in:", i);  // ключи строками + лишнее
for (const v of arr) console.log("of:", v);  // только значения

function* naturals() {                       // бесконечный и ленивый
  let n = 1;
  while (true) yield n++;
}
const it = naturals();
console.log(it.next(), it.next().value);     // { value: 1, done: false } 2

const firstEven = naturals().filter((n) => n % 2 === 0).take(3).toArray();
console.log(firstEven);                      // [2, 4, 6]

const range = {                              // свой итерируемый объект
  from: 1,
  to: 3,
  *[Symbol.iterator]() {
    for (let i = this.from; i <= this.to; i++) yield i;
  },
};
console.log([...range]);`,
    keys: [
      "`for...in` — ключи объекта строками, включая унаследованные. `for...of` — значения итерируемых: массивов, строк, `Map`, `Set`.",
      "Итерируемый объект имеет `Symbol.iterator`, итератор — метод `next()` с `{ value, done }`. На этом работают spread и деструктуризация.",
      "Генератор `function*` возвращает итератор и останавливается на `yield`. Значения ленивые, `return` не попадает в `for...of`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const arr = ["a", "b"];
arr.extra = "x";
for (const i in arr) console.log(i);
for (const v of arr) console.log(v);`,
      opts: ["0\n1\nextra\na\nb", "a\nb\nx\na\nb", "0\n1\na\nb", "0\n1\nextra\na\nb\nx"],
      a: 0,
      why: "`for...in` перебирает все перечисляемые ключи, включая добавленное свойство `extra`. `for...of` идёт по итератору массива и отдаёт только элементы.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function* count() {
  yield 1;
  yield 2;
  return 3;
}
const it = count();
console.log(it.next().value);
console.log([...count()]);
console.log(it.next());
console.log(it.next().done);`,
      opts: ["1\n[1, 2]\n{ value: 2, done: false }\ntrue", "1\n[1, 2, 3]\n{ value: 2, done: false }\nfalse", "1\n[1, 2]\n{ value: 1, done: false }\ntrue", "1\n[]\n{ value: 2, done: true }\ntrue"],
      a: 0,
      why: "У каждого вызова `count()` свой итератор. Spread собирает значения до `done: true`, а `3` из `return` приходит уже с `done: true` и в массив не попадает. Третий `next()` у `it` отдаёт `3` и `done: true`.",
    },
    {
      type: "quiz",
      q: "Почему `for (const x of { a: 1 })` бросает `TypeError`?",
      opts: [
        "У обычного объекта нет метода `Symbol.iterator`",
        "У объекта нет свойства `length`",
        "`for...of` работает только с числами",
        "Нужно писать `for...of` через `let`",
      ],
      a: 0,
      why: "Объект не итерируемый. Перебор значений — `for (const [k, v] of Object.entries(obj))`.",
    },
    {
      type: "run",
      goal: "Напиши генератор `range(start, end, step = 1)`: отдаёт числа от `start` до `end`, не включая `end`, с шагом `step`. Он должен быть ленивым и работать с `end = Infinity`.",
      code: `function* range(start, end, step = 1) {
  yield start;
}`,
      tests: [
        ["[...range(0, 3)]", "[0,1,2]"],
        ["[...range(1, 10, 3)]", "[1,4,7]"],
        ["(() => { const it = range(5, Infinity); it.next(); it.next(); return it.next().value; })()", "7"],
        ["[...range(3, 3)]", "[]"],
      ],
      solution: `function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) yield i;
}`,
      hint: "Цикл `for` от `start`, пока `i < end`, с шагом `step`, и на каждом шаге `yield i`. Массив собирать не нужно — генератор сам отдаёт значения по одному.",
    },
  ],
};
