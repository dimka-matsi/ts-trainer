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
  { name: "Башня условий", kind: "soon", desc: "Conditional, mapped и template literal types — программирование на уровне типов.", topics: [
    { t: "Conditional types и extends", q: "Что такое conditional types?" },
    { t: "Дистрибутивность", q: "Почему `ToArray<string | number>` даёт `string[] | number[]`?" },
    { t: "infer", q: "Как устроен `ReturnType`? Напиши `ElementType<T>`." },
    { t: "Mapped types и key remapping", q: "Как написать `DeepReadonly`?" },
    { t: "Template literal types", q: "Как вытащить параметр из строки маршрута?" },
    { t: "Рекурсивные типы", q: "Как описать JSON-значение и типизировать `get(obj, \"a.b.c\")`?" },
  ] },
  { name: "Классы и модули", kind: "soon", desc: "Classes, Modules, Enums, Declaration Merging, `.d.ts`.", topics: [
    { t: "Поля, конструкторы и strictPropertyInitialization", q: "Почему TypeScript требует инициализировать поля класса и как это обойти?" },
    { t: "implements и extends", q: "Чем `implements` отличается от `extends`?" },
    { t: "override и порядок инициализации", q: "Зачем `override` и `noImplicitOverride`?" },
    { t: "Модификаторы доступа", q: "В чём разница `private`, `protected` и `#field`?" },
    { t: "abstract и parameter properties", q: "Абстрактный класс или интерфейс? Что делает `constructor(private x: number)`?" },
    { t: "Геттеры, сеттеры и static-блоки", q: "Как типизируются `get`/`set` и статические члены класса?" },
    { t: "Тип this и this-guards", q: "Что значит возвращаемый тип `this` и как работает `this is T` в методе?" },
    { t: "Class expressions и abstract construct signatures", q: "Как описать параметр «любой наследник абстрактного класса»?" },
    { t: "Mixins", q: "Как типизировать миксин, который добавляет классу поля?" },
    { t: "Enums и const enum", q: "Почему часто выбирают union и `as const` вместо `enum`?" },
    { t: "ES-модули и CommonJS", q: "Чем ES-модули отличаются от CommonJS и что такое файл без импортов и экспортов?" },
    { t: "import type", q: "Зачем нужен `import type`?" },
    { t: ".d.ts и declare", q: "Что такое declaration file и как типизировать JS-библиотеку без типов?" },
    { t: "Declaration merging", q: "Как расширить тип сторонней библиотеки (module augmentation)?" },
    { t: "Namespaces", q: "Что такое `namespace` и нужен ли он в новом коде?" },
    { t: "Декораторы", q: "Что такое декораторы и чем стандартные отличаются от `experimentalDecorators`?" },
  ] },
  { name: "Контракты", kind: "soon", desc: "Где заканчивается TypeScript и начинается рантайм: guards, `strict`, данные из сети, branded types.", topics: [
    { t: "Type guards и asserts", q: "Как проверить данные из сети и не соврать компилятору?" },
    { t: "strict и полезные флаги", q: "Что включает `strict` и чего в нём нет?" },
    { t: "unknown в catch", q: "Почему в `catch (e)` тип `unknown` и как с ним работать?" },
    { t: "API без any", q: "Сервер вернул не ту форму данных. Как типизировать ответ API без `any`?" },
    { t: "Branded types", q: "Как получить номинальную типизацию?" },
  ] },
  { name: "TS и React", kind: "soon", desc: "Пропсы, события, хуки, дженерик-компоненты — то, что спрашивают у фронтендеров.", topics: [
    { t: "JSX в TypeScript", q: "Что делают настройка `jsx` и расширение `.tsx`?" },
    { t: "Пропсы и children", q: "Чем отличаются `ReactNode`, `ReactElement` и `JSX.Element`?" },
    { t: "События", q: "Как типизировать `onChange` у инпута и `onSubmit` у формы?" },
    { t: "useState и useReducer", q: "Как типизировать reducer, чтобы `action` сужался по `type`?" },
    { t: "useRef", q: "Почему `useRef<HTMLInputElement>(null)` и `useRef<number>()` ведут себя по-разному?" },
    { t: "useContext без undefined", q: "Как сделать контекст, который не надо каждый раз проверять на `undefined`?" },
    { t: "Взаимоисключающие пропсы", q: "Как запретить передать одновременно `href` и `onClick`?" },
    { t: "Дженерик-компоненты и хуки", q: "Как написать `<Select<T>>` или `useFetch<T>`?" },
    { t: "ComponentProps и ref", q: "Как взять пропсы у `button` и пробросить `ref`?" },
    { t: "Полиморфный as-prop", q: "Как типизировать `<Box as=\"a\" href=\"...\">`?" },
  ] },
  { name: "Компилятор и проект", kind: "soon", desc: "tsconfig, сборка и то, как TypeScript превращается в JavaScript.", topics: [
    { t: "Компиляция и транспиляция", q: "Чем `tsc` отличается от Babel, SWC и esbuild? Что делает `isolatedModules`?" },
    { t: "Type stripping", q: "Как Node запускает `.ts` без сборки и что запрещает `erasableSyntaxOnly`?" },
    { t: "target, module, lib", q: "Что задают `target`, `module`, `moduleResolution` и `lib`?" },
    { t: "Импорт CommonJS", q: "Зачем `esModuleInterop` и что будет без него?" },
    { t: "skipLibCheck, declaration, sourceMap", q: "Что делают эти флаги и когда их включать?" },
    { t: "paths и project references", q: "Как настроить алиасы и разбить монорепу на проекты?" },
    { t: "Разбор tsconfig", q: "Объясни по строчкам tsconfig своего проекта." },
    { t: "Декларации для библиотеки", q: "Как опубликовать библиотеку с типами и что такое `types` в package.json?" },
    { t: "JSDoc и проверка JS-файлов", q: "Как постепенно перевести проект с JavaScript на TypeScript?" },
    { t: "Triple-slash директивы", q: "Что такое `/// <reference types=\"...\" />` и когда он нужен?" },
  ] },
];

export function regionTopics(ri: number): Topic[] {
  const r = REGIONS[ri]!;
  if (r.kind === "lessons") return LESSONS.filter((l) => l.region === ri).map((l) => ({ t: l.title, q: l.q, lesson: l.id }));
  return r.topics ?? [];
}
