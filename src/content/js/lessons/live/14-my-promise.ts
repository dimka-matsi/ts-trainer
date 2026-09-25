import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc14",
  region: 9,
  title: "Свой Promise",
  q: "Напиши упрощённую реализацию `Promise` с `then` и `catch`.",
  answer:
    "Промис — состояние (`pending`, `fulfilled`, `rejected`), значение и список отложенных обработчиков. `resolve` и `reject` переводят состояние один раз и запускают обработчики. Если в `resolve` пришёл другой промис или объект с `then`, его нужно дождаться. `then` всегда возвращает новый промис: обработчик вызывается асинхронно, микрозадачей; его результат выполняет новый промис, а исключение отклоняет. Если обработчика для этого исхода нет, результат просто передаётся дальше — так ошибка долетает до `catch`. Ошибка в исполнителе тоже отклоняет промис.",
  theory: {
    p: [
      "Требования, которые проверяют: состояние меняется один раз; `then` возвращает новый промис; обработчики вызываются асинхронно, даже если промис уже выполнен; результат обработчика выполняет следующий промис, брошенная ошибка — отклоняет; отсутствующий обработчик пропускает значение или ошибку дальше; если в `resolve` передали промис или объект с `then`, он «принимается» — цепочка ждёт его результат.",
      "Асинхронность. По стандарту обработчики `then` — микрозадачи. В своей реализации их ставят через `queueMicrotask`. Если вызвать обработчик синхронно, порядок вывода будет не таким, как у настоящего промиса: `then` сработает раньше кода после него.",
      "Хранение. Пока промис в ожидании, обработчики копятся в массиве. Когда состояние установилось — каждый ставится в очередь микрозадач. Если промис уже выполнен в момент вызова `then`, обработчик ставится в очередь сразу. Этот каркас — половина стандарта Promises/A+; остальное — детали вроде защиты от промиса, который разрешается сам собой.",
    ],
    code: `// каркас: состояние, значение, обработчики
class Box {
  #state = "pending";
  #value;
  #handlers = [];

  settle(state, value) {
    if (this.#state !== "pending") return;   // только один раз
    this.#state = state;
    this.#value = value;
    for (const handler of this.#handlers) queueMicrotask(handler);
  }
  onSettled(handler) {
    if (this.#state === "pending") this.#handlers.push(handler);
    else queueMicrotask(handler);
  }
  get state() { return this.#state; }
}

const box = new Box();
box.onSettled(() => console.log("обработчик:", box.state));
box.settle("fulfilled", 1);
box.settle("rejected", 2);                   // проигнорировано
console.log("синхронный код раньше");`,
    keys: [
      "Состояние меняется один раз, обработчики копятся в ожидании и запускаются микрозадачами.",
      "`then` возвращает новый промис: результат обработчика выполняет его, исключение отклоняет, нет обработчика — значение идёт дальше.",
      "`resolve` с промисом или объектом с `then` дожидается его. Ошибка в исполнителе отклоняет промис.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Допиши класс `MyPromise(executor)` с методами `then(onFulfilled, onRejected)` и `catch(onRejected)`. Обработчики — асинхронные, `then` возвращает новый `MyPromise`, промис из обработчика дожидается. Встроенный `Promise` использовать нельзя.",
      code: `class MyPromise {
  #value;
  constructor(executor) {
    executor((value) => {
      this.#value = value;
    }, () => {});
  }
  then(onFulfilled) {
    return new MyPromise((resolve) => resolve(onFulfilled(this.#value)));
  }
  catch() {
    return this;
  }
}`,
      tests: [
        ["new MyPromise((r) => r(1)).then((x) => x + 1).then((x) => x * 10)", "20"],
        ["new MyPromise((_, reject) => reject(new Error(\"x\"))).then(() => 1).catch((e) => e.message)", "\"x\""],
        ["(() => { const log = []; new MyPromise((r) => r()).then(() => log.push(\"then\")); log.push(\"sync\"); return new MyPromise((r) => setTimeout(() => r(log), 0)); })()", "[\"sync\",\"then\"]"],
        ["new MyPromise((r) => r(1)).then((x) => new MyPromise((r) => setTimeout(() => r(x + 5), 10)))", "6"],
        ["new MyPromise(() => { throw new Error(\"boom\"); }).catch((e) => e.message)", "\"boom\""],
      ],
      solution: `class MyPromise {
  #state = "pending";
  #value;
  #handlers = [];

  constructor(executor) {
    let locked = false;
    const adopt = (value) => {
      if (value !== null && (typeof value === "object" || typeof value === "function") && typeof value.then === "function") {
        value.then(adopt, (reason) => this.#settle("rejected", reason));
      } else {
        this.#settle("fulfilled", value);
      }
    };
    const resolve = (value) => {
      if (locked) return;
      locked = true;
      adopt(value);
    };
    const reject = (reason) => {
      if (locked) return;
      locked = true;
      this.#settle("rejected", reason);
    };
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  #settle(state, value) {
    if (this.#state !== "pending") return;
    this.#state = state;
    this.#value = value;
    for (const handler of this.#handlers) queueMicrotask(handler);
    this.#handlers = [];
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const run = () => {
        const ok = this.#state === "fulfilled";
        const callback = ok ? onFulfilled : onRejected;
        if (typeof callback !== "function") {
          (ok ? resolve : reject)(this.#value);
          return;
        }
        try {
          resolve(callback(this.#value));
        } catch (e) {
          reject(e);
        }
      };
      if (this.#state === "pending") this.#handlers.push(run);
      else queueMicrotask(run);
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}`,
      hint: "Храни состояние, значение и массив обработчиков. `then` создаёт новый `MyPromise` и кладёт функцию `run`, которая вызывает нужный обработчик и передаёт результат в `resolve` нового промиса. Запускай `run` через `queueMicrotask`. В `resolve` проверь, нет ли у значения метода `then`.",
      forbid: [{ re: "\\bPromise\\b", msg: "Без встроенного `Promise`" }],
    },
    {
      type: "quiz",
      q: "Что сломается, если в своём промисе вызывать обработчик `then` синхронно, когда промис уже выполнен?",
      opts: [
        "Порядок: обработчик сработает раньше кода, который стоит после `then`, в отличие от настоящего промиса",
        "Ничего, это только быстрее",
        "Ошибки перестанут ловиться",
        "Цепочки `then` перестанут работать",
      ],
      a: 0,
      why: "Стандарт требует, чтобы обработчики были асинхронными всегда. Иначе код ведёт себя по-разному в зависимости от того, успел ли промис выполниться, — это трудно отлаживать.",
    },
  ],
};
