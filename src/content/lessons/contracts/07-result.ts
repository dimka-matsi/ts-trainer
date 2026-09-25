import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct7",
  region: 8,
  title: "Result вместо исключений",
  q: "Как типизировать ошибки? Почему иногда возвращают `Result<T, E>`, а не бросают исключение?",
  answer: "Исключения не видны в типах: по сигнатуре `parseAge(s): number` не скажешь, что функция может упасть, и компилятор не заставит обработать ошибку. `Result<T, E>` — discriminated union `{ ok: true; value: T } | { ok: false; error: E }` — делает ошибку частью результата: чтобы добраться до `value`, нужно проверить `ok`, а тип `E` описывает, какие ошибки бывают. Так обрабатывают ожидаемые ошибки: неверный ввод, «не найдено», отказ валидации. Для настоящих сбоев — сломанной сети, багов — исключения остаются.",
  theory: {
    p: [
      "В TypeScript нет `throws` в сигнатуре, как в Java: компилятор не знает, какие функции бросают исключения. Поэтому забытый `try/catch` — ошибка, которую находишь только во время работы.",
      "`type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }`. Функция возвращает либо успех со значением, либо неудачу с ошибкой. Поле `ok` — метка discriminated union: после `if (r.ok)` TypeScript знает, что есть `value`, а в `else` — `error`. Прочитать `value` без проверки нельзя.",
      "Тип ошибки можно сделать точным: `Result<User, \"not_found\" | \"forbidden\">`. Тогда обработка по `switch (r.error)` с проверкой `never` не забудет ни одного случая. Это та же идея, что и в состоянии запроса loading / success / error.",
      "Когда что. Ожидаемые ошибки, которые вызывающий должен обработать, — `Result`: неверный ввод, валидация, бизнес-отказы. Непредвиденные сбои — исключения: их всё равно обрабатывают на верхнем уровне. Библиотеки вроде neverthrow и Effect развивают этот подход, но простой union покрывает большинство случаев.",
    ],
    example: `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

function parseAge(s: string): Result<number> {
  const n = Number(s);
  if (!Number.isInteger(n) || n < 0) return { ok: false, error: "Возраст — целое число" };
  return { ok: true, value: n };
}

const r = parseAge("42");
if (r.ok) console.log(r.value + 1);
else console.log(r.error);
console.log(r.value);            // ошибка: сначала проверь ok`,
    keys: ["Исключения не видны в сигнатуре, компилятор не заставит их обработать.", "`Result<T, E>` — discriminated union по полю `ok`: до `value` не добраться без проверки.", "`Result` — для ожидаемых ошибок, исключения — для непредвиденных сбоев."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `e` внутри ветки `if (!r.ok)`?",
      probe: "e",
      code: `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };
declare const r: Result<number, "empty" | "nan">;
if (!r.ok) {
  const e = r.error;
}`,
      opts: ["\"empty\" | \"nan\"", "string", "unknown", "never"],
      a: 0,
      why: "Проверка `ok` сузила union до варианта неудачи, а тип ошибки задан точно.",
    },
    {
      type: "quiz",
      q: "Чем `Result<T, E>` лучше исключения для ожидаемой ошибки, например неверного ввода?",
      opts: ["Ошибка видна в типе, и компилятор не даст прочитать значение без проверки", "Он работает быстрее исключений", "Он ловит баги в чужих библиотеках", "Он не требует проверок"],
      a: 0,
      why: "Сигнатура честно говорит, что может не получиться, а сужение по `ok` заставляет обработать оба случая.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `safeJson(text)`: вернуть `{ ok: true, value }` с разобранным JSON или `{ ok: false, error }` с текстом ошибки. Значение — `unknown`.",
      code: `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

function safeJson(text: string): Result<unknown> {
  return JSON.parse(text);
}`,
      runtime: [["safeJson('{\"a\":1}')", "{\"ok\":true,\"value\":{\"a\":1}}"], ["safeJson('{').ok", "false"]],
      forbid: ["any", "as", "ignore"],
      hint: "`try { return { ok: true, value: JSON.parse(text) }; } catch (e) { return { ok: false, error: e instanceof Error ? e.message : \"Ошибка\" }; }`",
      solution: `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E };

function safeJson(text: string): Result<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Ошибка" };
  }
}`,
    },
  ],
};
