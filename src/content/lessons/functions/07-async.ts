import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f6",
  region: 2,
  title: "async и Promise<T>",
  q: "Какой тип возвращает async-функция и можно ли указать тип ошибки промиса?",
  answer: "Async-функция всегда возвращает `Promise<T>`, где `T` — тип из `return`. `await` разворачивает промис, а `Promise.all` сохраняет типы по позициям. Тип ошибки промиса задать нельзя: в `catch` приходит `unknown`, поэтому ожидаемые ошибки кладут в результат, например `Promise<Result<T, E>>`.",
  theory: {
    p: [
      "У async-функции результат всегда `Promise<T>`: даже `return 1` даёт `Promise<number>`. В аннотации пишут `Promise<number>`, просто `number` — ошибка.",
      "`await` разворачивает промис, вложенные промисы — полностью, как утилита `Awaited`. `Promise.all` с массивом-литералом возвращает кортеж: у каждой позиции свой тип.",
      "У `Promise` один параметр типа — для значения. Тип ошибки задать нельзя: `reject` принимает что угодно, а в `catch (e)` приходит `unknown`. Ожидаемые ошибки возвращают значением: `{ ok: false, error }`.",
      "Частая ошибка — забытый `await`: промис сравнивают с числом или читают у него поле. TypeScript это ловит. Вторая — `forEach` с async-колбэком: он не ждёт промисы, для этого есть `for...of` с `await` или `Promise.all`.",
    ],
    example: `async function getCount() {
  return 42;                  // Promise<number>
}

async function main() {
  const n = await getCount(); // number
  if (getCount() > 0) {}      // ошибка: забыли await

  const [a, b] = await Promise.all([getCount(), Promise.resolve("x")]);
  // a: number, b: string

  try {
    await getCount();
  } catch (e) {
    // e: unknown, тип ошибки промиса не описать
  }
}

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
async function load(): Promise<Result<number, "not-found">> {
  return { ok: false, error: "not-found" };
}`,
    keys: ["Async-функция возвращает `Promise<T>`.", "`await` разворачивает, `Promise.all` сохраняет кортеж.", "Тип ошибки промиса не описать — нужен результат-union."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `async function f() {
  return [1, 2];
}
const r = f();`,
      opts: ["number[]", "Promise<number[]>", "Promise<[number, number]>", "Promise<unknown>"],
      a: 1,
      why: "Без `await` вызов async-функции даёт промис. Литерал массива без `as const` — `number[]`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `async function main() {
  const r = await Promise.all([Promise.resolve(1), Promise.resolve("a")]);
}`,
      opts: ["(string | number)[]", "[number, string]", "Promise<[number, string]>", "[Promise<number>, Promise<string>]"],
      a: 1,
      why: "`Promise.all` с литералом массива выводит кортеж и разворачивает каждый промис, а `await` снимает внешний `Promise`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Здесь две ошибки: неверный тип результата async-функции и забытый `await`. Исправь обе.",
      code: `type User = { id: number; name: string };

async function fetchUser(id: number): User {
  return { id, name: "Ann" };
}

async function greet(id: number) {
  const user = fetchUser(id);
  return "Привет, " + user.name;
}`,
      tests: `type t1 = Expect<Equal<Awaited<ReturnType<typeof greet>>, string>>;
type t2 = Expect<Equal<ReturnType<typeof fetchUser>, Promise<User>>>;`,
      forbid: ["any", "as", "ignore"],
      must: ["async function greet(id: number)"],
      hint: "У async-функции тип результата — `Promise<...>`. А промис перед чтением поля нужно дождаться.",
      solution: `type User = { id: number; name: string };

async function fetchUser(id: number): Promise<User> {
  return { id, name: "Ann" };
}

async function greet(id: number) {
  const user = await fetchUser(id);
  return "Привет, " + user.name;
}`,
    },
  ],
};
