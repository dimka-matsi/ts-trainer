import type { Flashcard } from "../flashcards";
import { makeCourse, type WebLesson, type WebRegion } from "../course/types";
import { lessons as arrays } from "./lessons/arrays";
import { lessons as async } from "./lessons/async";
import { lessons as dom } from "./lessons/dom";
import { lessons as functions } from "./lessons/functions";
import { lessons as live } from "./lessons/live";
import { lessons as modules } from "./lessons/modules";
import { lessons as objects } from "./lessons/objects";
import { lessons as scope } from "./lessons/scope";
import { lessons as values } from "./lessons/values";
import { lessons as webapi } from "./lessons/webapi";

/**
 * «JavaScript»: язык и работа со страницей. Порядок: значения и типы → области видимости и замыкания → функции и `this` →
 * объекты и прототипы → массивы и коллекции → асинхронность → DOM и события → Web API → модули и современный JS →
 * задачи live coding. Код заданий выполняется по-настоящему: в браузере — в воркере, в verify — в Node.
 */
const REGION_LESSONS: WebLesson[][] = [values, scope, functions, objects, arrays, async, dom, webapi, modules, live];

const REGIONS: WebRegion[] = [
  { name: "Типы и значения", kind: "lessons", desc: "Восемь типов и `typeof`, примитивы и ссылки, приведение типов, `==` и `===`, числа и `0.1 + 0.2`, копирование объектов, строки и Unicode, `Symbol`." },
  { name: "Области видимости и замыкания", kind: "lessons", desc: "`var`, `let` и `const`, поднятие и TDZ, лексическое окружение, замыкания и задача про цикл с `setTimeout`." },
  { name: "Функции и this", kind: "lessons", desc: "Виды функций, правила `this`, стрелочные функции, `call`, `apply` и `bind`, потеря контекста, каррирование, рекурсия." },
  { name: "Объекты и прототипы", kind: "lessons", desc: "Свойства и ключи, прототипы и цепочка, что делает `new`, классы, дескрипторы и заморозка объектов, `Proxy` и `Reflect`, приведение объектов к примитивам." },
  { name: "Массивы и коллекции", kind: "lessons", desc: "Методы перебора, мутирующие и новые немутирующие методы, деструктуризация, `Map` и `Set`, итераторы и генераторы, `Intl`, регулярные выражения." },
  { name: "Асинхронность и event loop", kind: "lessons", desc: "Стек вызовов и event loop, промисы, микро- и макрозадачи, `async`/`await`, комбинаторы промисов, асинхронные генераторы, колбэки и промисификация." },
  { name: "DOM и события", kind: "lessons", desc: "Дерево DOM и поиск элементов, всплытие и погружение, делегирование, опции `addEventListener`, загрузка страницы, Web Components, формы, размеры и координаты." },
  { name: "Web API", kind: "lessons", desc: "`fetch` и отмена запросов, хранилища, таймеры и `requestAnimationFrame`, observers, Web Workers, URL и History API." },
  { name: "Модули и современный JS", kind: "lessons", desc: "ES-модули и CommonJS, строгий режим, обработка ошибок, новые возможности ES2020–ES2025, даты и Temporal." },
  { name: "Live coding", kind: "lessons", desc: "Задачи, которые пишут на собеседовании: debounce, throttle, deepClone, deepEqual, flatten, memoize, Promise.all, EventEmitter, curry, retry, пул промисов, LRU-кэш, get по пути и свой Promise." },
];

/** Дополнительные карточки: частые вопросы собеседований, которые не стали отдельным уроком. id начинаются с `js-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "js-null-undefined", region: 0, level: "junior",
    q: "Чем `null` отличается от `undefined`?",
    a: "`undefined` — значение «не задано»: его получает объявленная без значения переменная, отсутствующее свойство, пропущенный аргумент и функция без `return`. `null` — явное «значения нет», его ставит программист. `null == undefined` истинно, а `===` — ложно. `typeof undefined` — `\"undefined\"`, а `typeof null` — `\"object\"` по старой ошибке языка.",
  },
  {
    id: "js-typeof-instanceof", region: 3, level: "junior",
    q: "Чем `typeof` отличается от `instanceof`?",
    a: "`typeof` возвращает строку с типом значения и хорошо работает для примитивов и функций. `instanceof` проверяет, есть ли `F.prototype` в цепочке прототипов объекта, — это про объекты и классы. `instanceof` ломается между окнами и iframe: у них разные `Array`, поэтому массивы проверяют через `Array.isArray`. Для примитивов `instanceof` всегда `false`: `\"a\" instanceof String` — ложь.",
  },
  {
    id: "js-array-like", region: 4, level: "junior",
    q: "Что такое псевдомассив и как превратить его в массив?",
    a: "Псевдомассив — объект с числовыми ключами и `length`, но без методов массива: `arguments`, `NodeList` из старых методов, строки. Превращают через `Array.from(obj)` или spread `[...obj]` — spread работает только для итерируемых объектов. `Array.from` принимает вторым аргументом функцию преобразования: `Array.from({ length: 3 }, (_, i) => i)` даёт `[0, 1, 2]`.",
  },
  {
    id: "js-gc", region: 4, level: "middle",
    q: "Как работает сборщик мусора в JavaScript?",
    a: "Память освобождается автоматически по достижимости: объект жив, пока до него можно дойти по ссылкам от корней — глобальных переменных, стека вызовов, активных замыканий. Базовый алгоритм — mark-and-sweep: пометить всё достижимое и удалить остальное. Движки делят кучу на поколения: молодые объекты собираются часто и быстро, пережившие — реже. Циклические ссылки не мешают сборке, если весь цикл недостижим.",
  },
  {
    id: "js-node-event-loop", region: 5, level: "senior",
    q: "Чем event loop в Node.js отличается от браузерного?",
    a: "В Node.js event loop построен на libuv и идёт по фазам: таймеры, отложенные колбэки ввода-вывода, опрос ввода-вывода, `setImmediate`, закрытие ресурсов. Между колбэками выполняются очередь `process.nextTick` и затем микрозадачи промисов — `nextTick` раньше. Отрисовки нет. Порядок `setTimeout(fn, 0)` и `setImmediate` в основном скрипте не определён, а внутри колбэка ввода-вывода `setImmediate` всегда раньше.",
  },
  {
    id: "js-memory-leaks", region: 7, level: "middle",
    q: "Какие бывают утечки памяти во фронтенде и как их найти?",
    a: "Типичные утечки: забытые таймеры и `setInterval`, обработчики событий на `window` и `document`, которые не сняли при уходе со страницы или размонтировании, отсоединённые элементы DOM, на которые осталась ссылка, растущие кэши и массивы без ограничения, замыкания, держащие большие данные. Находят во вкладке Memory в DevTools: снимки кучи до и после действия и поиск объектов, которые должны были исчезнуть. Лечат очисткой в эффектах, `AbortController` для обработчиков и `WeakMap` для кэшей.",
  },
];

export const JS = makeCourse("js", "JavaScript", REGIONS, REGION_LESSONS, EXTRA_CARDS, "jsc", 500, { withCode: true, runnable: true });
