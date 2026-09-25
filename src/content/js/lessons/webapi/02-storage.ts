import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa2",
  region: 7,
  level: "junior",
  title: "localStorage, sessionStorage, cookies и IndexedDB",
  q: "Чем отличаются `localStorage`, `sessionStorage`, cookies и IndexedDB? Что где хранить?",
  answer:
    "`localStorage` хранит строки около 5 МБ на источник без срока давности, общий для всех вкладок сайта. `sessionStorage` — то же, но живёт в одной вкладке: переживает перезагрузку и исчезает при закрытии вкладки. Cookies маленькие, около 4 КБ, и уходят на сервер с каждым запросом — они для сессии, причём cookie с `HttpOnly` из JavaScript не видна. IndexedDB — асинхронная база в браузере для больших объёмов и объектов. Оба Storage синхронны и хранят только строки, поэтому объекты сохраняют через `JSON.stringify`.",
  theory: {
    p: [
      "`localStorage` и `sessionStorage` — простое хранилище «ключ — строка». Методы `setItem`, `getItem` (вернёт `null`, если ключа нет), `removeItem`, `clear`. Любое значение превращается в строку: объект станет `\"[object Object]\"`, поэтому пишут `JSON.stringify` и читают `JSON.parse`. Объём — около 5 МБ на источник. API синхронный: большие записи блокируют основной поток.",
      "Разница в сроке жизни и видимости. `localStorage` живёт, пока его не очистят, и общий для всех вкладок одного источника; когда одна вкладка меняет его, другие получают событие `storage`. `sessionStorage` принадлежит вкладке: переживает перезагрузку, но не открытие сайта в новой вкладке и закрытие.",
      "Cookies придуманы для сервера: браузер отправляет их с каждым запросом на сайт, лимит около 4 КБ на cookie. Из JavaScript они видны через `document.cookie` одной строкой, кроме cookie с флагом `HttpOnly` — её не прочитать скриптом, поэтому идентификатор сессии хранят именно так. Токены в `localStorage` доступны любому скрипту на странице, и при XSS их украдут.",
      "IndexedDB — асинхронная база данных в браузере: хранит объекты, файлы, большие объёмы (от сотен мегабайт), поддерживает индексы и транзакции. Её API неудобный, поэтому берут обёртки вроде `idb`. Она доступна и из фоновых потоков, в отличие от `localStorage`. Для кэша ответов сети есть ещё Cache API.",
    ],
    code: `localStorage.setItem("theme", "dark");
localStorage.setItem("user", { name: "Аня" });   // сохранится "[object Object]"
localStorage.setItem("user", JSON.stringify({ name: "Аня" }));
const user = JSON.parse(localStorage.getItem("user") ?? "null");

sessionStorage.setItem("draft", "черновик формы"); // только в этой вкладке

// другие вкладки узнают об изменении localStorage
window.addEventListener("storage", (event) => {
  console.log(event.key, event.oldValue, "→", event.newValue);
});

console.log(document.cookie); // "theme=dark; lang=ru" — без HttpOnly-cookie`,
    flow: {
      actors: ["Вкладка A", "localStorage сайта", "Вкладка B", "Сервер"],
      steps: [
        { from: 0, to: 1, label: "setItem(\"theme\", \"dark\")" },
        { from: 1, to: 2, label: "событие storage во вкладке B", note: "в самой вкладке A события нет" },
        { from: 0, to: 3, label: "запрос: cookies уходят с ним автоматически" },
        { from: 3, to: 0, label: "Set-Cookie: session=…; HttpOnly — скрипт её не увидит" },
      ],
    },
    keys: [
      "`localStorage` — навсегда и на все вкладки, `sessionStorage` — на вкладку. Только строки, около 5 МБ, синхронно.",
      "Cookies уходят на сервер с каждым запросом, около 4 КБ. `HttpOnly` скрывает cookie от JavaScript — так хранят сессию.",
      "IndexedDB — асинхронная база для больших объёмов и объектов, доступна и из фоновых потоков.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что вернёт `localStorage.getItem(\"user\")` после `localStorage.setItem(\"user\", { name: \"Аня\" })`?",
      opts: ["Строку `\"[object Object]\"`", "Объект `{ name: \"Аня\" }`", "Строку `'{\"name\":\"Аня\"}'`", "`null`"],
      a: 0,
      why: "Storage хранит только строки и приводит значение через `String()`. Объекты сохраняют через `JSON.stringify`.",
    },
    {
      type: "sort",
      q: "Где хранить эти данные?",
      groups: ["`localStorage`", "`sessionStorage`", "cookie с `HttpOnly`", "IndexedDB"],
      items: [
        ["выбранная тема оформления", 0],
        ["черновик формы только в этой вкладке", 1],
        ["идентификатор сессии пользователя", 2],
        ["50 МБ писем для работы без сети", 3],
      ],
      why: "Сессия — в `HttpOnly`-cookie, чтобы её не украл скрипт. Большие данные — в IndexedDB, потому что Storage мал и синхронен.",
    },
    {
      type: "match",
      q: "Сопоставь хранилище и его свойство.",
      pairs: [
        ["`localStorage`", "общий для вкладок и живёт, пока не очистят"],
        ["`sessionStorage`", "исчезает при закрытии вкладки"],
        ["cookie", "уходит на сервер с каждым запросом"],
        ["IndexedDB", "асинхронная база с транзакциями"],
      ],
      why: "Выбирают по сроку жизни, объёму и тому, нужен ли доступ серверу.",
    },
    {
      type: "quiz",
      q: "Где сработает событие `storage` после `localStorage.setItem` во вкладке A?",
      opts: ["В других вкладках того же сайта, но не в самой вкладке A", "Только во вкладке A", "Во всех вкладках браузера", "Нигде, это событие для `sessionStorage`"],
      a: 0,
      why: "Событие нужно, чтобы синхронизировать вкладки: вкладка, которая записала, и так знает об изменении.",
    },
  ],
};
