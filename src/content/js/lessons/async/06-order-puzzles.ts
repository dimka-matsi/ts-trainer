import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "asy6",
  region: 5,
  level: "middle",
  title: "Разбор: задачи на порядок вывода",
  q: "Что выведет код, где смешаны `setTimeout`, промисы и `async/await`? Как рассуждать?",
  answer:
    "Иду в три прохода. Сначала выполняю весь синхронный код сверху вниз, не забывая, что исполнитель `new Promise` и тело `async` функции до первого `await` — тоже синхронные. По ходу раскладываю колбэки: таймеры — в очередь макрозадач, `then` и продолжения после `await` — в очередь микрозадач. Потом выполняю все микрозадачи по порядку, добавляя новые в конец. И только потом беру макрозадачи по одной, и после каждой снова опустошаю микрозадачи.",
  theory: {
    p: [
      "Задачи «что выведет» проверяют одно: знаешь ли ты, что синхронно, что микрозадача, а что макрозадача. Синхронно: обычный код, исполнитель `new Promise`, тело `async` функции до первого `await`. Микрозадачи: `then`, `catch`, `finally`, `queueMicrotask`, продолжение после `await`. Макрозадачи: `setTimeout`, `setInterval`, события.",
      "Рассуждай с двумя списками на бумаге. Идёшь по коду: синхронное сразу пишешь в вывод, колбэки дописываешь в конец своей очереди. Кончился код — выполняешь микрозадачи по одной, и если микрозадача ставит новые, они идут в конец той же очереди. Опустела очередь микрозадач — берёшь первую макрозадачу и повторяешь.",
      "Цепочки `then` продвигаются по одному шагу за раз. Следующий `then` в цепочке встаёт в очередь, только когда выполнился предыдущий. Поэтому две параллельные цепочки чередуются: первый шаг первой, первый шаг второй, второй шаг первой и так далее.",
      "`await` уже готового значения или промиса занимает одну микрозадачу: продолжение функции встаёт в очередь, а не выполняется сразу. Раньше движки тратили на `await` промиса три микрозадачи, и в старых статьях порядок бывает другим. Верь только тому, что покажет запуск — здесь любой пример можно выполнить.",
    ],
    code: `async function a1() {
  console.log("2: a1 start");
  await a2();
  console.log("6: a1 end");       // продолжение после await — микрозадача
}
async function a2() {
  console.log("3: a2");
}

console.log("1: script start");
setTimeout(() => console.log("8: timeout"), 0);
a1();
new Promise((resolve) => {
  console.log("4: исполнитель");  // синхронно
  resolve();
}).then(() => console.log("7: then"));
console.log("5: script end");`,
    keys: [
      "Синхронно: обычный код, исполнитель `new Promise`, тело `async` функции до первого `await`.",
      "Микрозадачи: `then`, `catch`, `finally`, `queueMicrotask`, продолжение после `await`. Выполняются все, до следующей макрозадачи.",
      "Цепочки `then` продвигаются по шагу и чередуются. После каждой макрозадачи снова опустошается очередь микрозадач.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `async function a1() {
  console.log("a1 start");
  await a2();
  console.log("a1 end");
}
async function a2() {
  console.log("a2");
}
console.log("script start");
setTimeout(() => console.log("timeout"), 0);
a1();
new Promise((resolve) => {
  console.log("p1");
  resolve();
}).then(() => console.log("p2"));
console.log("script end");`,
      opts: [
        "script start\na1 start\na2\np1\nscript end\na1 end\np2\ntimeout",
        "script start\na1 start\na2\np1\nscript end\np2\na1 end\ntimeout",
        "script start\na1 start\na1 end\na2\np1\np2\nscript end\ntimeout",
        "script start\nscript end\na1 start\na2\np1\na1 end\np2\ntimeout",
      ],
      a: 0,
      why: "Синхронно: `script start`, тело `a1` до `await` вместе с вызовом `a2`, исполнитель промиса `p1`, `script end`. Продолжение `a1` встало в очередь микрозадач раньше, чем `then`, поэтому `a1 end` перед `p2`. Таймер — последним.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2));
Promise.resolve()
  .then(() => console.log(3))
  .then(() => console.log(4));`,
      opts: ["1\n3\n2\n4", "1\n2\n3\n4", "3\n4\n1\n2", "1\n3\n4\n2"],
      a: 0,
      why: "Второй `then` в цепочке встаёт в очередь только после выполнения первого. Сначала в очереди `1` и `3`; выполнился `1` — добавился `2`; выполнился `3` — добавился `4`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `setTimeout(() => console.log("A"), 0);
Promise.resolve().then(() => {
  console.log("B");
  setTimeout(() => console.log("C"), 0);
  queueMicrotask(() => console.log("D"));
});
(async () => {
  console.log("E");
  await undefined;
  console.log("F");
})();
console.log("G");`,
      opts: ["E\nG\nB\nF\nD\nA\nC", "E\nG\nB\nD\nF\nA\nC", "G\nE\nB\nF\nD\nA\nC", "E\nG\nF\nB\nD\nC\nA"],
      a: 0,
      why: "Синхронно: `E` (тело до `await`) и `G`. В очереди микрозадач: `B`, затем продолжение `F`. `B` добавляет `D` в конец — после `F`. Таймер `A` поставлен раньше, чем `C`.",
    },
    {
      type: "order",
      q: "Расставь шаги, по которым решают задачу «что выведет».",
      items: [
        "выполнить весь синхронный код, включая исполнитель промиса и начало `async` функций",
        "разложить колбэки по очередям: таймеры — в макрозадачи, `then` и `await` — в микрозадачи",
        "выполнить все микрозадачи, добавляя новые в конец",
        "взять одну макрозадачу и снова опустошить микрозадачи",
      ],
      why: "Раскладка по очередям идёт одновременно с первым шагом, но проще думать о ней отдельно.",
    },
  ],
};
