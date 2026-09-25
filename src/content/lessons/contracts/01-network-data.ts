import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct1",
  region: 8,
  title: "Данные из сети: unknown и проверка",
  q: "Сервер вернул не ту форму данных. Как типизировать ответ API без `any` и не соврать компилятору?",
  answer: "`res.json()` и `JSON.parse` возвращают `any`, поэтому TypeScript поверит любой аннотации: `const user: User = await res.json()` скомпилируется, даже если сервер прислал ошибку. Правильно — сразу превратить ответ в `unknown` и проверить его функцией-предикатом `isUser(x): x is User` или схемой валидации. Проверка во время работы программы — единственное, что связывает тип с реальностью: типы на границе с сетью, `localStorage` и пользовательским вводом — это обещание, которое нужно проверить.",
  theory: {
    p: [
      "TypeScript проверяет код, а не данные. Внутри программы типы надёжны, но на границе — ответ сервера, `localStorage`, `postMessage`, пользовательский ввод — приходит то, что пришло. Стандартные функции для этих данных возвращают `any`: `res.json()`, `JSON.parse`. А `any` молча присваивается во что угодно, поэтому `const user: User = await res.json()` — это не проверка, а надежда.",
      "Правило границы: превратить `any` в `unknown` сразу при получении — `const data: unknown = await res.json()`. С `unknown` ничего нельзя сделать без проверки, и компилятор сам заставит её написать.",
      "Проверка — функция-предикат `isUser(x: unknown): x is User`: `typeof`, `in` и проверка типа каждого поля. После `if (!isUser(data)) throw …` дальше `data` — `User`. Риск тот же, что у любого предиката: TypeScript верит телу функции, поэтому проверять нужно честно, каждое поле.",
      "Где проверять — один раз, на входе: в функции загрузки, а не в каждом компоненте. Внутри приложения уже можно доверять типам. Проверки вручную быстро разрастаются, поэтому в реальных проектах берут библиотеки схем — о них следующий урок.",
    ],
    example: `type User = { id: number; name: string };

function isUser(x: unknown): x is User {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "name" in x && typeof x.name === "string";
}

async function loadUser(id: number): Promise<User> {
  const res = await fetch("/api/users/" + id);
  const data: unknown = await res.json();   // any сразу превращаем в unknown
  if (!isUser(data)) throw new Error("Сервер вернул не пользователя");
  return data;
}

const raw: unknown = JSON.parse("{}");
raw.name;                                   // ошибка: сначала проверь`,
    keys: ["`res.json()` и `JSON.parse` возвращают `any`: аннотация на них — надежда, а не проверка.", "На границе превращай `any` в `unknown` и проверяй предикатом или схемой.", "Проверяют один раз при получении, дальше внутри приложения типам можно доверять."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `data`?",
      probe: "data",
      code: `async function load() {
  const res = await fetch("/api/user");
  const data = await res.json();
  return data;
}`,
      opts: ["any", "unknown", "Response", "object"],
      a: 0,
      why: "`json()` объявлен как `Promise<any>`. Поэтому ответ без аннотации — `any`, и проверок нет вообще.",
    },
    {
      type: "quiz",
      q: "Чем опасна запись `const user: User = await res.json()`?",
      opts: ["`json()` возвращает `any`, и компилятор примет любые данные без проверки", "Она не скомпилируется", "Она замедляет запрос", "Ничем: аннотация проверяет данные"],
      a: 0,
      why: "Аннотация на `any` ничего не проверяет. Если сервер вернёт ошибку, код упадёт позже и в другом месте.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши предикат `isProduct`: `true`, только если значение — объект с числовым `id` и строковым `title`.",
      code: `type Product = { id: number; title: string };

function isProduct(x: unknown): x is Product {
  return true;
}`,
      tests: `declare const v: unknown;
if (isProduct(v)) {
  const t: string = v.title;
}`,
      runtime: [
        ["isProduct({ id: 1, title: 'Чайник' })", "true"],
        ["isProduct({ id: '1', title: 'Чайник' })", "false"],
        ["isProduct(null)", "false"],
        ["isProduct({ id: 1 })", "false"],
      ],
      forbid: ["any", "as", "ignore"],
      hint: "Проверь `typeof x === \"object\"`, `x !== null`, а для каждого поля — `\"id\" in x && typeof x.id === \"number\"`.",
      solution: `type Product = { id: number; title: string };

function isProduct(x: unknown): x is Product {
  return typeof x === "object" && x !== null
    && "id" in x && typeof x.id === "number"
    && "title" in x && typeof x.title === "string";
}`,
    },
  ],
};
