import type { Flashcard } from "../flashcards";
import { makeCourse, type WebLesson, type WebRegion } from "../course/types";
import { lessons as arrays } from "./lessons/arrays";
import { lessons as async } from "./lessons/async";
import { lessons as functions } from "./lessons/functions";
import { lessons as objects } from "./lessons/objects";
import { lessons as scope } from "./lessons/scope";
import { lessons as values } from "./lessons/values";

/**
 * «JavaScript»: язык и работа со страницей. Порядок: значения и типы → области видимости и замыкания → функции и `this` →
 * объекты и прототипы → массивы и коллекции → асинхронность → DOM и события → Web API → модули и современный JS →
 * задачи live coding. Код заданий выполняется по-настоящему: в браузере — в воркере, в verify — в Node.
 */
const REGION_LESSONS: WebLesson[][] = [values, scope, functions, objects, arrays, async];

const REGIONS: WebRegion[] = [
  { name: "Типы и значения", kind: "lessons", desc: "Восемь типов и `typeof`, примитивы и ссылки, приведение типов, `==` и `===`, числа и `0.1 + 0.2`, копирование объектов." },
  { name: "Области видимости и замыкания", kind: "lessons", desc: "`var`, `let` и `const`, поднятие и TDZ, лексическое окружение, замыкания и задача про цикл с `setTimeout`." },
  { name: "Функции и this", kind: "lessons", desc: "Виды функций, правила `this`, стрелочные функции, `call`, `apply` и `bind`, потеря контекста, каррирование." },
  { name: "Объекты и прототипы", kind: "lessons", desc: "Свойства и ключи, прототипы и цепочка, что делает `new`, классы, дескрипторы и заморозка объектов." },
  { name: "Массивы и коллекции", kind: "lessons", desc: "Методы перебора, мутирующие и новые немутирующие методы, деструктуризация, `Map` и `Set`, итераторы и генераторы." },
  { name: "Асинхронность и event loop", kind: "lessons", desc: "Стек вызовов и event loop, промисы, микро- и макрозадачи, `async`/`await`, комбинаторы промисов." },
  { name: "DOM и события", kind: "soon", desc: "Дерево DOM и поиск элементов, всплытие и погружение, делегирование, опции `addEventListener`, загрузка страницы." },
  { name: "Web API", kind: "soon", desc: "`fetch` и отмена запросов, хранилища, таймеры и `requestAnimationFrame`, observers, Web Workers." },
  { name: "Модули и современный JS", kind: "soon", desc: "ES-модули и CommonJS, строгий режим, обработка ошибок, новые возможности ES2020–ES2025." },
  { name: "Live coding", kind: "soon", desc: "Задачи, которые пишут на собеседовании: debounce, throttle, deepClone, deepEqual, flatten, memoize, Promise.all, EventEmitter, curry, retry." },
];

/** Дополнительные карточки: частые вопросы собеседований, которые не стали отдельным уроком. id начинаются с `js-`. */
const EXTRA_CARDS: Flashcard[] = [];

export const JS = makeCourse("js", "JavaScript", REGIONS, REGION_LESSONS, EXTRA_CARDS, "jsc", 500, { withCode: true, runnable: true });
