import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "asy7",
  region: 5,
  level: "senior",
  title: "Асинхронные генераторы и for await",
  q: "Что такое асинхронный итератор и `for await...of`? Когда они нужны?",
  answer:
    "Асинхронный итератор — объект, у которого `next()` возвращает промис с `{ value, done }`. Его проще всего сделать асинхронным генератором `async function*`: внутри можно и `await`, и `yield`. Перебирают его циклом `for await...of`, который дожидается каждого элемента по очереди. Это удобно для данных, которые приходят частями: постраничная загрузка API, чтение потока данных по кускам, строки большого файла в Node.js. Такой перебор ленивый — следующая страница запрашивается, только когда цикл до неё дошёл.",
  theory: {
    p: [
      "Обычный итератор отдаёт значения синхронно. Асинхронный — по промису на каждый шаг: `next()` возвращает промис `{ value, done }`. Объект асинхронно-итерируемый, если у него есть метод `Symbol.asyncIterator`. Встроенные примеры — поток `ReadableStream` в браузере и потоки в Node.js.",
      "`async function*` — асинхронный генератор. В нём работают `await` и `yield`: можно подождать запрос и отдать результат. Вызов возвращает асинхронный итератор, тело выполняется по шагам, когда потребитель просит следующее значение.",
      "`for await (const item of source)` ждёт каждое значение по очереди. Он работает и с обычными итерируемыми объектами, где лежат промисы: `for await (const x of [p1, p2])` дождётся каждого по порядку. Выход из цикла через `break` или `return` вызывает `return()` у итератора — генератор может закрыть соединение в `finally`.",
      "Главное свойство — ленивость и порционность. Постраничный API: генератор запрашивает страницу, отдаёт её элементы и запрашивает следующую, только когда цикл их обработал. Можно остановиться в любой момент, не загрузив лишнего. В ES2024 появился `Array.fromAsync(source)` — собрать всё в массив.",
    ],
    code: `const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function* pages() {             // имитация постраничного API
  for (let page = 1; page <= 3; page++) {
    await wait(10);                    // здесь был бы запрос
    console.log("загружена страница", page);
    yield [page * 10, page * 10 + 1];
  }
}

async function main() {
  for await (const items of pages()) {
    console.log("обрабатываем", items);
    if (items[0] === 20) break;        // третью страницу не грузим
  }
  console.log("все:", await Array.fromAsync(pages()));
}
main();`,
    keys: [
      "Асинхронный итератор: `next()` возвращает промис `{ value, done }`. Проще всего — `async function*`.",
      "`for await...of` ждёт каждое значение по очереди, `break` закрывает генератор.",
      "Ленивая загрузка частями: страницы API, потоки. `Array.fromAsync` собирает всё в массив.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `async function* gen() {
  console.log("старт");
  yield 1;
  console.log("после 1");
  yield 2;
  console.log("конец");
}
(async () => {
  const it = gen();
  console.log("создан");
  for await (const x of it) {
    console.log("получили", x);
    if (x === 1) break;
  }
  console.log("вышли");
})();`,
      opts: ["создан\nстарт\nполучили 1\nвышли", "старт\nсоздан\nполучили 1\nвышли", "создан\nстарт\nполучили 1\nпосле 1\nвышли", "создан\nстарт\nполучили 1\nпосле 1\nполучили 2\nконец\nвышли"],
      a: 0,
      why: "Вызов генератора не выполняет тело — `старт` печатается при первом `next()`. После `break` генератор закрывается и до `после 1` не доходит.",
    },
    {
      type: "quiz",
      q: "Чем `for await (const page of pages())` лучше, чем сначала загрузить все страницы, а потом обработать?",
      opts: [
        "Страницы грузятся по мере обработки, и можно остановиться, не загрузив лишнего",
        "Все страницы загружаются параллельно",
        "Он работает без сети",
        "Он быстрее на синхронных данных",
      ],
      a: 0,
      why: "Генератор ленивый: следующая страница запрашивается, только когда цикл попросил новое значение. Параллельности тут нет — это последовательная загрузка.",
    },
    {
      type: "run",
      goal: "Напиши `take(source, n)`: собирает в массив первые `n` значений асинхронно-итерируемого `source` и прекращает перебор.",
      code: `async function take(source, n) {
  const result = [];
  for await (const item of source) {
    result.push(item);
    if (result.length > n) break;
  }
  return result;
}`,
      tests: [
        ["(async () => { async function* nums() { let i = 0; while (true) yield i++; } return take(nums(), 3); })()", "[0,1,2]"],
        ["(async () => { async function* two() { yield \"a\"; yield \"b\"; } return take(two(), 5); })()", "[\"a\",\"b\"]"],
        ["(async () => { let closed = false; async function* g() { try { yield 1; yield 2; yield 3; } finally { closed = true; } } await take(g(), 1); return closed; })()", "true"],
      ],
      solution: `async function take(source, n) {
  const result = [];
  if (n <= 0) return result;
  for await (const item of source) {
    result.push(item);
    if (result.length >= n) break;
  }
  return result;
}`,
      hint: "Внутри `for await` после добавления проверь, набралось ли `n`, и выйди через `break` — он заодно закроет генератор.",
    },
  ],
};
