import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa5",
  region: 7,
  title: "Web Workers и Service Workers",
  q: "Что такое Web Worker? Чем он отличается от Service Worker? Как передаются данные между потоками?",
  answer:
    "Web Worker — скрипт в отдельном потоке со своим event loop. Он нужен для тяжёлых вычислений, чтобы не замораживать страницу. Доступа к DOM у него нет, общается он с основным потоком сообщениями `postMessage`, и данные при этом копируются алгоритмом структурного клонирования — как в `structuredClone`. Большие буферы можно не копировать, а передать владение. Service Worker — особый воркер-посредник между страницей и сетью: он перехватывает запросы, кэширует ответы для работы без сети и принимает push-уведомления.",
  theory: {
    p: [
      "Основной поток один, и он же рисует страницу. Тяжёлое вычисление — разбор большого файла, обработка изображения, сложный расчёт — замораживает интерфейс. Web Worker запускает скрипт в отдельном потоке: `new Worker(\"worker.js\", { type: \"module\" })`. У воркера свой глобальный объект, свой event loop, свои таймеры и `fetch`, но нет DOM, `window` и `localStorage`. Этот тренажёр выполняет твой код именно в воркере, поэтому бесконечный цикл не вешает страницу — воркер просто останавливают.",
      "Общение — сообщениями. `worker.postMessage(data)` отправляет, `worker.onmessage` получает; внутри воркера — `self.postMessage` и `self.onmessage`. Данные копируются структурным клонированием: объекты, массивы, даты, `Map` — да, функции и DOM-узлы — нет. Изменения копии в воркере не видны основному потоку. Большой `ArrayBuffer` можно передать без копирования, списком transfer: `postMessage(buffer, [buffer])` — после этого он пуст в отправителе.",
      "Общая память — `SharedArrayBuffer` и `Atomics` — доступна, только если страница изолирована заголовками COOP и COEP: так браузеры защищаются от атак через точные таймеры. Для большинства задач хватает сообщений. Воркер останавливают `worker.terminate()` снаружи или `self.close()` изнутри.",
      "Service Worker — другое. Он регистрируется для сайта, живёт отдельно от вкладок и стоит между страницей и сетью: событие `fetch` позволяет ответить из кэша, и сайт работает без сети. Ещё он принимает push-уведомления и фоновую синхронизацию. Браузер запускает его по событию и усыпляет, поэтому держать в нём состояние в переменных нельзя. Для вычислений он не предназначен — для этого Web Worker.",
    ],
    code: `// main.js
const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
worker.onmessage = (event) => console.log("результат:", event.data);
worker.postMessage({ numbers: [5, 3, 8] }); // объект скопируется

const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);      // передача владения без копии
console.log(buffer.byteLength);            // 0 — буфер ушёл в воркер

// worker.js
self.onmessage = (event) => {
  const sum = event.data.numbers.reduce((a, b) => a + b, 0); // тяжёлая работа
  self.postMessage(sum);
};

// регистрация Service Worker для работы без сети
navigator.serviceWorker.register("/sw.js");`,
    flow: {
      actors: ["Основной поток", "Web Worker", "Service Worker", "Сеть"],
      steps: [
        { from: 0, to: 1, label: "postMessage(данные) — копия структурным клонированием" },
        { from: 1, to: 0, label: "postMessage(результат)", note: "интерфейс всё это время отвечал" },
        { from: 0, to: 2, label: "fetch(\"/app.js\") перехвачен Service Worker" },
        { from: 2, to: 3, label: "в кэше нет — идём в сеть и кладём ответ в кэш" },
      ],
    },
    keys: [
      "Web Worker — отдельный поток для тяжёлой работы. Нет DOM, `window` и `localStorage`, есть `fetch` и таймеры.",
      "Общение через `postMessage`: данные копируются структурным клонированием, буферы можно передать без копии.",
      "Service Worker — посредник между страницей и сетью: кэш и работа без сети, push. Для вычислений — Web Worker.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "`postMessage` копирует данные тем же способом, что `structuredClone`. Что выведет этот код?",
      code: `const data = { list: [1, 2], when: new Date(0), tags: new Set(["a"]) };
const copy = structuredClone(data);
copy.list.push(3);
console.log(data.list.length, copy.list.length);
console.log(copy.when instanceof Date, copy.tags.has("a"));`,
      opts: ["2 3\ntrue true", "3 3\ntrue true", "2 3\nfalse false", "2 3\ntrue false"],
      a: 0,
      why: "Копия глубокая и независимая. Структурное клонирование сохраняет даты и `Set` — в отличие от `JSON`.",
    },
    {
      type: "sort",
      q: "Что доступно внутри Web Worker?",
      groups: ["доступно", "недоступно"],
      items: [
        ["`fetch`", 0],
        ["`setTimeout`", 0],
        ["IndexedDB", 0],
        ["`postMessage`", 0],
        ["`document` и DOM", 1],
        ["`localStorage`", 1],
        ["`window`", 1],
      ],
      why: "У воркера нет страницы, поэтому нет DOM и `window`. `localStorage` синхронный и привязан к странице, а асинхронная IndexedDB работает.",
    },
    {
      type: "quiz",
      q: "Страница зависает на 2 секунды при разборе большого файла. Что поможет?",
      opts: ["Перенести разбор в Web Worker и получить результат через `postMessage`", "Service Worker", "Обернуть разбор в `async` функцию", "Вызвать разбор через `setTimeout(fn, 0)`"],
      a: 0,
      why: "`async` и `setTimeout` не делают код параллельным — он всё равно выполнится в основном потоке одним куском. Service Worker для вычислений не предназначен.",
    },
    {
      type: "match",
      q: "Сопоставь технологию и её задачу.",
      pairs: [
        ["Web Worker", "тяжёлые вычисления вне основного потока"],
        ["Service Worker", "кэш и работа сайта без сети"],
        ["`SharedArrayBuffer`", "общая память потоков при изоляции COOP и COEP"],
        ["transfer в `postMessage`", "передать большой буфер без копирования"],
      ],
      why: "По умолчанию потоки ничего не делят и обмениваются копиями. Общая память — особый режим с требованиями к заголовкам.",
    },
  ],
};
