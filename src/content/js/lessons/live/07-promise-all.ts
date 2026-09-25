import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc7",
  region: 9,
  level: "senior",
  title: "Promise.all своими руками",
  q: "Напиши свою версию `Promise.all`.",
  answer:
    "Возвращаем `new Promise`. Заводим массив результатов и счётчик выполненных. Для каждого элемента по индексу вызываем `Promise.resolve(item)` — так обычные значения тоже работают — и в `then` кладём результат на его место в массиве, а не в конец, чтобы сохранить порядок. Когда счётчик дошёл до длины — `resolve(results)`. Первая ошибка сразу вызывает `reject`: промис меняет состояние один раз, поэтому остальные ответы уже ничего не изменят. Пустой массив — сразу `resolve([])`.",
  theory: {
    p: [
      "Требования к `Promise.all`: результат — промис; значения в том же порядке, что и вход, независимо от того, кто закончил раньше; на входе могут быть и не-промисы; первая ошибка отклоняет результат; пустой вход сразу даёт пустой массив.",
      "Порядок держим индексом: `results[i] = value`, а не `push`. Готовность — отдельным счётчиком, потому что массив с дырками по длине не поймёшь. `Promise.resolve(item)` превращает любое значение в промис и не трогает настоящий промис. Первая ошибка — прямо `reject`: повторные `resolve` и `reject` промис игнорирует, поэтому отдельный флаг не нужен.",
      "Проще начать с `Promise.race` — его логика в одну строку: каждый элемент подписывает `resolve` и `reject` общего промиса, кто первый — тот и победил. `allSettled` пишется как `all`, но вместо `reject` записывает `{ status: \"rejected\", reason }` и тоже увеличивает счётчик.",
    ],
    code: `function promiseRace(items) {
  return new Promise((resolve, reject) => {
    for (const item of items) {
      Promise.resolve(item).then(resolve, reject); // первый завершившийся решает всё
    }
  });
}

const wait = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms));
promiseRace([wait(30, "медленный"), wait(10, "быстрый")])
  .then((v) => console.log("race:", v));`,
    keys: [
      "Порядок — по индексу `results[i]`, готовность — по счётчику, а не по `push` и длине.",
      "`Promise.resolve(item)` поддерживает обычные значения. Первая ошибка — сразу `reject`.",
      "Пустой вход — сразу `resolve([])`. `race` — подписать всех на общий `resolve` и `reject`.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `promiseAll(items)` — то же, что `Promise.all`: значения в исходном порядке, обычные значения тоже поддерживаются, первая ошибка отклоняет результат, пустой массив даёт `[]`. Встроенный `Promise.all` не использовать.",
      code: `function promiseAll(items) {
  return Promise.resolve([]);
}`,
      tests: [
        ["promiseAll([sleep(30).then(() => 1), 2, Promise.resolve(3)])", "[1,2,3]"],
        ["promiseAll([sleep(30).then(() => \"a\"), sleep(5).then(() => \"b\")])", "[\"a\",\"b\"]"],
        ["promiseAll([Promise.reject(new Error(\"x\")), sleep(50)]).catch((e) => e.message)", "\"x\""],
        ["promiseAll([])", "[]"],
      ],
      solution: `function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (items.length === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;
        done++;
        if (done === items.length) resolve(results);
      }, reject);
    });
  });
}`,
      hint: "Внутри `new Promise`: массив результатов, счётчик и цикл по элементам с индексом. `Promise.resolve(item).then(value => { results[i] = value; ... }, reject)`. Не забудь пустой массив.",
      forbid: [{ re: "Promise\\.all\\b", msg: "Без встроенного `Promise.all`" }],
    },
    {
      type: "quiz",
      q: "Почему результат кладут как `results[i] = value`, а не `results.push(value)`?",
      opts: [
        "Промисы завершаются в любом порядке, а результат должен идти в порядке входа",
        "`push` не работает внутри `then`",
        "`push` медленнее",
        "Чтобы массив был заморожен",
      ],
      a: 0,
      why: "С `push` быстрый второй промис оказался бы первым. По той же причине готовность считают счётчиком: у массива с дыркой длина уже большая.",
    },
  ],
};
