// Уровни региона «Болото союзов». Сгенерировано из прототипа, дальше правится вручную.
import { accessError, inError } from "../../sorter/logic";
import type { BossState, BossTransition, Check, Level, TsError } from "../../sorter/types";

const isObject = (v: unknown): v is object => typeof v === "object" && v !== null;
const prop = (v: unknown, key: string): unknown => (isObject(v) ? (v as Record<string, unknown>)[key] : undefined);

const typeOf = (p: string, t: string): Check => ({ c: `typeof ${p} === "${t}"`, n: { [t]: "yes" }, run: (v) => typeof v === t });
const hasKey = (k: string, member: string, p: string): Check => ({ c: `"${k}" in ${p}`, n: { [member]: "yes" }, run: (v) => isObject(v) && k in v });

const KINDS: Record<string, string> = { Circle: "circle", Square: "square", Triangle: "triangle" };
const kindIs = (lit: string, member: string | null): Check => ({
  c: `shape.kind === "${lit}"`,
  n: member ? { [member]: "yes" } : {},
  run: (v) => prop(v, "kind") === lit,
  error: (cur): TsError | null => {
    if (!cur.size) return { code: 2339, msg: "Property 'kind' does not exist on type 'never'." };
    if (member && cur.has(member)) return null;
    const ks = [...cur].map((m) => `"${KINDS[m]}"`).join(" | ");
    return { code: 2367, msg: `This comparison appears to be unintentional because the types '${ks}' and '"${lit}"' have no overlap.` };
  },
});

const idIs = (t: "string" | "number") => (st: BossState): BossTransition => {
  if (st.base === "any[]") return { st };
  if (st.base !== "hasId") return { error: accessError(st.base) };
  return { st: { ...st, id: st.id && st.id !== t ? "never" : t } };
};

export const LEVELS: Level[] = [
  {
    title: "Первый фильтр",
    fn: "handle",
    param: "value",
    paramType: "string | number",
    mode: "branch",
    slots: 1,
    members: ["string", "number"],
    task: "Задание: строки отправь в `shout`, числа в `format`.",
    debrief: "Внутри `if` тип сузился до `string`, а в `else` остался только `number`. Это control flow analysis: компилятор следит за проверками так же, как ты.",
    theory: {
      p: [
        "Union `A | B` значит: значение может быть любым из перечисленных типов. Пока ты не проверил, какой именно, TypeScript разрешает только то, что есть у всех вариантов сразу.",
        "Проверка `typeof` сужает тип: внутри ветки компилятор знает, что туда прошло, а в `else` остаётся всё остальное. Это называется control flow analysis — TypeScript читает условия так же, как ты.",
        "`typeof` различает только примитивы: \"string\", \"number\", \"boolean\", \"bigint\", \"symbol\", \"undefined\", \"function\" и \"object\".",
      ],
      example: `function fmt(x: string | number) {
  x.toFixed();           // ошибка: у string нет toFixed
  if (typeof x === "string") {
    return x.length;     // x: string
  }
  return x.toFixed(2);   // x: number
}`,
      keys: ["Union разрешает только то, что общее для всех вариантов.", "`typeof` сужает примитивы.", "В `else` остаётся union без отфильтрованных вариантов."],
    },
    decls: ["declare function shout(s: string): void;", "declare function format(n: number): void;"],
    balls: [
      { l: "\"hi\"", v: "hi", m: "string" },
      { l: "42", v: 42, m: "number" },
      { l: "\"ts\"", v: "ts", m: "string" },
      { l: "7", v: 7, m: "number" },
    ],
    exits: [
      { code: "shout(value)", need: "ждёт string", must: true, kind: "call", param: "string", accepts: ["string"] },
    ],
    final: { code: "format(value)", need: "ждёт number", must: true, kind: "call", param: "number", accepts: ["number"] },
    checks: [
      typeOf("value", "string"),
      typeOf("value", "number"),
      typeOf("value", "boolean"),
    ],
  },
  {
    title: "Ловушка falsy",
    fn: "show",
    param: "value",
    paramType: "string | number | null",
    mode: "branch",
    slots: 2,
    members: ["string", "number", "null"],
    task: "Задание: разведи `null`, строки и числа по своим функциям. Осторожно с `!value`.",
    debrief: "`!value` отправил бы `\"\"` и `0` туда же, куда `null`, и TypeScript это видит: в такой ветке тип остаётся `string | number | null`. Надёжно проверять `value === null`. А `typeof null === \"object\"` — старая странность JS, которую TypeScript знает и сужает до `null`.",
    theory: {
      p: [
        "Сужать можно и через truthiness: `if (value)` убирает `null` и `undefined`. Но falsy в JS ещё `\"\"`, `0`, `NaN` и `false` — они тоже не пройдут.",
        "TypeScript не делит `string` на пустые и непустые строки. Поэтому после `if (!value)` тип остаётся `string | number | null`: внутри может оказаться и `null`, и `\"\"`, и `0`.",
        "Для `null` надёжна явная проверка `value === null`. `value == null` ловит сразу `null` и `undefined` — редкий случай, когда нестрогое сравнение уместно. И историческая странность: `typeof null === \"object\"`, TypeScript её знает.",
      ],
      example: `function label(count: number | null) {
  if (!count) return "нет данных";  // 0 тоже сюда
  return count + " шт.";
}
label(0); // "нет данных" — баг

function labelFixed(count: number | null) {
  if (count === null) return "нет данных";
  return count + " шт.";            // count: number
}`,
      keys: ["`!value` ловит не только `null`, но и `\"\"`, `0`, `false`.", "Проверяй `null` явно.", "`typeof null === \"object\"`."],
    },
    decls: ["declare function empty(v: null): void;", "declare function shout(s: string): void;", "declare function format(n: number): void;"],
    balls: [
      { l: "\"hi\"", v: "hi", m: "string" },
      { l: "\"\"", v: "", m: "string" },
      { l: "42", v: 42, m: "number" },
      { l: "0", v: 0, m: "number" },
      { l: "null", v: null, m: "null" },
    ],
    exits: [
      { code: "empty(value)", need: "ждёт null", must: true, kind: "call", param: "null", accepts: ["null"] },
      { code: "shout(value)", need: "ждёт string", must: true, kind: "call", param: "string", accepts: ["string"] },
    ],
    final: { code: "format(value)", need: "ждёт number", must: true, kind: "call", param: "number", accepts: ["number"] },
    checks: [
      { c: "value === null", n: { null: "yes" }, run: (v) => v === null },
      { c: "!value", n: { null: "yes", string: "both", number: "both" }, run: (v) => !v, tag: "falsy" },
      typeOf("value", "string"),
      { c: 'typeof value === "object"', n: { null: "yes" }, run: (v) => typeof v === "object", tag: "typeofnull" },
      typeOf("value", "number"),
    ],
  },
  {
    title: "Кто в коробке",
    fn: "play",
    param: "pet",
    paramType: "Cat | Dog | Fish",
    mode: "branch",
    slots: 2,
    members: ["Cat", "Dog", "Fish"],
    task: "Задание: каждый питомец должен попасть к своему методу.",
    debrief: "`in` сузил `Cat | Dog | Fish` по наличию метода. `instanceof` тут не работает: интерфейсы существуют только в типах и исчезают после компиляции, проверять во время работы программы нечего.",
    theory: {
      p: [
        "Для объектов `typeof` всегда даёт \"object\", поэтому различать их приходится по форме. Оператор `\"key\" in obj` проверяет наличие свойства, и TypeScript оставляет в union только варианты, где это свойство объявлено.",
        "`instanceof` проверяет цепочку прототипов, значит, ему нужен класс, который существует во время работы программы. Интерфейсы и type alias стираются при компиляции, поэтому `pet instanceof Dog` для интерфейса — ошибка.",
        "Если формы отличаются неочевидно, надёжнее добавить явную метку в каждый вариант. Это тема следующего уровня.",
      ],
      example: `interface Cat { meow(): void }
interface Dog { bark(): void }

function talk(pet: Cat | Dog) {
  if ("meow" in pet) {
    pet.meow();   // pet: Cat
  } else {
    pet.bark();   // pet: Dog
  }
}`,
      keys: ["`in` сужает union по наличию свойства.", "`instanceof` работает только с классами.", "Типы удаляются при компиляции, во время работы их нет."],
    },
    decls: ["interface Cat { meow(): void }", "interface Dog { bark(): void }", "interface Fish { swim(): void }"],
    balls: [
      { l: "{ meow }", v: { meow() {} }, m: "Cat" },
      { l: "{ bark }", v: { bark() {} }, m: "Dog" },
      { l: "{ swim }", v: { swim() {} }, m: "Fish" },
      { l: "{ bark }", v: { bark() {} }, m: "Dog" },
    ],
    exits: [
      { code: "pet.meow()", need: "нужен .meow()", must: true, kind: "method", method: "meow", accepts: ["Cat"] },
      { code: "pet.bark()", need: "нужен .bark()", must: true, kind: "method", method: "bark", accepts: ["Dog"] },
    ],
    final: { code: "pet.swim()", need: "нужен .swim()", must: true, kind: "method", method: "swim", accepts: ["Fish"] },
    checks: [
      hasKey("meow", "Cat", "pet"),
      hasKey("bark", "Dog", "pet"),
      hasKey("swim", "Fish", "pet"),
      { c: "pet instanceof Dog", run: () => false, error: () => ({ code: 2693, msg: "'Dog' only refers to a type, but is being used as a value here." }) },
      { c: 'typeof pet === "object"', n: { Cat: "yes", Dog: "yes", Fish: "yes" }, run: (v) => typeof v === "object" },
    ],
  },
  {
    title: "Ничего не забыть",
    fn: "area",
    param: "shape",
    paramType: "Shape",
    mode: "branch",
    slots: 3,
    members: ["Circle", "Square", "Triangle"],
    task: "Задание: разложи фигуры по функциям площади так, чтобы до `assertNever` не дошло ничего.",
    debrief: "Добавь завтра в `Shape` шестиугольник — и `assertNever` сразу покажет ошибку в месте, которое нужно дописать. Это exhaustive check. Повторная проверка того же `kind` тоже даёт ошибку: TypeScript знает, что этот вариант уже отфильтрован.",
    theory: {
      p: [
        "Discriminated union — это union объектов с общим полем-меткой литерального типа: `kind`, `type`, `status`. Проверил метку — получил точный вариант.",
        "`never` — пустой тип, у него нет значений. Когда все варианты union разобраны, в оставшейся ветке тип становится `never`.",
        "На этом построен exhaustive check: функция `assertNever(x: never)` в конце. Если кто-то добавит новый вариант, он попадёт в эту ветку, и компилятор покажет ошибку ровно там, где нужно дописать обработку.",
        "Так моделируют состояния загрузки, экшены редьюсеров и ответы API: невозможные комбинации полей становятся непредставимыми.",
      ],
      example: `type State =
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function view(s: State) {
  switch (s.status) {
    case "loading": return "...";
    case "success": return s.data.join();
    case "error":   return s.error.message;
    default:        return assertNever(s);
  }
}`,
      keys: ["Общая литеральная метка даёт точное сужение.", "`never` в конце значит: все варианты разобраны.", "Новый вариант в union сразу подсветит недописанные места."],
    },
    decls: ["type Circle = { kind: \"circle\"; radius: number };", "type Square = { kind: \"square\"; side: number };", "type Triangle = { kind: \"triangle\"; base: number; height: number };", "type Shape = Circle | Square | Triangle;", "declare function circleArea(s: Circle): number;", "declare function squareArea(s: Square): number;", "declare function triangleArea(s: Triangle): number;", "declare function assertNever(x: never): never;"],
    balls: [
      { l: "circle", v: { kind: "circle", radius: 2 }, m: "Circle" },
      { l: "square", v: { kind: "square", side: 3 }, m: "Square" },
      { l: "triangle", v: { kind: "triangle", base: 2, height: 4 }, m: "Triangle" },
      { l: "circle", v: { kind: "circle", radius: 5 }, m: "Circle" },
    ],
    exits: [
      { code: "circleArea(shape)", need: "ждёт Circle", must: true, kind: "call", param: "Circle", accepts: ["Circle"] },
      { code: "squareArea(shape)", need: "ждёт Square", must: true, kind: "call", param: "Square", accepts: ["Square"] },
      { code: "triangleArea(shape)", need: "ждёт Triangle", must: true, kind: "call", param: "Triangle", accepts: ["Triangle"] },
    ],
    final: { code: "assertNever(shape)", need: "ждёт never, сюда ничего не должно дойти", must: false, kind: "call", param: "never", accepts: "never" },
    checks: [
      kindIs("circle", "Circle"),
      kindIs("square", "Square"),
      kindIs("triangle", "Triangle"),
      { c: '"radius" in shape', n: { Circle: "yes" }, run: (v) => isObject(v) && "radius" in v },
      kindIs("hexagon", null),
    ],
  },
  {
    title: "Объект объекту рознь",
    fn: "render",
    param: "value",
    paramType: "string | string[] | Date",
    mode: "branch",
    slots: 2,
    members: ["string", "string[]", "Date"],
    task: "Задание: массив к `join`, дату к `toISOString`, строки к `toUpperCase`.",
    debrief: "`typeof value === \"object\"` отправил бы в одну ветку и массив, и дату. Для классов подходит `instanceof`, для массивов `Array.isArray`, и TypeScript сужает тип после обоих.",
    theory: {
      p: [
        "`typeof` вернёт \"object\" для массивов, дат, `null` и любых объектов. Поэтому `typeof x === \"object\"` почти никогда не та проверка, которая нужна.",
        "`Array.isArray(x)` — стандартная проверка массива, TypeScript по ней сужает. Для экземпляров классов (`Date`, `Map`, `Error`, свои классы) подходит `instanceof`.",
        "Каждая проверка вычитает варианты из union, поэтому порядок влияет на то, что остаётся дальше.",
      ],
      example: `function show(v: string | string[] | Date) {
  if (Array.isArray(v)) return v.join(", ");     // string[]
  if (v instanceof Date) return v.toISOString(); // Date
  return v.toUpperCase();                        // string
}`,
      keys: ["`typeof \"object\"` ловит слишком много.", "Массивы проверяют `Array.isArray`.", "Классы проверяют `instanceof`."],
    },
    decls: ["// value приходит из формы, API или кеша"],
    balls: [
      { l: "\"hi\"", v: "hi", m: "string" },
      { l: "[\"a\",\"b\"]", v: ["a", "b"], m: "string[]" },
      { l: "Date", v: new Date(), m: "Date" },
      { l: "\"ok\"", v: "ok", m: "string" },
    ],
    exits: [
      { code: "value.join(\", \")", need: "нужен .join()", must: true, kind: "method", method: "join", accepts: ["string[]"] },
      { code: "value.toISOString()", need: "нужен .toISOString()", must: true, kind: "method", method: "toISOString", accepts: ["Date"] },
    ],
    final: { code: "value.toUpperCase()", need: "нужен .toUpperCase()", must: true, kind: "method", method: "toUpperCase", accepts: ["string"] },
    checks: [
      { c: "Array.isArray(value)", n: { "string[]": "yes" }, run: (v) => Array.isArray(v) },
      { c: "value instanceof Date", n: { Date: "yes" }, run: (v) => v instanceof Date },
      { c: 'typeof value === "object"', n: { "string[]": "yes", Date: "yes" }, run: (v) => typeof v === "object" },
      typeOf("value", "string"),
    ],
  },
  {
    title: "Граница",
    fn: "receive",
    param: "input",
    paramType: "unknown",
    mode: "guard",
    slots: 4,
    boss: true,
    members: [],
    task: "Задание: пропусти к `saveId` только объект со строковым `id`, остальное отбракуй. Порядок проверок важен.",
    debrief: "Ты вручную сделал то, что делают zod и valibot: превратил `unknown` в проверенные данные. В реальном коде такие проверки выносят в отдельную функцию или в схему валидации, но логика та же.",
    theory: {
      p: [
        "`unknown` — безопасный «что угодно»: с ним нельзя ничего сделать, пока не сузишь. Это правильный тип для данных из сети, `JSON.parse`, `localStorage` и `catch (e)`.",
        "Сужать `unknown` до объекта приходится по шагам: `typeof x === \"object\"` оставляет `object | null`, `x !== null` даёт `object`, и только потом можно спросить `\"id\" in x` и проверить тип поля.",
        "Главная опасность — `any`. `JSON.parse` и `res.json()` возвращают `any`, а `Array.isArray` на `unknown` даёт `any[]`. С `any` компилятор молча перестаёт проверять.",
        "Проверки соединяют через `&&` и идут слева направо: каждая следующая уже видит тип, суженный предыдущими. Если поменять порядок, компилятор выдаст ошибку.",
      ],
      example: `declare function saveId(id: string): void;

function handle(data: unknown) {
  if (typeof data === "object" && data !== null
    && "id" in data && typeof data.id === "string") {
    saveId(data.id); // data.id: string
  }
}`,
      keys: ["Внешние данные — это `unknown`, а не `any`.", "Сначала объект, потом не `null`, потом поле.", "`any` отключает проверки молча."],
    },
    decls: ["declare function reject(x: unknown): void;", "declare function saveId(id: string): void;"],
    balls: [
      { l: "\"hi\"", v: "hi", m: "string" },
      { l: "42", v: 42, m: "number" },
      { l: "null", v: null, m: "null" },
      { l: "[\"a\"]", v: ["a"], m: "arr" },
      { l: "{ name }", v: { name: "Ann" }, m: "obj" },
      { l: "{ id: 7 }", v: { id: 7 }, m: "idn" },
      { l: "{ id: \"u1\" }", v: { id: "u1" }, m: "ids" },
    ],
    exits: [
      { code: "reject(input)", need: "отбраковка", must: false },
      { code: "reject(input)", need: "отбраковка", must: false },
      { code: "reject(input)", need: "отбраковка", must: false },
      { code: "reject(input)", need: "отбраковка", must: false },
    ],
    final: { code: "saveId(input.id)", need: "ждёт string", must: true },
    checks: [
      { c: 'typeof input === "object"', run: (v) => typeof v === "object", tx: (st) => ({ st: { ...st, base: st.base === "unknown" ? "object | null" : st.base === "{}" ? "object" : st.base } }) },
      { c: "input !== null", run: (v) => v !== null, tx: (st) => ({ st: { ...st, base: st.base === "unknown" ? "{}" : st.base === "object | null" ? "object" : st.base } }) },
      { c: '"id" in input', run: (v) => isObject(v) && "id" in v, tx: (st) => st.base === "object" || st.base === "hasId" ? { st: { ...st, base: "hasId" } } : st.base === "any[]" ? { st } : { error: inError(st.base) } },
      { c: 'typeof input.id === "string"', run: (v) => typeof prop(v, "id") === "string", tx: idIs("string") },
      { c: "Array.isArray(input)", run: (v) => Array.isArray(v), tx: () => ({ st: { base: "any[]", id: null } }), tag: "any" },
      { c: 'typeof input.id === "number"', run: (v) => typeof prop(v, "id") === "number", tx: idIs("number") },
    ],
  },
];
