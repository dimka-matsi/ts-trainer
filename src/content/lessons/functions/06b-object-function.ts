import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "fo",
  region: 2,
  title: "Типы object и Function",
  q: "Чем тип `Function` хуже `() => void` и что означает тип `object`?",
  answer: "`object` с маленькой буквы — любое значение, кроме примитивов: объект, массив, функция. `Function` — тип любой функции, но вызов такой функции ничего не проверяет и возвращает `any`. Поэтому вместо `Function` пишут конкретную сигнатуру, например `() => void`, или дженерик.",
  theory: {
    p: [
      "Тип `object` принимает всё, что не примитив: объекты, массивы, функции. Строку, число, `boolean`, `null` и `undefined` передать нельзя. Он подходит, когда функции нужен именно объект, а его форма не важна.",
      "Тип `Function` описывает любую функцию. Проблема в том, что при вызове TypeScript не проверяет аргументы, а результат получает тип `any`. Из-за этого ошибки проходят дальше незаметно.",
      "Вместо `Function` пишут сигнатуру: `() => void`, `(x: number) => string`. Если функция может вернуть что угодно, а результат нужен дальше, помогает дженерик: `run<T>(fn: () => T): T`.",
      "В Handbook эти типы разобраны в разделе Other Types to Know About вместе с `void`, `unknown` и `never`, о которых уже были уроки.",
    ],
    example: `function keys(o: object) {
  return Object.keys(o);
}
keys({ a: 1 });
keys([1, 2]);
keys(42);                   // ошибка: число — примитив

function call(fn: Function) {
  return fn(1, 2, 3);       // компилируется, аргументы не проверяются
}
const r = call(() => "x");  // r: any

function callSafe(fn: () => string) {
  return fn();              // string
}`,
    keys: ["`object` — любое значение, кроме примитивов.", "Вызов значения типа `Function` возвращает `any`.", "Вместо `Function` пиши сигнатуру или дженерик."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function run(fn: Function) {
  return fn();
}
const r = run(() => 42);`,
      opts: ["any", "number", "unknown", "Function"],
      a: 0,
      why: "Про значение типа `Function` известно только, что его можно вызвать. Результат такого вызова — `any`, и то, что передали `() => 42`, уже не учитывается.",
    },
    {
      type: "quiz",
      q: "Какое значение нельзя передать в параметр типа `object`?",
      opts: ["`\"текст\"`", "`[1, 2, 3]`", "`() => 1`", "`{ id: 1 }`"],
      a: 0,
      why: "Строка — примитив. Массивы и функции в JavaScript тоже объекты, поэтому они подходят.",
      example: `function keep(o: object) { return o; }
keep([1, 2, 3]);
keep(() => 1);
keep({ id: 1 });
keep("текст"); // ошибка: строка — примитив`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`retry` вызывает функцию несколько раз, пока она не сработает. Из-за типа `Function` результат `n` получился `any`. Опиши параметр так, чтобы `retry` возвращала тот же тип, что и переданная функция.",
      code: `function retry(action: Function, times: number) {
  for (let i = 0; i < times; i++) {
    try {
      return action();
    } catch {}
  }
  throw new Error("не получилось");
}

const n = retry(() => 42, 3);`,
      tests: `type t1 = Expect<Equal<typeof n, number>>;`,
      runtime: [["retry(() => 7, 2)", "7"]],
      forbid: ["any", "as", "ignore", { re: "\\bFunction\\b", msg: "Без типа `Function`" }],
      must: ["const n = retry(() => 42, 3);"],
      hint: "Дженерик: `function retry<T>(action: () => T, times: number): T`.",
      solution: `function retry<T>(action: () => T, times: number): T {
  for (let i = 0; i < times; i++) {
    try {
      return action();
    } catch {}
  }
  throw new Error("не получилось");
}

const n = retry(() => 42, 3);`,
    },
  ],
};
