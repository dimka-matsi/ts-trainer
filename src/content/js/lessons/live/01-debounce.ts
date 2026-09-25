import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc1",
  region: 9,
  title: "debounce",
  q: "Напиши `debounce(fn, ms)`. Где его применяют и чем он отличается от throttle?",
  answer:
    "`debounce` откладывает вызов, пока вызовы не прекратятся на `ms` миллисекунд: каждый новый вызов сбрасывает таймер, и функция выполнится один раз — с последними аргументами. Применяют там, где важен итог серии: поиск по мере ввода, сохранение черновика, пересчёт после изменения размера окна. Реализация — замыкание с id таймера: `clearTimeout` и новый `setTimeout` на каждый вызов, а `this` и аргументы передаются через `fn.apply`. Throttle, наоборот, не ждёт тишины, а пропускает не чаще одного вызова за интервал.",
  theory: {
    p: [
      "Пользователь печатает «javascript» — это десять событий `input`. Отправлять десять запросов незачем: нужен один, когда он закончит печатать. `debounce(fn, 300)` возвращает обёртку: каждый её вызов отменяет запланированный запуск и планирует новый через 300 мс. Пока вызовы идут чаще, чем раз в 300 мс, функция не выполняется вовсе; после паузы — выполняется один раз с последними аргументами.",
      "Внутри — замыкание с переменной `timer`. Обёртку пишут обычной функцией, а не стрелкой, чтобы получить `this` вызова, и передают его дальше вместе с аргументами: `fn.apply(this, args)`. Иначе метод объекта, обёрнутый в `debounce`, потеряет контекст.",
      "Частые дополнения на собеседовании: `cancel()` — отменить запланированный вызов, например при размонтировании компонента; `flush()` — выполнить немедленно; режим `leading` — выполнить на первом вызове, а потом молчать до паузы. Отличие от throttle: debounce ждёт тишины и срабатывает в конце серии, throttle срабатывает регулярно во время серии.",
    ],
    code: `function debounce(fn, ms) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);                  // сбрасываем прошлый отсчёт
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

const search = debounce((query) => console.log("ищем:", query), 30);
search("j");
search("ja");
search("jav");                            // только этот вызов дойдёт
setTimeout(() => search("javascript"), 60); // после паузы — новый вызов`,
    keys: [
      "`debounce` выполняет функцию один раз после паузы в вызовах, с последними аргументами.",
      "Реализация: замыкание с `timer`, `clearTimeout` и новый `setTimeout` на каждый вызов, `fn.apply(this, args)`.",
      "Для поиска при вводе и сохранения черновика — debounce. Дополнения: `cancel`, `flush`, `leading`.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `debounce(fn, ms)` с методом `cancel()`: обёртка вызывает `fn` через `ms` после последнего вызова, с его аргументами и `this`, а `cancel()` отменяет запланированный вызов.",
      code: `function debounce(fn, ms) {
  return fn;
}`,
      tests: [
        ["(async () => { const log = []; const f = debounce((x) => log.push(x), 30); f(1); f(2); f(3); await sleep(70); return log; })()", "[3]"],
        ["(async () => { let n = 0; const f = debounce(() => n++, 20); f(); await sleep(50); f(); await sleep(50); return n; })()", "2"],
        ["(async () => { let n = 0; const f = debounce(() => n++, 20); f(); f.cancel(); await sleep(50); return n; })()", "0"],
        ["(async () => { let who; const obj = { name: \"Аня\", f: debounce(function () { who = this.name; }, 10) }; obj.f(); await sleep(40); return who; })()", "\"Аня\""],
      ],
      solution: `function debounce(fn, ms) {
  let timer = null;
  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, args);
    }, ms);
  }
  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return debounced;
}`,
      hint: "Храни id таймера в замыкании. Обёртка — обычная функция: она сбрасывает таймер и ставит новый со стрелкой внутри, чтобы `this` сохранился. `cancel` — свойство функции-обёртки, которое вызывает `clearTimeout`.",
    },
    {
      type: "quiz",
      q: "Что выбрать для поиска с подсказками по мере ввода, чтобы запрос уходил, когда пользователь перестал печатать?",
      opts: ["debounce", "throttle", "`setInterval`", "`requestAnimationFrame`"],
      a: 0,
      why: "Нужен итог серии нажатий — это debounce. Throttle отправлял бы запросы регулярно прямо во время ввода.",
    },
  ],
};
