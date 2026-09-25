import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc8",
  region: 9,
  title: "EventEmitter",
  q: "Напиши `EventEmitter` с методами `on`, `off`, `once` и `emit`.",
  answer:
    "Храним подписчиков в `Map`: имя события → массив обработчиков. `on` добавляет обработчик и удобно возвращает функцию отписки. `off` удаляет обработчик по ссылке. `emit` вызывает всех подписчиков события с аргументами — перебирая копию массива, потому что обработчик может отписаться посреди перебора. `once` оборачивает обработчик так, что обёртка сначала отписывается, а потом вызывает оригинал. `emit` без подписчиков ничего не делает и не падает.",
  theory: {
    p: [
      "EventEmitter — паттерн «издатель — подписчик»: одни части кода подписываются на событие по имени, другие его публикуют, и они ничего не знают друг о друге. Так устроены `EventEmitter` в Node.js, шины событий, подписки в сторах состояния.",
      "Хранилище — `Map` из имени события в массив обработчиков. `on(name, fn)` добавляет в массив, создав его при первой подписке. Возвращать из `on` функцию отписки — удобный современный стиль: не нужно хранить ссылку на обработчик отдельно. `off(name, fn)` фильтрует массив по ссылке.",
      "Две ловушки. Первая: если обработчик внутри `emit` отпишется, массив изменится посреди перебора, и следующий обработчик пропустится — поэтому перебирают копию `[...handlers]`. Вторая — `once`: обёртка должна отписать саму себя, а не исходный обработчик, ведь в массиве лежит обёртка.",
    ],
    code: `class MiniEmitter {
  #handlers = new Map();
  on(name, fn) {
    if (!this.#handlers.has(name)) this.#handlers.set(name, []);
    this.#handlers.get(name).push(fn);
  }
  emit(name, ...args) {
    for (const fn of this.#handlers.get(name) ?? []) fn(...args);
  }
}

const bus = new MiniEmitter();
bus.on("login", (user) => console.log("привет,", user));
bus.on("login", (user) => console.log("лог: вошёл", user));
bus.emit("login", "Аня");
bus.emit("logout");                        // подписчиков нет — ничего не падает`,
    keys: [
      "`Map`: имя события → массив обработчиков. `on` возвращает функцию отписки.",
      "`emit` перебирает копию массива: обработчик может отписаться посреди перебора.",
      "`once` — обёртка, которая отписывает саму себя и вызывает оригинал.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Допиши класс `EventEmitter`: `on(name, fn)` подписывает и возвращает функцию отписки, `off(name, fn)` отписывает, `once(name, fn)` подписывает на один раз, `emit(name, ...args)` вызывает подписчиков.",
      code: `class EventEmitter {
  on(name, fn) {}
  off(name, fn) {}
  once(name, fn) {}
  emit(name, ...args) {}
}`,
      tests: [
        ["(() => { const e = new EventEmitter(); const log = []; e.on(\"a\", (x) => log.push(x)); e.emit(\"a\", 1); e.emit(\"a\", 2); return log; })()", "[1,2]"],
        ["(() => { const e = new EventEmitter(); const log = []; const h = (x) => log.push(x); e.on(\"a\", h); e.off(\"a\", h); e.emit(\"a\", 1); return log; })()", "[]"],
        ["(() => { const e = new EventEmitter(); let n = 0; e.once(\"a\", () => n++); e.emit(\"a\"); e.emit(\"a\"); return n; })()", "1"],
        ["(() => { const e = new EventEmitter(); let n = 0; const off = e.on(\"a\", () => n++); off(); e.emit(\"a\"); return n; })()", "0"],
        ["(() => { const e = new EventEmitter(); const log = []; e.once(\"a\", () => log.push(1)); e.on(\"a\", () => log.push(2)); e.emit(\"a\"); return log; })()", "[1,2]"],
      ],
      solution: `class EventEmitter {
  #handlers = new Map();
  on(name, fn) {
    if (!this.#handlers.has(name)) this.#handlers.set(name, []);
    this.#handlers.get(name).push(fn);
    return () => this.off(name, fn);
  }
  off(name, fn) {
    const list = this.#handlers.get(name);
    if (list) this.#handlers.set(name, list.filter((h) => h !== fn));
  }
  once(name, fn) {
    const wrapper = (...args) => {
      this.off(name, wrapper);
      fn(...args);
    };
    return this.on(name, wrapper);
  }
  emit(name, ...args) {
    for (const fn of [...(this.#handlers.get(name) ?? [])]) fn(...args);
  }
}`,
      hint: "Храни `Map` имён в массивы. В `once` создай обёртку, которая вызывает `this.off(name, обёртка)` и затем `fn`. В `emit` перебирай копию массива — последний тест проверяет именно это.",
    },
    {
      type: "quiz",
      q: "Зачем в `emit` перебирать копию массива обработчиков?",
      opts: [
        "Обработчик может отписаться во время перебора, и без копии следующий обработчик пропустится",
        "Чтобы обработчики выполнялись параллельно",
        "Копия нужна только для `off`",
        "Чтобы обработчики вызывались в обратном порядке",
      ],
      a: 0,
      why: "`once` отписывается прямо во время `emit`. Если фильтр или `splice` изменит перебираемый массив, соседний обработчик можно потерять.",
    },
  ],
};
