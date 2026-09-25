import { LESSONS } from "./lessons";

export type RegionKind = "lessons" | "sorter" | "soon";

export interface Topic {
  t: string;
  q: string;
  /** Уровень сортировщика (регион sorter). */
  lv?: number;
  /** Урок: в регионе lessons все темы, в регионе sorter — темы, которые не ложатся на сортировщик. */
  lesson?: string;
}

export interface Region {
  name: string;
  kind: RegionKind;
  desc: string;
  topics?: Topic[];
}

/** Регионы: сначала по порядку TypeScript Handbook, в конце React и компилятор. План — в docs/curriculum.md. */
export const REGIONS: Region[] = [
  { name: "Основы", kind: "lessons", desc: "The Basics и Everyday Types: примитивы, объекты, union, `type` и `interface`, литералы, `null`, совместимость типов, `satisfies`." },
  { name: "Болото союзов", kind: "sorter", desc: "Narrowing: все способы сужать union, от `typeof` до проверки данных из сети.", topics: [
    { t: "Union и сужение typeof", lv: 0, q: "Что такое type narrowing и какие способы ты знаешь?" },
    { t: "Truthiness и null", lv: 1, q: "Чем опасна проверка `if (!value)`?" },
    { t: "Операторы in и instanceof", lv: 2, q: "Почему нельзя проверить интерфейс через `instanceof`?" },
    { t: "Discriminated unions", lv: 3, q: "Для чего нужны discriminated unions?" },
    { t: "never и exhaustive check", lv: 3, q: "Как сделать, чтобы компилятор ругался на необработанный вариант?" },
    { t: "Array.isArray и классы", lv: 4, q: 'Почему `typeof x === "object"` — плохая проверка?' },
    { t: "unknown и порядок сужения", lv: 5, q: "Чем `unknown` отличается от `any` и как с ним работать?" },
    { t: "Присваивания и анализ потока", lesson: "na", q: "Как TypeScript понимает тип переменной после `return`, `throw` и присваивания?" },
    { t: "Equality и == null", lesson: "n1", q: "Как `x == null` влияет на тип и чем отличается от `x === null`?" },
    { t: "Type predicates", lesson: "n2", q: "Что такое `x is T` и в чём его риск?" },
    { t: "Assertion functions", lesson: "n3", q: "Чем assertion function отличается от type guard?" },
    { t: "Состояния loading / success / error", lesson: "n4", q: "Как описать состояние запроса, чтобы не было «данных без успеха»?" },
  ] },
  { name: "Функции", kind: "lessons", desc: "More on Functions: сигнатуры, дженерик-функции, перегрузки, `this`, `void` и `never`, async, rest-параметры, вариантность." },
  { name: "Объекты", kind: "lessons", desc: "Object Types: `Object`, `{}` и `object`, `readonly`, index signatures, лишние свойства, `extends` и `&`, дженерик-объекты, кортежи, readonly-массивы, символы, итераторы." },
  { name: "Кузница дженериков", kind: "lessons", desc: "`keyof` и `T[K]`, параметр-ключ, `typeof` в типах, параметры по умолчанию, дженерик-классы, `<const T>`." },
  { name: "Мастерская утилит", kind: "lessons", desc: "Все 22 утилиты из справочника Utility Types: применение и как написать свои." },
  { name: "Башня условий", kind: "lessons", desc: "Conditional types, дистрибутивность, `infer`, mapped types и переименование ключей, template literal types, рекурсивные типы и задачи с собеседований." },
  { name: "Классы и модули", kind: "lessons", desc: "Classes, Modules, Enums, Declaration Merging, Namespaces, Decorators: поля и модификаторы, `abstract`, `this`, миксины, `enum`, `import type`, `.d.ts` и расширение библиотек." },
  { name: "Контракты", kind: "lessons", desc: "Где заканчиваются типы и начинается проверка во время работы: данные из сети, схемы валидации, `unknown` в `catch`, `strict` и флаги сверх него, branded types, `Result` вместо исключений." },
  { name: "TS и React", kind: "lessons", desc: "JSX в `.tsx`, пропсы и `children`, события, `useState` и `useReducer`, `useRef`, контекст без `undefined`, взаимоисключающие пропсы, дженерик-компоненты, `ComponentProps` и полиморфный `as`. Проверяется настоящими типами React 19." },
  { name: "Компилятор и проект", kind: "lessons", desc: "`tsc` и транспиляторы, запуск `.ts` в Node, `target` и `lib`, модули и импорт CommonJS, библиотеки с типами, JSDoc и миграция, `paths` и project references, разбор tsconfig и TypeScript 6 и 7." },
];

export function regionTopics(ri: number): Topic[] {
  const r = REGIONS[ri]!;
  if (r.kind === "lessons") return LESSONS.filter((l) => l.region === ri).map((l) => ({ t: l.title, q: l.q, lesson: l.id }));
  return r.topics ?? [];
}
