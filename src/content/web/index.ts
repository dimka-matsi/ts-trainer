import type { Flashcard } from "../flashcards";
import { lesson as w1 } from "./lessons/01-listeners";
import { lesson as w2 } from "./lessons/02-propagation";
import { lesson as w3 } from "./lessons/03-delegation";
import { lesson as w4 } from "./lessons/04-default-actions";
import { lesson as w5 } from "./lessons/05-custom-events";
import { lesson as w6 } from "./lessons/06-removing";
import { lesson as w7 } from "./lessons/07-focus-input";
import type { WebLesson, WebRegion } from "./types";

/** Уроки раздела «Браузер» в порядке прохождения. */
export const WEB_LESSONS: WebLesson[] = [w1, w2, w3, w4, w5, w6, w7];
export const WEB_LESSON_BY_ID: Record<string, WebLesson> = Object.fromEntries(WEB_LESSONS.map((l) => [l.id, l]));

/** Регионы «Браузера»: как вкладка Network, строка за строкой. */
export const WEB_REGIONS: WebRegion[] = [
  { name: "События DOM", kind: "lessons", desc: "Обработчики, всплытие и погружение, делегирование, действия по умолчанию, свои события." },
  { name: "Event loop", kind: "soon", desc: "Стек вызовов, макро- и микрозадачи, таймеры, `requestAnimationFrame`.", topics: [
    { t: "Стек, очередь задач и микрозадачи", q: "Что выведет код с `setTimeout`, `Promise.then` и `console.log`, и почему?" },
    { t: "async/await и порядок выполнения", q: "Где продолжится функция после `await` и в какой очереди?" },
    { t: "Таймеры", q: "Почему `setTimeout(fn, 0)` не выполняется сразу?" },
    { t: "requestAnimationFrame", q: "Чем `requestAnimationFrame` лучше `setTimeout` для анимации?" },
  ] },
  { name: "HTTP", kind: "soon", desc: "Методы, коды ответа, заголовки, версии протокола.", topics: [
    { t: "Методы и идемпотентность", q: "Чем GET отличается от POST и какие методы идемпотентны?" },
    { t: "Коды ответа", q: "Чем 401 отличается от 403, а 301 от 302?" },
    { t: "Заголовки", q: "Какие заголовки запроса и ответа ты знаешь и зачем `Content-Type`?" },
    { t: "HTTP/1.1, HTTP/2, HTTP/3", q: "Что изменилось в HTTP/2 и HTTP/3?" },
  ] },
  { name: "Кэширование", kind: "soon", desc: "`Cache-Control`, валидация, 304, кэш сервис-воркера.", topics: [
    { t: "Cache-Control", q: "Чем `no-cache` отличается от `no-store`?" },
    { t: "ETag и 304", q: "Как браузер проверяет, изменился ли файл?" },
    { t: "Стратегии для статики", q: "Как кэшировать бандлы, чтобы пользователи получали новую версию?" },
  ] },
  { name: "CORS и cookies", kind: "soon", desc: "Политика одного источника, preflight, cookies и их флаги.", topics: [
    { t: "Same-origin policy", q: "Что такое origin и что запрещает политика одного источника?" },
    { t: "CORS и preflight", q: "Когда браузер отправляет preflight-запрос OPTIONS?" },
    { t: "Cookies: SameSite, HttpOnly, Secure", q: "Зачем флаги `HttpOnly`, `Secure` и `SameSite`?" },
    { t: "credentials в fetch", q: "Почему `fetch` не отправляет cookies на другой домен и как это включить?" },
  ] },
  { name: "Хранилища", kind: "soon", desc: "localStorage, sessionStorage, IndexedDB, cookies.", topics: [
    { t: "localStorage и sessionStorage", q: "Чем `localStorage` отличается от `sessionStorage` и от cookies?" },
    { t: "IndexedDB", q: "Когда нужен IndexedDB вместо localStorage?" },
    { t: "Событие storage", q: "Как синхронизировать данные между вкладками?" },
  ] },
  { name: "Безопасность", kind: "soon", desc: "XSS, CSRF, CSP, clickjacking.", topics: [
    { t: "XSS", q: "Что такое XSS и почему `innerHTML` опасен?" },
    { t: "CSRF", q: "Что такое CSRF и как от него защищает `SameSite`?" },
    { t: "Content Security Policy", q: "Что делает заголовок CSP?" },
    { t: "Clickjacking", q: "Как запретить показывать сайт в чужом iframe?" },
  ] },
  { name: "Рендеринг", kind: "soon", desc: "Путь от HTML до пикселей, reflow и repaint, слои.", topics: [
    { t: "Critical rendering path", q: "Что происходит от получения HTML до первого кадра?" },
    { t: "Reflow и repaint", q: "Что вызывает перерасчёт раскладки и как его избежать?" },
    { t: "Скрипты: async и defer", q: "Чем `async` отличается от `defer`?" },
    { t: "Композитные слои", q: "Почему анимировать `transform` дешевле, чем `top`?" },
  ] },
  { name: "Производительность", kind: "soon", desc: "Core Web Vitals, ленивая загрузка, подсказки браузеру.", topics: [
    { t: "Core Web Vitals", q: "Что измеряют LCP, INP и CLS?" },
    { t: "Ленивая загрузка", q: "Как отложить загрузку картинок и кода?" },
    { t: "preload, prefetch, preconnect", q: "Чем отличаются `preload`, `prefetch` и `preconnect`?" },
  ] },
  { name: "Сеть", kind: "soon", desc: "Что происходит, когда вводишь адрес: DNS, TCP, TLS.", topics: [
    { t: "Что происходит после ввода URL", q: "Расскажи по шагам, что происходит после ввода адреса в браузере." },
    { t: "DNS", q: "Как браузер находит IP-адрес по имени сайта?" },
    { t: "TLS и HTTPS", q: "Как устанавливается защищённое соединение?" },
  ] },
  { name: "Web API", kind: "soon", desc: "fetch, AbortController, WebSocket, воркеры, наблюдатели.", topics: [
    { t: "fetch и AbortController", q: "Как отменить запрос `fetch`?" },
    { t: "WebSocket и Server-Sent Events", q: "Чем WebSocket отличается от SSE и long polling?" },
    { t: "Web Worker и Service Worker", q: "Чем Web Worker отличается от Service Worker?" },
    { t: "IntersectionObserver", q: "Как узнать, что элемент появился на экране, без обработчика scroll?" },
  ] },
];

/** Ключ экзамена региона в общем прогрессе: у TypeScript ключи 0…10, у «Браузера» 100 и дальше. */
export const WEB_EXAM_KEY = (region: number) => 100 + region;

/** Флеш-карточки «Браузера»: вопросы уроков и дополнительные. id начинаются с `w-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "w-event-phases", region: 0, level: "junior",
    q: "Какие три фазы проходит событие?",
    a: "Погружение: от `window` вниз до элемента. Фаза цели: на самом элементе. Всплытие: обратно вверх до `window`. Номер фазы лежит в `event.eventPhase`.",
    code: `document.body.addEventListener("click", (e) => console.log("погружение, фаза", e.eventPhase), { capture: true });
document.body.addEventListener("click", (e) => console.log("всплытие, фаза", e.eventPhase));
document.body.click(); // для самого body обе записи — фаза цели, 2`,
  },
  {
    id: "w-this-handler", region: 0, level: "junior",
    q: "Чему равен `this` внутри обработчика события?",
    a: "В обычной функции `this` равен `event.currentTarget`, то есть элементу с обработчиком. У стрелочной функции своего `this` нет, она берёт его снаружи. Поэтому надёжнее читать `event.currentTarget`.",
    code: `const b = document.createElement("button");
b.id = "b";
b.addEventListener("click", function () { console.log(this.id); });   // b
b.addEventListener("click", (e) => console.log(e.currentTarget.id)); // b
b.click();`,
  },
  {
    id: "w-not-bubbling", region: 0, level: "middle",
    q: "Какие события не всплывают и как быть с делегированием?",
    a: "Не всплывают `focus`, `blur`, `mouseenter`, `mouseleave`, `load` у картинок. Для фокуса есть всплывающие пары `focusin` и `focusout`, вместо `mouseenter` можно взять `mouseover`. Другой вариант — повесить обработчик с `{ capture: true }`: на погружении событие проходит через родителей.",
    code: `const form = document.createElement("form");
form.innerHTML = '<input id="x">';
document.body.append(form);
form.addEventListener("focus", () => console.log("focus с capture"), { capture: true });
form.querySelector("input").focus(); // focus с capture`,
  },
  {
    id: "w-passive", region: 0, level: "middle",
    q: "Зачем обработчику опция `passive: true`?",
    a: "Она обещает браузеру не вызывать `preventDefault`. Для `touchstart` и `wheel` браузер тогда начинает прокрутку сразу, не дожидаясь обработчика, и страница не подтормаживает. `preventDefault` в пассивном обработчике игнорируется.",
    code: `window.addEventListener("wheel", () => {
  // только читаем, прокрутку не отменяем
  console.log("колесо");
}, { passive: true });`,
  },
];

export const WEB_FLASHCARDS: Flashcard[] = [
  ...WEB_LESSONS.map((l): Flashcard => ({
    id: `w-lesson-${l.id}`,
    region: l.region,
    level: "junior",
    q: l.q,
    a: l.answer,
    code: l.theory.example,
  })),
  ...EXTRA_CARDS,
];
