import { LESSONS } from "./lessons";

export type RegionKind = "lessons" | "sorter" | "soon";

export interface Topic {
  t: string;
  q: string;
  /** Уровень сортировщика (регион sorter). */
  lv?: number;
  /** Урок (регион lessons). */
  lesson?: string;
}

export interface Region {
  name: string;
  kind: RegionKind;
  desc: string;
  topics?: Topic[];
}

/** Девять регионов в порядке TypeScript Handbook. План — в docs/curriculum.md. */
export const REGIONS: Region[] = [
  { name: "Основы", kind: "lessons", desc: "The Basics и Everyday Types: примитивы, объекты, union, `type` и `interface`, литералы, `null`, совместимость типов." },
  { name: "Болото союзов", kind: "sorter", desc: "Narrowing: все способы сужать union, от `typeof` до проверки данных из сети.", topics: [
    { t: "Union и сужение typeof", lv: 0, q: "Что такое type narrowing и какие способы ты знаешь?" },
    { t: "Truthiness и null", lv: 1, q: "Чем опасна проверка `if (!value)`?" },
    { t: "Операторы in и instanceof", lv: 2, q: "Почему нельзя проверить интерфейс через `instanceof`?" },
    { t: "Discriminated unions", lv: 3, q: "Для чего нужны discriminated unions?" },
    { t: "never и exhaustive check", lv: 3, q: "Как сделать, чтобы компилятор ругался на необработанный вариант?" },
    { t: "Array.isArray и классы", lv: 4, q: 'Почему `typeof x === "object"` — плохая проверка?' },
    { t: "unknown и порядок сужения", lv: 5, q: "Чем `unknown` отличается от `any` и как с ним работать?" },
  ] },
  { name: "Функции", kind: "soon", desc: "More on Functions: сигнатуры, перегрузки, `this`, `void`, rest-параметры.", topics: [
    { t: "Сигнатуры функций", q: "Как описать функцию, у которой есть свойство?" },
    { t: "Перегрузки", q: "Когда лучше union, а когда перегрузки?" },
    { t: "void и колбэки", q: "Почему `forEach(x => arr.push(x))` компилируется, хотя колбэк должен вернуть `void`?" },
    { t: "Rest-параметры и кортежи", q: "Почему `Math.atan2(...args)` падает без `as const`?" },
  ] },
  { name: "Объекты", kind: "soon", desc: "Object Types: `readonly`, index signatures, `extends` и `&`, кортежи.", topics: [
    { t: "readonly и index signatures", q: "Защищает ли `readonly` вложенные объекты?" },
    { t: "extends против &", q: "Чем `extends` отличается от пересечения?" },
    { t: "Generic object types", q: "Зачем дженерик-интерфейсы вроде `Box<T>`?" },
    { t: "Кортежи", q: "Чем кортеж отличается от массива?" },
  ] },
  { name: "Кузница дженериков", kind: "soon", desc: "Generics, `keyof`, `typeof`, indexed access.", topics: [
    { t: "Generics и constraints", q: "Зачем нужны дженерики и что значит `extends` в них?" },
    { t: "keyof и T[K]", q: "Как типизировать `getProp(obj, key)`?" },
    { t: "typeof в типах", q: "Как получить тип из объекта-константы?" },
    { t: "const type parameters", q: "Что даёт `<const T>`?" },
  ] },
  { name: "Мастерская утилит", kind: "lessons", desc: "Все 22 утилиты из справочника Utility Types: применение и как написать свои." },
  { name: "Башня условий", kind: "soon", desc: "Conditional, mapped и template literal types — программирование на уровне типов.", topics: [
    { t: "Conditional types и extends", q: "Что такое conditional types?" },
    { t: "Дистрибутивность", q: "Почему `ToArray<string | number>` даёт `string[] | number[]`?" },
    { t: "infer", q: "Как устроен `ReturnType`?" },
    { t: "Mapped types и key remapping", q: "Как написать `DeepReadonly`?" },
    { t: "Template literal types", q: "Как вытащить параметр из строки маршрута?" },
  ] },
  { name: "Классы и модули", kind: "soon", desc: "Classes, Modules, Enums, Declaration Merging.", topics: [
    { t: "implements и extends", q: "Чем `implements` отличается от `extends`?" },
    { t: "private против #private", q: "В чём разница `private` и `#field`?" },
    { t: "import type", q: "Зачем нужен `import type`?" },
    { t: "Declaration merging", q: "Как расширить тип сторонней библиотеки?" },
  ] },
  { name: "Контракты", kind: "soon", desc: "Где заканчивается TypeScript и начинается рантайм: `satisfies`, guards, `strict`, API.", topics: [
    { t: "as против satisfies", q: "Чем `as` отличается от `satisfies`?" },
    { t: "Type guards и asserts", q: "Что такое `x is T` и в чём его риск?" },
    { t: "strict и полезные флаги", q: "Что включает `strict` и чего в нём нет?" },
    { t: "API без any", q: "Как типизировать ответ API без `any`?" },
    { t: "Branded types", q: "Как получить номинальную типизацию?" },
  ] },
];

export function regionTopics(ri: number): Topic[] {
  const r = REGIONS[ri]!;
  if (r.kind === "lessons") return LESSONS.filter((l) => l.region === ri).map((l) => ({ t: l.title, q: l.q, lesson: l.id }));
  return r.topics ?? [];
}
