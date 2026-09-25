import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct3",
  region: 8,
  title: "unknown в catch",
  q: "Почему в `catch (e)` тип `unknown` и как с ним работать?",
  answer: "Бросить в JavaScript можно что угодно — не только `Error`, но и строку, число, объект. Поэтому с TypeScript 4.4 в строгом режиме (`useUnknownInCatchVariables`) переменная в `catch` имеет тип `unknown`, и прежде чем читать `e.message`, её сужают: `e instanceof Error`. Удобно вынести это в функцию `getMessage(e: unknown): string`. Подвох: в колбэке `.catch((err) => …)` у промиса параметр по-прежнему `any`, там проверку никто не потребует.",
  theory: {
    p: [
      "`throw \"ошибка\"`, `throw 404`, `throw { code: 1 }` — всё это допустимо в JavaScript, а сторонняя библиотека может бросить что угодно. Поэтому считать, что в `catch` всегда `Error`, нельзя.",
      "До TypeScript 4.4 `e` в `catch` был `any`, и `e.message` компилировалось всегда. Флаг `useUnknownInCatchVariables`, входящий в `strict`, сделал его `unknown`. Теперь нужно сузить: `if (e instanceof Error) e.message`, для строк — `typeof e === \"string\"`.",
      "Удобный приём — одна функция на весь проект: `getMessage(e: unknown): string`. Она проверяет `Error`, строку, объект с полем `message` и возвращает запасной текст. Для запросов часто заводят свой класс ошибки с кодом ответа и проверяют его через `instanceof`.",
      "Подвох промисов: в `promise.catch((err) => …)` и во втором аргументе `then` параметр объявлен в библиотеке как `any`, поэтому флаг на него не действует. Там аннотируют явно: `.catch((err: unknown) => …)`. Результат `Promise.reject(1).catch(err => err)` — `Promise<any>`.",
    ],
    example: `function getMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "Неизвестная ошибка";
}

try {
  JSON.parse("{");
} catch (e) {
  console.log(e.message);          // ошибка: e — unknown
  console.log(getMessage(e));
}

fetch("/api").catch((err: unknown) => getMessage(err)); // в .catch аннотируем сами`,
    keys: ["Бросить можно что угодно, поэтому `e` в `catch` — `unknown` (флаг `useUnknownInCatchVariables` в `strict`).", "Сужают через `instanceof Error` и `typeof`, удобно — одна функция `getMessage(e: unknown)`.", "В `.catch((err) => …)` у промиса `err` — `any`: аннотируй `unknown` вручную."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `p`?",
      probe: "p",
      code: `const p = Promise.reject(1).catch((err) => err);`,
      opts: ["Promise<any>", "Promise<unknown>", "Promise<number>", "Promise<never>"],
      a: 0,
      why: "Параметр колбэка `.catch` объявлен как `any`, флаг `useUnknownInCatchVariables` действует только на `catch` в `try`.",
    },
    {
      type: "quiz",
      q: "Почему `catch (e)` даёт `unknown`, а не `Error`?",
      opts: ["Бросить можно любое значение: строку, число, объект", "Так быстрее компилируется", "`Error` не существует в TypeScript", "Это ошибка компилятора"],
      a: 0,
      why: "Компилятор не может знать, что бросит вызванный код, особенно сторонний.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Функция не компилируется, потому что `e` — `unknown`. Верни `e.message` для ошибок `Error` и `\"Неизвестная ошибка\"` для всего остального.",
      code: `function safeParse(json: string): string {
  try {
    JSON.parse(json);
    return "ok";
  } catch (e) {
    return e.message;
  }
}`,
      runtime: [["safeParse('{') === 'ok'", "false"], ["typeof safeParse('{')", "\"string\""], ["safeParse('{}')", "\"ok\""]],
      forbid: ["any", "as", "ignore"],
      hint: "Внутри `catch`: `if (e instanceof Error) return e.message; return \"Неизвестная ошибка\";`.",
      solution: `function safeParse(json: string): string {
  try {
    JSON.parse(json);
    return "ok";
  } catch (e) {
    if (e instanceof Error) return e.message;
    return "Неизвестная ошибка";
  }
}`,
    },
  ],
};
