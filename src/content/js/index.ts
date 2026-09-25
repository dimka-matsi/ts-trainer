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
  { name: "Типы и значения", kind: "lessons", desc: "Восемь типов и `typeof`, примитивы и ссылки, приведение типов, `==` и `===`, числа и `0.1 + 0.2`, копирование объектов." },
  { name: "Области видимости и замыкания", kind: "lessons", desc: "`var`, `let` и `const`, поднятие и TDZ, лексическое окружение, замыкания и задача про цикл с `setTimeout`." },
  { name: "Функции и this", kind: "lessons", desc: "Виды функций, правила `this`, стрелочные функции, `call`, `apply` и `bind`, потеря контекста, каррирование." },
  { name: "Объекты и прототипы", kind: "lessons", desc: "Свойства и ключи, прототипы и цепочка, что делает `new`, классы, дескрипторы и заморозка объектов." },
  { name: "Массивы и коллекции", kind: "lessons", desc: "Методы перебора, мутирующие и новые немутирующие методы, деструктуризация, `Map` и `Set`, итераторы и генераторы." },
  { name: "Асинхронность и event loop", kind: "lessons", desc: "Стек вызовов и event loop, промисы, микро- и макрозадачи, `async`/`await`, комбинаторы промисов." },
  { name: "DOM и события", kind: "lessons", desc: "Дерево DOM и поиск элементов, всплытие и погружение, делегирование, опции `addEventListener`, загрузка страницы." },
  { name: "Web API", kind: "lessons", desc: "`fetch` и отмена запросов, хранилища, таймеры и `requestAnimationFrame`, observers, Web Workers." },
  { name: "Модули и современный JS", kind: "lessons", desc: "ES-модули и CommonJS, строгий режим, обработка ошибок, новые возможности ES2020–ES2025." },
  { name: "Live coding", kind: "lessons", desc: "Задачи, которые пишут на собеседовании: debounce, throttle, deepClone, deepEqual, flatten, memoize, Promise.all, EventEmitter, curry, retry и пул промисов." },
];

/** Дополнительные карточки: частые вопросы собеседований, которые не стали отдельным уроком. id начинаются с `js-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "js-null-undefined", region: 0, level: "junior",
    q: "Чем `null` отличается от `undefined`?",
    a: "`undefined` — значение «не задано»: его получает объявленная без значения переменная, отсутствующее свойство, пропущенный аргумент и функция без `return`. `null` — явное «значения нет», его ставит программист. `null == undefined` истинно, а `===` — ложно. `typeof undefined` — `\"undefined\"`, а `typeof null` — `\"object\"` по старой ошибке языка.",
  },
  {
    id: "js-symbol", region: 0, level: "middle",
    q: "Что такое `Symbol` и зачем он нужен?",
    a: "`Symbol` — примитив, каждый экземпляр которого уникален: `Symbol(\"id\") !== Symbol(\"id\")`. Его используют как ключ свойства, который не столкнётся с чужими ключами и не попадёт в `Object.keys`, `for...in` и `JSON.stringify`. Встроенные символы настраивают поведение объектов: `Symbol.iterator` делает объект итерируемым, `Symbol.toPrimitive` управляет приведением. `Symbol.for(\"key\")` берёт символ из общего реестра.",
    code: `const id = Symbol("id");
const user = { name: "Аня", [id]: 42 };
Object.keys(user);   // ["name"] — символ не виден
user[id];            // 42`,
  },
  {
    id: "js-strings-immutable", region: 0, level: "junior",
    q: "Можно ли изменить строку? Как собрать большую строку из частей?",
    a: "Строки неизменяемы: `s[0] = \"x\"` в строгом режиме бросит `TypeError`, а методы вроде `toUpperCase` и `replace` возвращают новую строку. Склеивать строки через `+` в цикле можно — современные движки делают это эффективно. Для списка частей удобнее собрать массив и вызвать `join`, а для вставки значений — шаблонные строки.",
  },
  {
    id: "js-stack-overflow", region: 2, level: "middle",
    q: "Что такое переполнение стека вызовов и как его избежать?",
    a: "Каждый вызов функции кладёт кадр на стек, и у стека есть предел — обычно порядка десяти тысяч вложенных вызовов. Бесконечная или слишком глубокая рекурсия бросает `RangeError: Maximum call stack size exceeded`. Лечат базовым случаем рекурсии, переписыванием на цикл с явным стеком или разбиением работы на асинхронные части. Оптимизацию хвостовых вызовов стандарт описывает, но почти все движки её не делают.",
  },
  {
    id: "js-typeof-instanceof", region: 3, level: "junior",
    q: "Чем `typeof` отличается от `instanceof`?",
    a: "`typeof` возвращает строку с типом значения и хорошо работает для примитивов и функций. `instanceof` проверяет, есть ли `F.prototype` в цепочке прототипов объекта, — это про объекты и классы. `instanceof` ломается между окнами и iframe: у них разные `Array`, поэтому массивы проверяют через `Array.isArray`. Для примитивов `instanceof` всегда `false`: `\"a\" instanceof String` — ложь.",
  },
  {
    id: "js-proxy", region: 3, level: "senior",
    q: "Что такое `Proxy` и `Reflect`? Где их применяют?",
    a: "`Proxy` оборачивает объект и перехватывает операции с ним: чтение, запись, удаление, проверку `in`, вызов функции. Обработчики-ловушки задаются объектом `handler`: `get`, `set`, `has` и другие. `Reflect` — набор функций с тем же поведением по умолчанию, чтобы из ловушки удобно вызвать исходную операцию. На `Proxy` построена реактивность Vue 3 и MobX, валидация, логирование, ленивые объекты.",
    code: `const logged = new Proxy({ a: 1 }, {
  get(target, key, receiver) {
    console.log("читаем", String(key));
    return Reflect.get(target, key, receiver);
  },
});
logged.a; // «читаем a», затем 1`,
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
    id: "js-for-await", region: 5, level: "senior",
    q: "Что такое асинхронные итераторы и `for await...of`?",
    a: "Асинхронный итератор — объект, у которого `next()` возвращает промис с `{ value, done }`. Его делает метод `Symbol.asyncIterator` или асинхронный генератор `async function*`. `for await...of` перебирает такие объекты, дожидаясь каждого элемента. Так читают потоки данных по частям: `ReadableStream`, постраничную загрузку API, строки большого файла в Node.js.",
    code: `async function* pages() {
  for (let page = 1; page <= 3; page++) {
    yield await Promise.resolve([page * 10]); // здесь был бы запрос страницы
  }
}
for await (const items of pages()) console.log(items);`,
  },
  {
    id: "js-node-event-loop", region: 5, level: "senior",
    q: "Чем event loop в Node.js отличается от браузерного?",
    a: "В Node.js event loop построен на libuv и идёт по фазам: таймеры, отложенные колбэки ввода-вывода, опрос ввода-вывода, `setImmediate`, закрытие ресурсов. Между колбэками выполняются очередь `process.nextTick` и затем микрозадачи промисов — `nextTick` раньше. Отрисовки нет. Порядок `setTimeout(fn, 0)` и `setImmediate` в основном скрипте не определён, а внутри колбэка ввода-вывода `setImmediate` всегда раньше.",
  },
  {
    id: "js-web-components", region: 6, level: "middle",
    q: "Что такое Web Components?",
    a: "Это набор стандартов браузера для своих элементов без фреймворка. Custom Elements — класс, унаследованный от `HTMLElement` и зарегистрированный через `customElements.define(\"my-card\", MyCard)`, с колбэками жизненного цикла. Shadow DOM — изолированное поддерево со своими стилями, которые не протекают наружу и внутрь. `<template>` и `<slot>` — разметка-шаблон и места для вставки содержимого. Web Components работают в любом фреймворке, поэтому на них делают дизайн-системы.",
  },
  {
    id: "js-memory-leaks", region: 7, level: "middle",
    q: "Какие бывают утечки памяти во фронтенде и как их найти?",
    a: "Типичные утечки: забытые таймеры и `setInterval`, обработчики событий на `window` и `document`, которые не сняли при уходе со страницы или размонтировании, отсоединённые элементы DOM, на которые осталась ссылка, растущие кэши и массивы без ограничения, замыкания, держащие большие данные. Находят во вкладке Memory в DevTools: снимки кучи до и после действия и поиск объектов, которые должны были исчезнуть. Лечат очисткой в эффектах, `AbortController` для обработчиков и `WeakMap` для кэшей.",
  },
  {
    id: "js-date-temporal", region: 8, level: "middle",
    q: "Какие проблемы у `Date` и что такое Temporal?",
    a: "`Date` изменяемый, месяцы в нём считаются с нуля, часовые пояса поддерживаются только местный и UTC, а разбор строк зависит от формата и движка. Поэтому для дат брали библиотеки вроде date-fns и Day.js. Temporal — новый встроенный API: неизменяемые типы для даты без времени, времени, момента и даты с часовым поясом, понятная арифметика и календари. Он уже появляется в браузерах, поддержку перед использованием проверяют.",
  },
  {
    id: "js-locale-sort", region: 4, level: "junior",
    q: "Как правильно отсортировать массив строк на русском языке?",
    a: "Обычный `sort()` сравнивает строки по кодам символов, поэтому `ё` окажется после `я`, а заглавные — раньше строчных. Для естественного порядка используют `localeCompare`: `words.sort((a, b) => a.localeCompare(b, \"ru\"))`. Для многократной сортировки быстрее создать `Intl.Collator(\"ru\")` один раз и передать его `compare`. Опция `numeric: true` сортирует «файл2» раньше «файл10».",
  },
];

export const JS = makeCourse("js", "JavaScript", REGIONS, REGION_LESSONS, EXTRA_CARDS, "jsc", 500, { withCode: true, runnable: true });
