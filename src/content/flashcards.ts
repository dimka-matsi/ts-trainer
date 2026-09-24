import { LESSONS } from "./lessons";

export type CardLevel = "junior" | "middle" | "senior";

export interface Flashcard {
  /** Стабильный id: по нему хранится прогресс. */
  id: string;
  /** Индекс региона в REGIONS. */
  region: number;
  level: CardLevel;
  q: string;
  /** Ответ вслух на 2–4 предложения. */
  a: string;
  /** Пример к ответу. Строки с ошибкой помечаются `// ошибка`, verify это проверяет. */
  code?: string;
}

export const LEVEL_NAME: Record<CardLevel, string> = { junior: "Junior", middle: "Middle", senior: "Senior" };

/** Карточки, которых нет в уроках. Вопросы уроков добавляются ниже автоматически. */
const CARDS: Flashcard[] = [
  // 1. Основы
  {
    id: "ts-why", region: 0, level: "junior",
    q: "Зачем нужен TypeScript, если есть JavaScript?",
    a: "TypeScript находит ошибки до запуска кода: опечатки в свойствах, неверные аргументы, забытые проверки на `null`. Редактор по типам подсказывает поля и методы, а рефакторинг становится безопаснее. За это приходится платить шагом сборки и временем на описание типов. Данные из сети типы не проверяют, их всё равно нужно валидировать.",
    code: `function total(prices: number[]) {
  return prices.reduce((sum, p) => sum + p, 0);
}
total([100, 250]);
total(["100"]); // ошибка: строка вместо числа`,
  },
  {
    id: "never", region: 0, level: "junior",
    q: "Что такое тип `never` и где он встречается?",
    a: "У типа `never` нет ни одного значения. Его возвращает функция, которая всегда бросает исключение. Он остаётся в ветке, где проверки исключили все варианты union, и получается при несовместимом пересечении. `never` можно присвоить в любой тип, а в `never` нельзя присвоить ничего другого.",
    code: `function fail(msg: string): never {
  throw new Error(msg);
}
type Empty = string & number; // never

function check(x: string | number) {
  if (typeof x === "string") return;
  if (typeof x === "number") return;
  const rest: never = x; // все варианты разобраны
}`,
  },
  {
    id: "null-undefined", region: 0, level: "junior",
    q: "Чем `null` отличается от `undefined`?",
    a: "`undefined` получается, когда значение не задано: параметр не передали, свойства нет. `null` обычно присваивают явно, когда значения нет намеренно. При `strictNullChecks` это два разных типа. Операторы `?.` и `??` и проверка `== null` работают с обоими.",
    code: `type User = { name: string; phone?: string; avatar: string | null };
declare const u: User;
u.phone;  // string | undefined: поля может не быть
u.avatar; // string | null: поле есть, но может быть пустым
const label = u.phone ?? u.avatar ?? "нет контактов";`,
  },
  {
    id: "contextual-typing", region: 0, level: "middle",
    q: "Что такое contextual typing?",
    a: "Это вывод типа из места, куда подставляют значение. Параметр колбэка в `nums.map((n) => ...)` получает тип из сигнатуры `map`, поэтому аннотация ему не нужна. Если вынести колбэк в отдельную переменную, контекст пропадает, и тип параметра придётся указать.",
    code: `const nums = [1, 2, 3];
const strs = nums.map((n) => n.toFixed(1)); // n: number из контекста

const format = (n) => n.toFixed(1); // ошибка: у n неявный any`,
  },
  {
    id: "runtime-interface", region: 1, level: "junior",
    q: "Можно ли во время выполнения проверить, что объект соответствует интерфейсу?",
    a: "Нет, интерфейсы стираются при компиляции, в JS от них ничего не остаётся. Форму объекта проверяют вручную: type guard с `typeof` и `in` или библиотека схем вроде zod. `instanceof` работает только с классами, потому что класс существует во время работы программы.",
    code: `interface User { name: string }

function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null && "name" in x && typeof x.name === "string";
}

declare const data: unknown;
if (isUser(data)) data.name.toUpperCase();`,
  },

  // 2. Болото союзов
  {
    id: "narrowing", region: 1, level: "junior",
    q: "Что такое сужение типов (narrowing) и какие способы ты знаешь?",
    a: "TypeScript смотрит на проверки в коде и внутри ветки уточняет тип переменной. Сужают `typeof`, проверка на truthiness, сравнения `===` и `==`, операторы `in` и `instanceof`, `Array.isArray`, поле-метка discriminated union, type predicate и assertion function.",
    code: `function show(x: string | number[] | null) {
  if (x === null) return "пусто";
  if (typeof x === "string") return x.toUpperCase(); // string
  return x.join(", ");                               // number[]
}`,
  },
  {
    id: "unknown-any", region: 1, level: "junior",
    q: "Чем `unknown` отличается от `any`?",
    a: "Оба типа принимают любое значение. С `any` компилятор разрешает любые операции и перестаёт проверять всё, что из него получено. С `unknown` нельзя ничего, пока тип не сужен проверкой. Для данных из сети и `JSON.parse` лучше подходит `unknown`.",
    code: `declare const a: any;
declare const u: unknown;
a.foo.bar();  // компилируется, но упадёт при запуске
u.foo;        // ошибка: сначала нужно сузить тип
if (typeof u === "string") u.toUpperCase();`,
  },
  {
    id: "falsy", region: 1, level: "junior",
    q: "Чем опасна проверка `if (!value)`?",
    a: "Кроме `null` и `undefined` ложными считаются `0`, `\"\"`, `NaN`, `0n` и `false`. Поэтому допустимый ноль или пустая строка попадут в ветку «значения нет». Чтобы проверить только отсутствие значения, пишут `value == null`, а значение по умолчанию подставляют через `??`.",
    code: `function port(p?: number) {
  return p || 3000; // 0 превратится в 3000
}
function port2(p?: number) {
  return p ?? 3000; // 0 останется 0
}`,
  },
  {
    id: "instanceof-interface", region: 1, level: "junior",
    q: "Почему интерфейс нельзя проверить через `instanceof`?",
    a: "`instanceof` работает во время выполнения и проверяет цепочку прототипов. Интерфейсов в JS нет, поэтому сравнивать не с чем. Для интерфейса пишут type guard, который проверяет поля, или добавляют в тип поле-метку.",
    code: `interface Cat { meow(): void }
class Dog { bark() {} }
declare const x: unknown;
if (x instanceof Dog) x.bark(); // класс существует и в JavaScript
if (x instanceof Cat) {}        // ошибка: Cat существует только как тип`,
  },
  {
    id: "discriminated", region: 1, level: "junior",
    q: "Что такое discriminated union и зачем он нужен?",
    a: "Это union объектов, у которых есть общее поле с литеральным типом, например `kind` или `status`. Проверка этого поля сужает тип до одного варианта, и становятся доступны его поля. Так описывают состояния запроса, действия в reducer, фигуры и сообщения.",
    code: `type Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number };

function area(s: Shape) {
  if (s.kind === "circle") return Math.PI * s.r ** 2;
  return s.w * s.h;
}`,
  },
  {
    id: "exhaustive", region: 1, level: "middle",
    q: "Как сделать, чтобы компилятор сообщал о необработанном варианте union?",
    a: "В ветке `default` присвоить значение переменной типа `never`. Пока все варианты обработаны, там остаётся `never`, и присваивание проходит. Когда в union добавят новый вариант, он не присвоится в `never`, и компилятор покажет это место.",
    code: `type Shape = { kind: "circle"; r: number } | { kind: "square"; a: number };
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.a ** 2;
    default: {
      const unreachable: never = s;
      return unreachable;
    }
  }
}`,
  },
  {
    id: "typeof-object", region: 1, level: "junior",
    q: "Почему `typeof x === \"object\"` плохо подходит для проверки объекта?",
    a: "`typeof null` в JS тоже равен `\"object\"`, поэтому проверка пропускает `null`. Ещё под неё попадают массивы, даты и любые другие объекты. Для массивов есть `Array.isArray`, для классов `instanceof`, а `null` нужно исключать отдельно.",
    code: `function f(x: string[] | Date | null) {
  if (typeof x === "object") {
    x; // string[] | Date | null: null тоже здесь
  }
  if (typeof x === "object" && x !== null && !Array.isArray(x)) {
    x.getTime(); // Date
  }
}`,
  },
  {
    id: "assign-narrowing", region: 1, level: "middle",
    q: "У переменной `let x: string | number` после `x = 1` тип `number`. Почему потом ей можно присвоить строку?",
    a: "Присваивание сужает тип до типа присвоенного значения, но только до следующего присваивания. Объявленный тип `string | number` продолжает ограничивать запись. Читать `x` как число можно сразу после `x = 1`, а записать строку разрешено всегда.",
    code: `let x: string | number = "a";
x = 1;
x.toFixed(2);     // x: number
x = "снова строка";
x.toUpperCase();  // x: string
x = true;         // ошибка: boolean не входит в объявленный тип`,
  },

  // 3. Функции
  {
    id: "call-signature", region: 2, level: "middle",
    q: "Как описать функцию, у которой есть свойство?",
    a: "Через объектный тип с call signature: `{ (n: number): string; label: string }`. Внутри объектного типа между параметрами и результатом ставят `:`, а не `=>`. Для вызова через `new` похожим образом пишут construct signature.",
    code: `type Formatter = {
  (n: number): string;
  label: string;
};
const fmt: Formatter = Object.assign((n: number) => n.toFixed(2), { label: "money" });
fmt(10);
fmt.label;`,
  },
  {
    id: "optional-default", region: 2, level: "junior",
    q: "Чем параметр `x?: number` отличается от `x = 0` и от `x: number | undefined`?",
    a: "С `x?` и с `x = 0` аргумент можно не передавать. Внутри функции у `x?` тип `number | undefined`, а у параметра со значением по умолчанию просто `number`. Параметр `x: number | undefined` без знака вопроса обязателен: передать нужно хотя бы явный `undefined`.",
    code: `function a(x?: number) { return x; }             // number | undefined
function b(x = 0) { return x; }                  // number
function c(x: number | undefined) { return x; }
a();
b();
c(); // ошибка: аргумент обязателен
c(undefined);`,
  },
  {
    id: "overloads", region: 2, level: "middle",
    q: "Когда лучше взять union в параметре, а когда перегрузки?",
    a: "Если тип результата не зависит от типа аргумента, достаточно union. Перегрузки нужны, когда от типа входа зависит тип выхода. Снаружи видны только сигнатуры перегрузок, сигнатура реализации скрыта. Проверяются они сверху вниз, поэтому узкие пишут первыми.",
    code: `function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number) {
  return typeof x === "string" ? Number(x) : String(x);
}
const n: number = parse("1");
const s: string = parse(1);`,
  },
  {
    id: "void-callback", region: 2, level: "middle",
    q: "Колбэк `forEach` должен возвращать `void`. Почему тогда `forEach(x => arr.push(x))` компилируется?",
    a: "Функцию, которая что-то возвращает, можно присвоить в тип с результатом `void`: вызывающий код обещает этот результат не использовать. `push` возвращает число, но `forEach` его просто не читает. Если же у самой функции явно указан тип `: void`, вернуть значение нельзя.",
    code: `const out: number[] = [];
[1, 2].forEach((x) => out.push(x));
type Cb = () => void;
const cb: Cb = () => 42;
function f(): void {
  return 1; // ошибка: явный void запрещает возвращать значение
}`,
  },
  {
    id: "never-void", region: 2, level: "junior",
    q: "Чем отличается результат `void` от результата `never`?",
    a: "Функция с результатом `void` завершается, просто её результат не используют. Функция с результатом `never` не завершается нормально: она бросает исключение или работает бесконечно. Код после вызова `never`-функции TypeScript считает недостижимым.",
    code: `function log(msg: string): void {
  console.log(msg);
}
function fail(msg: string): never {
  throw new Error(msg);
}
function parseAge(s: string): number {
  const n = Number(s);
  if (Number.isNaN(n)) fail("не число"); // дальше n точно число
  return n;
}`,
  },
  {
    id: "async", region: 2, level: "junior",
    q: "Какой тип возвращает async-функция и можно ли указать тип ошибки промиса?",
    a: "Async-функция всегда возвращает `Promise<T>`, где `T` — тип значения из `return`. Тип ошибки у `Promise` указать нельзя: в `catch` приходит `unknown`. Если ошибки важны для вызывающего, их возвращают как значение, например `{ ok: false, error }`.",
    code: `async function load() {
  return 42;
}
const p: Promise<number> = load();

type Result<T> = { ok: true; value: T } | { ok: false; error: string };
async function safeLoad(): Promise<Result<number>> {
  return { ok: false, error: "нет сети" };
}`,
  },
  {
    id: "rest-tuple", region: 2, level: "middle",
    q: "Почему вызов `Math.atan2(...args)` не компилируется, если `args = [1, 2]`?",
    a: "Литерал `[1, 2]` получает тип `number[]`, а у массива длина неизвестна. `atan2` ждёт ровно два аргумента, поэтому spread из массива не подходит. С `as const` получается кортеж `readonly [1, 2]` с известной длиной, и вызов проходит.",
    code: `const args = [1, 2];
Math.atan2(...args); // ошибка: у number[] неизвестная длина
const args2 = [1, 2] as const;
Math.atan2(...args2);`,
  },
  {
    id: "array-covariance", region: 2, level: "senior",
    q: "Почему присваивание `Dog[]` в `Animal[]` небезопасно?",
    a: "TypeScript разрешает такое присваивание, потому что массивы проверяются ковариантно. Но через переменную `Animal[]` в тот же массив можно положить кошку, и массив собак окажется испорчен. Если функция только читает массив, её параметр лучше объявить как `readonly Animal[]`.",
    code: `class Pet { name = "p"; }
class Puppy extends Pet { bark() {} }
class Kitten extends Pet { meow() {} }
const puppies: Puppy[] = [new Puppy()];
const pets: Pet[] = puppies;
pets.push(new Kitten()); // компилируется, и в puppies теперь котёнок

function names(list: readonly Pet[]) {
  list.push(new Kitten()); // ошибка: у readonly-массива нет push
}`,
  },

  // 4. Объекты
  {
    id: "object-types", region: 3, level: "middle",
    q: "Чем отличаются типы `Object`, `{}` и `object`?",
    a: "`{}` и `Object` принимают любое значение, кроме `null` и `undefined`, в том числе числа и строки. `object` принимает только не-примитивы: объекты, массивы и функции. Если нужен «любой объект», пишут `object`.",
    code: `const a: {} = 42;
const b: Object = "str";
const c: object = 42;   // ошибка: object не принимает примитивы
const d: object = [1, 2];`,
  },
  {
    id: "readonly-const", region: 3, level: "junior",
    q: "Чем `readonly` отличается от `const`?",
    a: "`const` запрещает присвоить переменной другое значение, но объект в ней можно менять. `readonly` запрещает запись в конкретное свойство, и эта проверка есть только в компиляторе. Чтобы запретить изменения во время выполнения, нужен `Object.freeze`.",
    code: `const user = { name: "Ann" };
user.name = "Bob"; // можно: const защищает только переменную
const cfg: { readonly port: number } = { port: 80 };
cfg.port = 81;     // ошибка: свойство только для чтения`,
  },
  {
    id: "readonly-deep", region: 3, level: "middle",
    q: "Защищает ли `readonly` вложенные объекты?",
    a: "Нет, `readonly` действует только на своё свойство. Для `readonly user: { name: string }` нельзя заменить `user`, но `user.name` менять можно. Для защиты всех уровней пишут рекурсивный `DeepReadonly` или используют `as const` на литерале.",
    code: `type Store = { readonly user: { name: string } };
declare const store: Store;
store.user.name = "Bob";         // можно
store.user = { name: "Bob" };    // ошибка: нельзя заменить user`,
  },
  {
    id: "extends-intersection", region: 3, level: "middle",
    q: "Чем расширение интерфейса через `extends` отличается от пересечения `&`?",
    a: "`extends` проверяет совместимость полей сразу, и конфликт даёт ошибку в самом объявлении. Пересечение `&` ошибки не даёт: конфликтующее поле получает тип `never`, и проблема всплывает позже. Кроме того, компилятор проверяет интерфейсы быстрее, чем большие пересечения.",
    code: `interface Base { id: string }
interface Child extends Base { id: number } // ошибка: id несовместим с Base
type Both = { id: string } & { id: number };
declare const both: Both;
both.id; // never`,
  },
  {
    id: "index-signature", region: 3, level: "junior",
    q: "Что такое index signature?",
    a: "Запись `{ [key: string]: number }` описывает объект с произвольными ключами и значениями одного типа. Именованные свойства такого объекта должны подходить под этот тип. Без флага `noUncheckedIndexedAccess` чтение по любому ключу даёт `number`, хотя ключа может не быть.",
    code: `const scores: { [name: string]: number } = { ann: 5, bob: 3 };
scores.kate = 4;
const x = scores.nobody; // number, хотя ключа нет

type Bad = { [key: string]: number; title: string }; // ошибка: title не number`,
  },
  {
    id: "tuple-array", region: 3, level: "junior",
    q: "Чем кортеж отличается от массива?",
    a: "Кортеж знает свою длину и тип каждой позиции: `[string, number]`. Элементы бывают необязательными и именованными: `[name: string, age?: number]`. Во время выполнения это обычный массив, и метод `push` у изменяемого кортежа TypeScript не запрещает.",
    code: `const t: [number, string] = [1, "a"];
t.push(2); // компилируется, длина уже не 2
const r: readonly [number, string] = [1, "a"];
r.push(2); // ошибка: у readonly-кортежа нет push`,
  },
  {
    id: "variadic", region: 3, level: "senior",
    q: "Что такое variadic tuple types?",
    a: "Это spread дженерик-кортежей внутри типа: `[...T, ...U]`. С ними описывают склейку кортежей, добавление аргумента к чужому списку параметров и функции вроде `curry`.",
    code: `type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
type R = Concat<[1, 2], ["a"]>; // [1, 2, "a"]
const r: R = [1, 2, "a"];`,
  },

  // 5. Дженерики
  {
    id: "generics-why", region: 4, level: "junior",
    q: "Зачем нужны дженерики?",
    a: "Дженерик связывает типы входа и выхода. `first<T>(arr: T[])` для массива строк вернёт строку, для массива чисел число. С `any` на выходе был бы `any`, и дальше проверки бы не работали. Параметр типа работает как аргумент функции, только для типов.",
    code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const s = first(["a", "b"]); // string | undefined
const n = first([1, 2]);     // number | undefined`,
  },
  {
    id: "generic-constraint", region: 4, level: "junior",
    q: "Что значит `extends` в параметре дженерика?",
    a: "Это ограничение: `T extends { length: number }` принимает любой тип, у которого есть числовое поле `length`. Внутри функции можно пользоваться только тем, что гарантирует ограничение. Проверяется присваиваемость, наследование классов тут ни при чём.",
    code: `function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest("ab", "abc");
longest([1], [1, 2]);
longest(1, 2); // ошибка: у number нет length`,
  },
  {
    id: "get-value", region: 4, level: "middle",
    q: "Как типизировать функцию `getValue(obj, key)`, чтобы результат имел тип поля?",
    a: "Нужны два параметра типа: `T` для объекта и `K extends keyof T` для ключа. Результат описывается как `T[K]`, это тип именно этого поля. Если передать несуществующий ключ, будет ошибка компиляции.",
    code: `function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const age = getValue({ name: "Ann", age: 30 }, "age"); // number
getValue({ name: "Ann" }, "email"); // ошибка: такого ключа нет`,
  },
  {
    id: "typeof-type", region: 4, level: "junior",
    q: "Как получить тип из существующего значения?",
    a: "Оператором `typeof` в позиции типа: `type Config = typeof config`. Вместе с `as const` и индексом `[number]` так получают union значений из массива-константы, и список не нужно дублировать.",
    code: `const ROLES = ["admin", "user"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "user"
const r: Role = "admin";
const bad: Role = "guest"; // ошибка: такой роли нет`,
  },
  {
    id: "keyof-index", region: 4, level: "middle",
    q: "Какой тип даст `keyof` для объекта с index signature `{ [k: string]: unknown }`?",
    a: "`string | number`. В JS числовые ключи приводятся к строкам, поэтому обращение `obj[0]` к такому объекту допустимо.",
    code: `type Dict = { [k: string]: unknown };
type K = keyof Dict; // string | number
const k: K = 1;`,
  },
  {
    id: "generic-default", region: 4, level: "middle",
    q: "Зачем параметру типа значение по умолчанию?",
    a: "Чтобы не указывать тип, который почти всегда один и тот же. В `Result<T, E = Error>` второй параметр можно опустить. Если параметр не указан и его не из чего вывести, берётся значение по умолчанию. Такие параметры пишут после обязательных.",
    code: `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };
const r1: Result<number> = { ok: false, error: new Error("x") };
const r2: Result<number, string> = { ok: false, error: "x" };`,
  },
  {
    id: "generic-once", region: 4, level: "middle",
    q: "Когда параметр дженерика лишний?",
    a: "Когда он встречается в сигнатуре один раз и ничего не связывает. `log<T>(x: T): void` работает так же, как `log(x: unknown): void`, только читается сложнее. Параметр типа полезен, если он появляется хотя бы в двух местах, например во входе и в результате.",
    code: `function logBad<T>(x: T): void { console.log(x); }  // T ничего не связывает
function log(x: unknown): void { console.log(x); }    // то же самое проще
function wrap<T>(x: T): { value: T } { return { value: x }; } // T связывает вход и выход`,
  },
  {
    id: "const-type-param", region: 4, level: "middle",
    q: "Что делает модификатор `const` у параметра типа, `<const T>`?",
    a: "Модификатор появился в TypeScript 5.0. Параметр выводится с литеральными типами, как будто вызывающий написал `as const`. Функция получает точные значения аргумента, а вызывающему не нужно ничего дописывать.",
    code: `function tuple<const T extends readonly unknown[]>(x: T) {
  return x;
}
const t = tuple(["a", 1]); // readonly ["a", 1]
function plain<T extends readonly unknown[]>(x: T) {
  return x;
}
const p = plain(["a", 1]); // (string | number)[]`,
  },
  {
    id: "generic-class", region: 4, level: "middle",
    q: "Как типизировать дженерик-класс, например кэш?",
    a: "Параметры типа пишут после имени класса: `class Cache<K, V>`. Они доступны в полях и методах экземпляра. В статических членах их использовать нельзя, потому что статика одна на все варианты `Cache<K, V>`.",
    code: `class Cache<K, V> {
  store = new Map<K, V>();
  get(k: K): V | undefined { return this.store.get(k); }
  set(k: K, v: V) { this.store.set(k, v); }
}
const cache = new Cache<string, number>();
cache.set("a", 1);
cache.set("b", "2"); // ошибка: значение должно быть числом`,
  },

  // 6. Утилиты
  {
    id: "own-utils", region: 5, level: "middle",
    q: "Напиши свои версии `Partial` и `Pick`.",
    a: "Обе утилиты — mapped types. `Partial` проходит по `keyof T` и добавляет каждому ключу `?`. `Pick` проходит только по выбранным ключам `K extends keyof T` и берёт тип поля через `T[P]`.",
    code: `type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type t1 = Expect<Equal<MyPartial<{ a: 1 }>, { a?: 1 }>>;
type t2 = Expect<Equal<MyPick<{ a: 1; b: 2 }, "a">, { a: 1 }>>;`,
  },
  {
    id: "mutable", region: 5, level: "middle",
    q: "Как снять со всех полей `readonly` или знак `?`?",
    a: "В mapped type перед модификатором ставят минус: `-readonly` убирает readonly, `-?` делает поля обязательными. На `-?` построен встроенный `Required`.",
    code: `type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] };
type t1 = Expect<Equal<Mutable<{ readonly a: 1 }>, { a: 1 }>>;
type t2 = Expect<Equal<Concrete<{ a?: 1 }>, { a: 1 }>>;`,
  },

  // 7. Башня условий
  {
    id: "conditional", region: 6, level: "middle",
    q: "Что такое conditional types?",
    a: "Запись `T extends U ? X : Y` выбирает тип по условию: если `T` присваивается в `U`, получается `X`, иначе `Y`. Вместе с дженериками это условие на уровне типов. На conditional types построены `Exclude`, `Extract` и `ReturnType`.",
    code: `type IsString<T> = T extends string ? "да" : "нет";
type t1 = Expect<Equal<IsString<"abc">, "да">>;
type t2 = Expect<Equal<IsString<42>, "нет">>;`,
  },
  {
    id: "distributive", region: 6, level: "senior",
    q: "Что такое дистрибутивность conditional types?",
    a: "Если слева от `extends` стоит параметр типа без обёртки, условие применяется к каждому члену union отдельно. Поэтому `ToArray<string | number>` даёт `string[] | number[]`. Чтобы проверять union целиком, обе стороны оборачивают в кортеж: `[T] extends [U]`.",
    code: `type ToArray<T> = T extends unknown ? T[] : never;
type ToArrayOne<T> = [T] extends [unknown] ? T[] : never;
type t1 = Expect<Equal<ToArray<string | number>, string[] | number[]>>;
type t2 = Expect<Equal<ToArrayOne<string | number>, (string | number)[]>>;`,
  },
  {
    id: "is-never", region: 6, level: "senior",
    q: "Почему `IsNever<never>`, написанный как `T extends never ? true : false`, даёт `never`, а не `true`?",
    a: "Для дистрибутивного условия `never` — пустой union. Перебирать нечего, и результат тоже пустой, то есть `never`. Чтобы получить `true`, дистрибутивность отключают кортежем: `[T] extends [never]`.",
    code: `type IsNeverBad<T> = T extends never ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type t1 = Expect<Equal<IsNeverBad<never>, never>>;
type t2 = Expect<Equal<IsNever<never>, true>>;`,
  },
  {
    id: "infer", region: 6, level: "middle",
    q: "Что делает `infer`? Напиши `ElementType<T>` для типа элемента массива.",
    a: "`infer` объявляет переменную типа внутри условия и захватывает часть проверяемого типа. Если сопоставление удалось, переменная доступна в ветке «да». Так устроены `ReturnType`, `Parameters` и `Awaited`.",
    code: `type ElementType<T> = T extends readonly (infer E)[] ? E : never;
type t1 = Expect<Equal<ElementType<string[]>, string>>;
type t2 = Expect<Equal<ElementType<readonly [1, 2]>, 1 | 2>>;`,
  },
  {
    id: "key-remap", region: 6, level: "middle",
    q: "Что такое key remapping в mapped types?",
    a: "Внутри mapped type после ключа можно написать `as` и задать новое имя ключа. Если новое имя получается `never`, поле пропадает. Так строят геттеры, имена обработчиков и фильтры полей по типу значения.",
    code: `type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };
type OnlyStrings<T> = { [K in keyof T as T[K] extends string ? K : never]: T[K] };
type t1 = Expect<Equal<Getters<{ name: string }>, { getName: () => string }>>;
type t2 = Expect<Equal<OnlyStrings<{ a: string; b: number }>, { a: string }>>;`,
  },
  {
    id: "deep-readonly", region: 6, level: "senior",
    q: "Напиши `DeepReadonly<T>`.",
    a: "Нужен рекурсивный mapped type: на каждом уровне поля получают `readonly`, а функции остаются как есть. Отдельно массивы обрабатывать не надо: mapped type по массиву сам даёт readonly-массив.",
    code: `type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : { readonly [K in keyof T]: DeepReadonly<T[K]> };
declare const x: DeepReadonly<{ a: { b: number[] } }>;
x.a.b = [];    // ошибка: вложенное поле тоже readonly
x.a.b.push(1); // ошибка: массив тоже readonly`,
  },
  {
    id: "route-params", region: 6, level: "senior",
    q: "Как на уровне типов достать имена параметров из маршрута `/users/:id/posts/:postId`?",
    a: "Рекурсивным template literal type с `infer`. Отрезаем всё до двоеточия, забираем имя до следующего слэша и тем же типом обрабатываем остаток строки.",
    code: `type Params<S extends string> = S extends \`\${string}:\${infer P}/\${infer Rest}\`
  ? P | Params<\`/\${Rest}\`>
  : S extends \`\${string}:\${infer P}\` ? P : never;
type t = Expect<Equal<Params<"/users/:id/posts/:postId">, "id" | "postId">>;`,
  },
  {
    id: "json-type", region: 6, level: "middle",
    q: "Как описать тип любого JSON-значения?",
    a: "Рекурсивным алиасом: строка, число, boolean, `null`, массив `Json` или объект со значениями `Json`. Функции, `undefined` и `Date` в такой тип не проходят.",
    code: `type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
const j: Json = { a: [1, "x", { b: null }] };
const bad: Json = { f: () => 1 }; // ошибка: функции нет в JSON`,
  },
  {
    id: "union-to-intersection", region: 6, level: "senior",
    q: "Как превратить union в пересечение?",
    a: "Каждый член union кладут в параметр функции, а потом выводят тип этого параметра через `infer`. Параметр находится в контравариантной позиции, и для нескольких кандидатов там TypeScript выводит пересечение.",
    code: `type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
type t = Expect<Equal<UnionToIntersection<{ a: 1 } | { b: 2 }>, { a: 1 } & { b: 2 }>>;`,
  },
  {
    id: "event-names", region: 6, level: "senior",
    q: "Как из ключей настроек `{ theme: string }` получить тип обработчиков вида `onThemeChanged`?",
    a: "Mapped type с key remapping и template literal. Для каждого ключа `K` имя строится как `on${Capitalize<K>}Changed`, а значение — функция, которая принимает тип этого поля.",
    code: `type Handlers<T> = { [K in keyof T as \`on\${Capitalize<string & K>}Changed\`]: (v: T[K]) => void };
type t = Expect<Equal<Handlers<{ theme: string }>, { onThemeChanged: (v: string) => void }>>;`,
  },

  // 8. Классы и модули
  {
    id: "const-enum", region: 7, level: "middle",
    q: "Что такое `const enum` и почему его стараются не использовать?",
    a: "Значения `const enum` подставляются прямо в код, объекта в JS не остаётся. Babel, SWC и esbuild компилируют каждый файл отдельно и не видят значений из другого файла. Поэтому при `isolatedModules` и в библиотеках вместо него пишут union и объект `as const`.",
    code: `const enum Dir { Up, Down }
const d = Dir.Up; // в JS будет const d = 0

const Direction = { Up: "up", Down: "down" } as const;
type Direction = (typeof Direction)[keyof typeof Direction]; // "up" | "down"`,
  },
  {
    id: "implements-extends", region: 7, level: "junior",
    q: "Чем `implements` отличается от `extends`?",
    a: "`extends` наследует реализацию и прототип родительского класса. `implements` только проверяет, что класс подходит под интерфейс. В класс он ничего не добавляет и типы параметров методов не выводит.",
    code: `interface Named { name: string; greet(msg: string): string }
class Base { id = 1; }
class User extends Base implements Named {
  name = "Ann";
  greet(msg: string) { return msg + ", " + this.name; }
}
new User().id; // унаследовано от Base
class Broken implements Named { name = "x"; } // ошибка: нет метода greet`,
  },
  {
    id: "private-hash", region: 7, level: "middle",
    q: "В чём разница между `private` и `#field`?",
    a: "`private` проверяет только компилятор. Во время выполнения это обычное свойство, и даже в TypeScript к нему можно обратиться через квадратные скобки. `#field` — приватное поле самого JavaScript, снаружи оно недоступно и во время работы программы.",
    code: `class Box1 { private secret = 1; #real = 2; }
const box = new Box1();
box.secret;                   // ошибка: свойство private
const leaked = box["secret"]; // через скобки TypeScript пропускает`,
  },
  {
    id: "protected", region: 7, level: "junior",
    q: "Чем `protected` отличается от `private`?",
    a: "`protected` доступен в самом классе и в его наследниках, `private` — только в самом классе. Снаружи класса недоступны оба.",
    code: `class A {
  protected p = 1;
  private q = 2;
}
class B extends A {
  read() {
    this.p;
    this.q; // ошибка: q доступен только внутри A
  }
}`,
  },
  {
    id: "param-props", region: 7, level: "junior",
    q: "Что делает конструктор `constructor(private x: number)`?",
    a: "Это parameter property: одна запись объявляет поле и присваивает ему значение параметра. Код короче, но такой синтаксис есть только в TypeScript. Флаг `erasableSyntaxOnly` его запрещает, потому что его нельзя просто стереть при компиляции.",
    code: `class Point {
  constructor(private x: number, public y: number) {}
  getX() { return this.x; }
}
new Point(1, 2).y;`,
  },
  {
    id: "abstract", region: 7, level: "middle",
    q: "Когда выбрать абстрактный класс, а когда интерфейс?",
    a: "Интерфейс описывает только форму и во время выполнения не существует. Абстрактный класс может дать общую реализацию и объявить абстрактные методы, которые наследники обязаны написать. Экземпляр абстрактного класса создать нельзя. Если общего кода нет, хватает интерфейса.",
    code: `abstract class Shape2 {
  abstract area(): number;
  describe() { return \`area: \${this.area()}\`; }
}
class Sq extends Shape2 { area() { return 4; } }
new Sq().describe();
new Shape2(); // ошибка: нельзя создать экземпляр абстрактного класса`,
  },
  {
    id: "import-type", region: 7, level: "middle",
    q: "Зачем нужен `import type`?",
    a: "Такой импорт гарантированно удаляется при компиляции. Это нужно инструментам, которые собирают файлы по одному (флаги `isolatedModules` и `verbatimModuleSyntax`): без пометки они не знают, импортирован тип или значение. Заодно в собранном коде не остаётся лишних импортов и циклических зависимостей.",
    code: `// import type { User } from "./user";
// import { type User, loadUser } from "./user";
type User = { name: string };
function greet(u: User) { return u.name; } // User нужен только как тип`,
  },
  {
    id: "dts", region: 7, level: "middle",
    q: "Что такое файл `.d.ts` и ключевое слово `declare`?",
    a: "Файл `.d.ts` содержит только типы для кода, который уже существует в JS: библиотеки или глобальные переменные. `declare` сообщает компилятору, что значение есть во время выполнения, и код для него не генерируется. Типы популярных пакетов лежат в `@types/*` из DefinitelyTyped.",
    code: `declare const API_URL: string;              // задаётся сборкой
declare function track(event: string): void; // функция из внешнего скрипта
track("open " + API_URL);`,
  },
  {
    id: "augmentation", region: 7, level: "senior",
    q: "Как дополнить типы сторонней библиотеки?",
    a: "Через module augmentation: в своём файле-модуле пишут `declare module \"lib\" { interface Options { extra: string } }`, и интерфейсы сливаются. Для глобальных типов есть `declare global`. Это работает благодаря declaration merging интерфейсов.",
    code: `declare global {
  interface Array<T> { last(): T | undefined }
}
const lastItem = [1, 2].last(); // number | undefined
export {};`,
  },
  {
    id: "namespace", region: 7, level: "middle",
    q: "Что такое `namespace` и нужен ли он в новом коде?",
    a: "Это способ группировать код, который появился до ES-модулей. Namespace компилируется в объект. В новом коде вместо него используют модули, а namespace встречается в `.d.ts` и для слияния с функцией или классом.",
    code: `function format(n: number) { return n.toFixed(2); }
namespace format {
  export const currency = "₽";
}
format(10) + format.currency;`,
  },
  {
    id: "decorators", region: 7, level: "middle",
    q: "Что такое декораторы в TypeScript?",
    a: "Декоратор — функция, которая оборачивает класс, метод или поле. С TypeScript 5.0 поддерживаются стандартные декораторы по предложению TC39. Старые включаются флагом `experimentalDecorators`, на них построены Angular, NestJS и TypeORM. Эти две системы между собой несовместимы.",
    code: `function logged<This, A extends unknown[], R>(
  fn: (this: This, ...args: A) => R,
  ctx: ClassMethodDecoratorContext<This, (this: This, ...args: A) => R>,
) {
  return function (this: This, ...args: A): R {
    console.log("вызов", String(ctx.name));
    return fn.apply(this, args);
  };
}
class Api {
  @logged
  load(id: number) { return id; }
}`,
  },

  // 9. Контракты
  {
    id: "api-response", region: 8, level: "middle",
    q: "Сервер вернул данные не той формы. Как типизировать ответ API без `any`?",
    a: "`response.json()` возвращает `Promise<any>`, и компилятор ничего не гарантирует. Ответ принимают как `unknown` и проверяют во время выполнения: схемой zod или valibot или своим type guard. Тип ответа выводят из схемы, чтобы не описывать его второй раз.",
    code: `type Todo = { id: number; title: string };

function isTodo(x: unknown): x is Todo {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "title" in x && typeof x.title === "string";
}

async function loadTodo(res: { json(): Promise<unknown> }): Promise<Todo> {
  const data = await res.json();
  if (!isTodo(data)) throw new Error("Неожиданный ответ сервера");
  return data;
}`,
  },
  {
    id: "catch-unknown", region: 8, level: "middle",
    q: "Почему у переменной в `catch (e)` тип `unknown`?",
    a: "В JS бросить можно что угодно, не только `Error`. Флаг `useUnknownInCatchVariables` входит в `strict`, и с ним `e` получает тип `unknown`. Перед использованием его сужают, например через `e instanceof Error`.",
    code: `try {
  JSON.parse("{");
} catch (e) {
  console.log(e.message); // ошибка: e имеет тип unknown
  if (e instanceof Error) console.log(e.message);
}`,
  },
  {
    id: "branded", region: 8, level: "senior",
    q: "Как в TypeScript получить номинальную типизацию?",
    a: "Через branded type: `string & { readonly __brand: \"UserId\" }`. Обычную строку туда передать нельзя, нужна функция, которая проверит значение и вернёт брендированный тип. Во время выполнения бренда нет, это обычная строка.",
    code: `type UserId = string & { readonly __brand: "UserId" };
const toUserId = (s: string) => s as UserId;
function loadUser(id: UserId) { return id; }
loadUser(toUserId("42"));
loadUser("42"); // ошибка: обычная строка не UserId`,
  },
  {
    id: "strict", region: 8, level: "middle",
    q: "Какие проверки включает флаг `strict` и каких в нём нет?",
    a: "`strict` включает `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `strictBuiltinIteratorReturn`, `noImplicitThis`, `useUnknownInCatchVariables` и `alwaysStrict`. В него не входят `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` и `noImplicitOverride`, их включают отдельно.",
    code: `// tsconfig.json
// { "compilerOptions": { "strict": true, "noUncheckedIndexedAccess": true } }
function len(s: string | null) {
  return s.length; // ошибка: strictNullChecks из strict
}`,
  },
  {
    id: "unchecked-index", region: 8, level: "middle",
    q: "Что делает флаг `noUncheckedIndexedAccess`?",
    a: "С ним чтение по index signature и по индексу массива даёт `T | undefined`. Так ловится обращение к элементу пустого массива. Флаг не входит в `strict`, его включают отдельно.",
    code: `const list: string[] = [];
const first = list[0]; // без флага string, с флагом string | undefined
first?.toUpperCase();`,
  },
  {
    id: "exact-optional", region: 8, level: "senior",
    q: "Что делает флаг `exactOptionalPropertyTypes`?",
    a: "С ним свойство `a?: string` нельзя явно заполнить значением `undefined`: ключа либо нет, либо в нём строка. Флаг нужен, если код различает «ключа нет» и «ключ есть со значением `undefined`», например через `in` или `Object.keys`.",
    code: `type Opts = { color?: string };
const a: Opts = {};
const b: Opts = { color: undefined }; // с флагом это ошибка, без флага можно
"color" in b;                         // true, хотя цвета нет`,
  },

  // 10. TS и React
  {
    id: "react-node", region: 9, level: "junior",
    q: "Чем отличаются `ReactNode`, `ReactElement` и `JSX.Element`?",
    a: "`ReactNode` — всё, что React умеет отрисовать: элементы, строки, числа, `null` и массивы. `ReactElement` — объект, который создаёт JSX. `JSX.Element` — такой же элемент с пропсами любого типа. Для `children` почти всегда берут `ReactNode`.",
    code: `// type Props = { children: React.ReactNode };
// <Card>текст</Card>, <Card>{42}</Card>, <Card>{null}</Card> подходят под ReactNode
// const el: React.ReactElement = <div />; — только элемент, строка не подойдёт
type NodeLike = string | number | boolean | null | undefined | NodeLike[];
const children: NodeLike = ["текст", 42, null];`,
  },
  {
    id: "react-events", region: 9, level: "junior",
    q: "Как типизировать обработчик `onChange` у input и `onSubmit` у формы?",
    a: "Для input — `ChangeEvent<HTMLInputElement>`, для формы — `FormEvent<HTMLFormElement>`, для кликов — `MouseEvent<HTMLButtonElement>`. Если обработчик написан прямо в JSX, тип события выводится сам. Для вынесенного обработчика удобен `ChangeEventHandler<HTMLInputElement>`.",
    code: `// const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
// const onSubmit = (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); };
// <input onChange={(e) => setName(e.target.value)} /> — тип e берётся из пропса onChange
type ChangeEvent<T> = { target: T };
const onChange = (e: ChangeEvent<{ value: string }>) => e.target.value.trim();`,
  },
  {
    id: "react-usestate", region: 9, level: "junior",
    q: "Когда у `useState` нужно явно указывать параметр типа?",
    a: "Когда начальное значение не описывает все будущие значения: `useState<User | null>(null)` или `useState<string[]>([])`. Без параметра TypeScript выведет тип из `null` или пустого массива, и записать туда пользователя или строки не получится.",
    code: `// const [user, setUser] = useState<User | null>(null);
// const [tags, setTags] = useState<string[]>([]);
// const [count, setCount] = useState(0); — тип number выводится сам
declare function useState<S>(initial: S): [S, (next: S) => void];
const [tags, setTags] = useState([]); // never[]
setTags(["react"]);                   // ошибка: string не присваивается в never`,
  },
  {
    id: "react-reducer", region: 9, level: "middle",
    q: "Как типизировать reducer, чтобы внутри `switch` тип `action` сужался по полю `type`?",
    a: "Действия описывают как discriminated union по полю `type`. Внутри `switch (action.type)` TypeScript сужает тип, и у каждого действия доступен свой `payload`. Если все варианты перечислены, функции не нужен `default`, а новое действие без обработки даст ошибку.",
    code: `type Action =
  | { type: "add"; payload: string }
  | { type: "remove"; payload: number }
  | { type: "clear" };
function reducer(state: string[], action: Action): string[] {
  switch (action.type) {
    case "add": return [...state, action.payload];
    case "remove": return state.filter((_, i) => i !== action.payload);
    case "clear": return [];
  }
}`,
  },
  {
    id: "react-useref", region: 9, level: "middle",
    q: "Как типизировать `useRef` для DOM-элемента и для обычного изменяемого значения?",
    a: "Для DOM-элемента пишут `useRef<HTMLInputElement>(null)`: `current` имеет тип `HTMLInputElement | null`, и заполнит его React. Для своего значения, например id таймера, пишут `useRef<number | null>(null)` или передают начальное число. В типах React 18 `useRef<T>(null)` давал `current` только для чтения, а в React 19 `useRef` всегда требует аргумент, и `current` можно менять.",
    code: `// const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current?.focus();
// const timer = useRef<number | null>(null);
// timer.current = window.setTimeout(tick, 1000);
type Ref<T> = { current: T };
const timer: Ref<number | null> = { current: null };
timer.current = 42;`,
  },
  {
    id: "react-context", region: 9, level: "middle",
    q: "Как сделать контекст, который не нужно каждый раз проверять на `undefined`?",
    a: "Контекст создают как `createContext<Value | undefined>(undefined)` и пишут свой хук, например `useAuth()`. Хук бросает ошибку, если провайдера нет, и возвращает `Value`. Компоненты пользуются хуком и сами `undefined` не проверяют.",
    code: `type Auth = { user: string };
declare function useContext<T>(ctx: { value: T }): T;
const AuthContext: { value: Auth | undefined } = { value: undefined };

function useAuth(): Auth {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth вызван вне AuthProvider");
  return auth;
}
useAuth().user; // без проверки на undefined`,
  },
  {
    id: "exclusive-props", region: 9, level: "senior",
    q: "Как запретить передать компоненту одновременно `href` и `onClick`?",
    a: "Описать пропсы как union вариантов. В каждом варианте пропсы другого варианта помечены как `?: never`. Тогда можно передать только один из них, а оба сразу дадут ошибку компиляции.",
    code: `type ButtonProps =
  | { href: string; onClick?: never }
  | { onClick: () => void; href?: never };
const link: ButtonProps = { href: "/" };
const both: ButtonProps = { href: "/", onClick: () => {} }; // ошибка: нельзя оба сразу`,
  },
  {
    id: "generic-component", region: 9, level: "middle",
    q: "Как написать дженерик-компонент, например `Select<T>`?",
    a: "Компонент объявляют функцией с параметром типа: `function Select<T>(props: SelectProps<T>)`. `T` выводится из пропса `items`, и `onChange` получает элемент того же типа. У стрелочной функции в `.tsx` пишут `<T,>`, чтобы парсер не принял параметр за JSX-тег.",
    code: `type SelectProps<T> = { items: T[]; getLabel(item: T): string; onChange(item: T): void };
function Select<T>(props: SelectProps<T>) {
  return props.items.map(props.getLabel).join(", ");
}
Select({
  items: [{ id: 1, name: "Ann" }],
  getLabel: (u) => u.name, // u выведен из items
  onChange: (u) => u.id,
});`,
  },
  {
    id: "component-props", region: 9, level: "middle",
    q: "Как принять все атрибуты `button` в своём компоненте и пробросить `ref`?",
    a: "Тип `ComponentProps<\"button\">` или `ComponentPropsWithoutRef<\"button\">` содержит все атрибуты кнопки, к нему добавляют свои пропсы. В React 19 `ref` передаётся функциональному компоненту как обычный проп, `forwardRef` не нужен. В React 18 такую обёртку делали через `forwardRef<HTMLButtonElement, Props>`.",
    code: `// type Props = React.ComponentProps<"button"> & { variant: "primary" | "ghost" };
// function Button({ variant, ...rest }: Props) { return <button {...rest} />; }
type ButtonAttrs = { type?: "button" | "submit"; disabled?: boolean };
type Props = ButtonAttrs & { variant: "primary" | "ghost" };
const p: Props = { variant: "ghost", type: "submit" };`,
  },
  {
    id: "polymorphic", region: 9, level: "senior",
    q: "Как типизировать полиморфный компонент `<Box as=\"a\" href=\"/\">`?",
    a: "Делают дженерик `C extends ElementType` и пропсы `{ as?: C } & Omit<ComponentPropsWithoutRef<C>, \"as\">`. Тогда при `as=\"a\"` доступен `href`, а при `as=\"button\"` — `type`. Сложнее всего типизировать `ref`, и такие типы заметно замедляют проверку.",
    code: `type Tags = { a: { href: string }; button: { type?: "button" | "submit" } };
type BoxProps<C extends keyof Tags> = { as: C } & Tags[C];
function Box<C extends keyof Tags>(props: BoxProps<C>) { return props.as; }
Box({ as: "a", href: "/" });
Box({ as: "button", href: "/" }); // ошибка: у button нет href`,
  },
  {
    id: "react-fc", region: 9, level: "junior",
    q: "Нужен ли тип `React.FC` для компонентов?",
    a: "Не обязателен. Раньше `FC` сам добавлял `children` в пропсы, с React 18 он этого не делает. Обычно компонент пишут как функцию с типизированными пропсами: так проще с дженериками и значениями по умолчанию.",
    code: `// const Card: React.FC<{ title: string }> = ({ title }) => <h2>{title}</h2>;
// function Card({ title }: { title: string }) { return <h2>{title}</h2>; }
type CardProps = { title: string; size?: "s" | "m" };
function Card({ title, size = "m" }: CardProps) { return \`\${title} \${size}\`; }`,
  },
  {
    id: "hoc", region: 9, level: "senior",
    q: "Как типизировать компонент высшего порядка (HOC)?",
    a: "HOC делают дженериком по пропсам исходного компонента: `withUser<P extends { user: User }>(C: ComponentType<P>): ComponentType<Omit<P, \"user\">>`. HOC сам передаёт `user`, поэтому из внешних пропсов его убирают. Сейчас HOC чаще заменяют хуками.",
    code: `type User = { name: string };
type Component<P> = (props: P) => string;
function withUser<P extends { user: User }>(C: Component<P>): Component<Omit<P, "user">> {
  return (props) => C({ ...props, user: { name: "Ann" } } as P);
}
const Hello = withUser((p: { user: User; greeting: string }) => p.greeting + p.user.name);
Hello({ greeting: "Привет, " });`,
  },

  // 11. Компилятор и проект
  {
    id: "tsc-babel", region: 10, level: "middle",
    q: "Чем `tsc` отличается от Babel, SWC и esbuild?",
    a: "`tsc` проверяет типы и создаёт `.js`-файлы. Babel, SWC и esbuild только удаляют типы без проверки, зато работают в разы быстрее. Поэтому код собирает бандлер, а `tsc --noEmit` запускают отдельно: в редакторе и в CI.",
    code: `// package.json
// "build": "vite build",       — сборка через бандлер, без проверки типов
// "typecheck": "tsc --noEmit"  — только проверка типов, файлы не пишутся
const answer: number = 42;`,
  },
  {
    id: "isolated-modules", region: 10, level: "middle",
    q: "Что делает флаг `isolatedModules`?",
    a: "Запрещает конструкции, которые нельзя скомпилировать, глядя только на один файл: реэкспорт типа без `export type` и обращение к `const enum` из другого файла. Флаг нужен, когда JS собирают Babel, SWC или esbuild. `verbatimModuleSyntax` строже: импорт с пометкой `type` удаляется, остальные остаются как написаны.",
    code: `// Ошибка при isolatedModules: транспилятор не знает, что User — тип
// export { User } from "./user";
// Правильно:
// export type { User } from "./user";
export type Id = string;`,
  },
  {
    id: "type-stripping", region: 10, level: "middle",
    q: "Как Node запускает файлы `.ts` без сборки?",
    a: "Современный Node удаляет типы из файла и выполняет получившийся JS, типы при этом не проверяются. Поддерживается только синтаксис, который можно просто стереть. `enum`, `namespace` с кодом и parameter properties не работают. Флаг `erasableSyntaxOnly` (TypeScript 5.8) запрещает их в проекте.",
    code: `// node app.ts
type User = { name: string };          // стирается
const u: User = { name: "Ann" };       // стирается аннотация
// enum Color { Red }                   — так нельзя: enum создаёт объект в JS
const Color = { Red: "red" } as const; // так можно`,
  },
  {
    id: "target-lib", region: 10, level: "junior",
    q: "Чем опция `target` отличается от опции `lib`?",
    a: "`target` задаёт, в какую версию JS компилировать синтаксис: классы, `?.`, `async`. `lib` задаёт, какие встроенные API описаны в типах: `Promise`, `Array.prototype.at`, DOM. Полифиллы `target` не добавляет: если `lib` разрешил `at()`, а браузер старый, код упадёт.",
    code: `// tsconfig: { "target": "ES2017", "lib": ["ES2022", "DOM"] }
const arr = [1, 2, 3];
// arr.at(-1): с lib ES2022 типы это разрешат, но в старом браузере метода нет
const x = arr?.[0];      // синтаксис ?. перепишется под ES2017`,
  },
  {
    id: "module-resolution", region: 10, level: "middle",
    q: "Что задают опции `module` и `moduleResolution`?",
    a: "`module` задаёт формат модулей в собранном коде: ESNext, CommonJS или NodeNext. `moduleResolution` задаёт, как искать импортируемые файлы. Для проектов на Vite и webpack подходит `bundler`. Для Node нужен `nodenext`: он учитывает поле `exports` в пакетах и требует расширения в относительных импортах.",
    code: `// Фронтенд с Vite:
// { "module": "ESNext", "moduleResolution": "bundler" }
// Node-сервис или библиотека:
// { "module": "NodeNext", "moduleResolution": "nodenext" }
// import { db } from "./db.js";  — с nodenext расширение обязательно
export {};`,
  },
  {
    id: "esmodule-interop", region: 10, level: "middle",
    q: "Зачем нужен флаг `esModuleInterop`?",
    a: "CommonJS-модуль экспортирует `module.exports`, а у ES-модуля экспорт `default`. Флаг добавляет вспомогательный код, чтобы `import express from \"express\"` работал, и включает `allowSyntheticDefaultImports`. Без него пришлось бы писать `import * as express from \"express\"`.",
    code: `// С esModuleInterop:
// import express from "express";
// Без него:
// import * as express from "express";
export {};`,
  },
  {
    id: "skip-lib-check", region: 10, level: "junior",
    q: "Что делает флаг `skipLibCheck`?",
    a: "Компилятор перестаёт проверять файлы `.d.ts`, в том числе из `node_modules`. Проверка идёт быстрее, и не мешают конфликты между пакетами `@types`. Минус в том, что ошибки в собственных `.d.ts` тоже не видны.",
    code: `// tsconfig: { "skipLibCheck": true }
// Ошибка в node_modules/@types/some-lib/index.d.ts больше не ломает сборку,
// но и ошибка в src/globals.d.ts тоже не будет найдена.
export {};`,
  },
  {
    id: "declaration-sourcemap", region: 10, level: "junior",
    q: "Зачем нужны опции `declaration`, `sourceMap` и `noEmit`?",
    a: "`declaration` создаёт рядом с `.js` файлы `.d.ts`, это нужно при публикации библиотеки. `sourceMap` связывает собранный JS с исходным TypeScript для отладки. `noEmit` оставляет только проверку типов, без создания файлов, так настраивают фронтенд, который собирает бандлер.",
    code: `// Библиотека: { "declaration": true, "sourceMap": true, "outDir": "dist" }
// Приложение:  { "noEmit": true }  — собирает Vite, tsc только проверяет
export {};`,
  },
  {
    id: "paths", region: 10, level: "middle",
    q: "Как настроить алиасы импортов вроде `@/components`?",
    a: "В tsconfig задают `paths`: `\"@/*\": [\"./src/*\"]`. TypeScript по ним только находит типы, а переписывать пути в собранном коде должен бандлер или среда запуска. Поэтому алиас нужно настроить и в Vite или webpack, или подключить плагин, который читает tsconfig.",
    code: `// tsconfig.json: { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
// vite.config.ts: resolve: { alias: { "@": "/src" } }
// import { Button } from "@/ui/Button";
export {};`,
  },
  {
    id: "project-references", region: 10, level: "senior",
    q: "Что такое project references?",
    a: "Репозиторий делят на проекты с `composite: true`, а связи между ними описывают в `references`. `tsc --build` собирает проекты по порядку и пересобирает только изменённые, это ускоряет большие монорепозитории. Состояние сборки хранится в файлах `.tsbuildinfo`.",
    code: `// packages/app/tsconfig.json
// { "compilerOptions": { "composite": true },
//   "references": [{ "path": "../shared" }] }
// Команда: tsc --build packages/app
export {};`,
  },
];

/** Короткие примеры для карточек из уроков: у самих уроков пример длиннее и рассчитан на песочницу. */
const LESSON_EXAMPLES: Record<string, string> = {
  b1: `const user = { name: "Ann" };
user.nmae; // ошибка: опечатка в имени свойства
// В скомпилированном JS аннотаций и интерфейсов нет,
// поэтому ответ сервера нужно проверять отдельно.`,
  b2: `declare const data: any;
const n: number = data.user.name; // компилируется, хотя там строка или undefined
function sum(a, b) {              // ошибка: неявный any у параметра a
  return a + b;
}`,
  b3: `const names = ["Ann", "Bob"];
names.forEach((s) => s.toUpperCase()); // s: string из контекста
function parseId(raw: string): number { // параметр и результат на границе модуля
  return Number(raw);
}`,
  b4: `type A = { name?: string };
type B = { name: string | undefined };
const a: A = {};
const b: B = {}; // ошибка: ключ name обязателен
const c: B = { name: undefined };`,
  b5: `function show(id: string | number) {
  id.toString();    // общий метод, можно
  id.toUpperCase(); // ошибка: у number нет toUpperCase
  if (typeof id === "string") id.toUpperCase();
}`,
  b6: `interface Box { width: number }
interface Box { height: number } // интерфейсы сливаются
const box: Box = { width: 1, height: 2 };

type Id = string | number;       // union можно только через type`,
  b7: `const raw: unknown = JSON.parse('"abc"');
const n = raw as number;             // проверки нет, n на деле строка
const s = "hi" as number;            // ошибка: типы не пересекаются
const t = "hi" as unknown as number; // компилируется, но тип неверный`,
  b8: `const req = { method: "GET" };            // method: string
const fixed = { method: "GET" } as const; // method: "GET"
enum Color { Red, Green }                  // в JavaScript станет объектом
type Mode = "light" | "dark";              // в JavaScript не останется ничего`,
  b9: `function len(s: string | null) {
  return s.length; // ошибка: s может быть null
}
function len2(s: string | null) {
  return s?.length ?? 0;
}`,
  b10: `type Point = { x: number; y: number };
const p3 = { x: 1, y: 2, z: 3 };
const a: Point = p3;                   // можно: лишние поля не мешают
const b: Point = { x: 1, y: 2, z: 3 }; // ошибка: лишнее поле в свежем литерале`,
  b11: `type Theme = { mode: "light" | "dark"; size: number };
const a: Theme = { mode: "dark", size: 14 };
const m1 = a.mode;       // "light" | "dark"
const b = { mode: "dark", size: 14 } satisfies Theme;
const m2 = b.mode;       // "dark"
const c = { mode: "blue", size: 14 } satisfies Theme; // ошибка: нет такого режима`,
  u1: `type Todo = { title: string; done?: boolean };
type Patch = Partial<Todo>; // все поля необязательны
type Full = Required<Todo>; // done стал обязательным
const t: Readonly<Todo> = { title: "a" };
t.title = "b";              // ошибка: поле только для чтения`,
  u2: `type Lang = "en" | "ru";
const hello: Record<Lang, string> = { en: "Hello", ru: "Привет" };
const bad: Record<Lang, string> = { en: "Hello" }; // ошибка: нет ru
const dict: Record<string, string> = {};           // как index signature`,
  u3: `type Todo = { id: number; title: string; done: boolean };
type Preview = Pick<Todo, "title">;
type Draft = Omit<Todo, "id">;
type Typo = Omit<Todo, "titel">; // опечатку Omit пропускает
type Bad = Pick<Todo, "titel">;  // ошибка: у Pick ключ проверяется`,
  u4: `type Ev = "click" | "keydown" | "focus";
type Keyboard = Exclude<Ev, "click" | "focus">;     // "keydown"
type Mouse = Extract<Ev, "click" | "scroll">;       // "click"
type Name = NonNullable<string | null | undefined>; // string`,
  u5: `function createUser(name: string, age: number) {
  return { name, age, createdAt: new Date() };
}
type User = ReturnType<typeof createUser>;
type Args = Parameters<typeof createUser>; // [name: string, age: number]`,
  u6: `async function load() {
  return [1, 2, 3];
}
type Data = Awaited<ReturnType<typeof load>>; // number[]

function pick<K extends string>(keys: K[], fallback: NoInfer<K>) {}
pick(["a", "b"], "c"); // ошибка: "c" не входит в K`,
  u7: `function greet(this: { name: string }, msg: string) {
  return msg + ", " + this.name;
}
type Ctx = ThisParameterType<typeof greet>;   // { name: string }
type Bound = OmitThisParameter<typeof greet>; // (msg: string) => string`,
  u8: `type Ev = "click" | "scroll";
type Handler = \`on\${Capitalize<Ev>}\`; // "onClick" | "onScroll"
type Upper = Uppercase<"get">;         // "GET"`,
  n1: `function f(x: string | null | undefined) {
  if (x === null) return;
  x; // string | undefined: === null убрал только null
  if (x != null) x.toUpperCase(); // string
}`,
  n2: `function isString(x: unknown): x is string {
  return typeof x === "string";
}
function isNumber(x: unknown): x is number {
  return true; // ошибки нет, хотя проверка неверная
}
const ids = [1, null, 3].filter((x) => x !== null); // number[]`,
  n3: `function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") throw new Error("Ожидалась строка");
}
function greet(name: unknown) {
  assertIsString(name);
  return name.toUpperCase(); // name: string до конца функции
}`,
  n4: `type RequestState =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };
const ok: RequestState = { status: "success", data: [] };
const bad: RequestState = { status: "loading", data: [] }; // ошибка: у loading нет data`,
  fg: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const s = first(["a", "b"]); // string | undefined
const n = first([1, 2]);     // number | undefined
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
longest(1, 2); // ошибка: у number нет length`,
  f4: `type Button = { label: string; onClick(this: Button): void };
declare const btn: Button;
btn.onClick();
const detached = btn.onClick;
detached(); // ошибка: this должен быть Button`,
  f8: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }
const onAnimal = (a: Animal) => {};
const onDog: (d: Dog) => void = onAnimal;              // можно
const bad: (a: Animal) => void = (d: Dog) => d.bark(); // ошибка`,
};

/**
 * Вопросы из уроков. Если такой же вопрос есть среди карточек выше, остаётся карточка:
 * её id уже может храниться в прогрессе.
 */
const CARD_QUESTIONS = new Set(CARDS.map((c) => c.q));
const LESSON_CARDS: Flashcard[] = LESSONS.filter((l) => !CARD_QUESTIONS.has(l.q)).map((l) => ({
  id: `lesson-${l.id}`,
  region: l.region,
  level: l.region === 0 ? "junior" : "middle",
  q: l.q,
  a: l.answer,
  code: LESSON_EXAMPLES[l.id],
}));

export const FLASHCARDS: Flashcard[] = [...LESSON_CARDS, ...CARDS];
