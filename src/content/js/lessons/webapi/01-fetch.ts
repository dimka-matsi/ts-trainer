import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa1",
  region: 7,
  title: "fetch и отмена запросов",
  q: "Как работает `fetch`? Отклонится ли промис при ответе 404? Как отменить запрос?",
  answer:
    "`fetch(url, options)` возвращает промис, который выполняется объектом `Response`, как только пришли заголовки ответа. Промис отклоняется только при сетевой ошибке, отмене или блокировке CORS — ответы 404 и 500 считаются успешными, поэтому проверяют `response.ok` или `response.status`. Тело читают отдельно, асинхронно и только один раз: `await response.json()`. Отменяют запрос через `AbortController`: передают `signal` в опции и вызывают `abort()` — промис отклонится с ошибкой `AbortError`.",
  theory: {
    p: [
      "`fetch` работает в два шага. Первый `await fetch(url)` ждёт заголовки ответа и отдаёт `Response`: `status`, `ok` (истинно для кодов 200–299), `headers`. Второй шаг — чтение тела: `await response.json()`, `text()` или `blob()`. Тело — поток, его можно прочитать только один раз: повторное чтение бросит `TypeError`.",
      "Главная ловушка: промис `fetch` не отклоняется на 404 или 500 — сервер ответил, значит, запрос удался. Отклонение бывает только при сетевой ошибке, отмене, блокировке CORS. Поэтому после `fetch` всегда проверяют `if (!response.ok) throw new Error(...)`.",
      "Опции: `method`, `headers`, `body`. Для JSON тело превращают в строку `JSON.stringify(data)` и ставят заголовок `Content-Type: application/json`. `credentials` решает, отправлять ли cookie: по умолчанию `same-origin` — только на свой сайт, `include` — и на другие сайты, если сервер разрешил.",
      "Отмена — через `AbortController` из урока про обработчики: `{ signal: controller.signal }` в опциях и `controller.abort()`, когда запрос больше не нужен. Промис отклонится с `AbortError`. Так гасят гонки: пользователь печатает в поиске, и каждый новый запрос отменяет предыдущий, чтобы старый ответ не пришёл последним и не перезаписал новый. Для тайм-аута есть готовый `AbortSignal.timeout(5000)`.",
    ],
    code: `let controller = null;

async function search(query) {
  controller?.abort();                    // отменяем прошлый запрос
  controller = new AbortController();
  try {
    const response = await fetch("/api/search?q=" + encodeURIComponent(query), {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("HTTP " + response.status); // 404 не отклоняет fetch
    return await response.json();         // тело читается отдельно и один раз
  } catch (e) {
    if (e.name === "AbortError") return null; // отменили сами — это не ошибка
    throw e;
  }
}

await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Аня" }),
  signal: AbortSignal.timeout(5000),     // тайм-аут без своего таймера
});`,
    flow: {
      actors: ["Код", "fetch", "Сервер"],
      steps: [
        { from: 0, to: 1, label: "await fetch(url, { signal })" },
        { from: 1, to: 2, label: "запрос уходит" },
        { from: 2, to: 1, label: "404 Not Found + заголовки" },
        { from: 1, to: 0, label: "промис выполнен: Response, ok = false", note: "не отклонён! проверяй response.ok" },
        { from: 0, to: 1, label: "await response.json() — читаем тело отдельно" },
      ],
    },
    keys: [
      "`fetch` выполняется `Response`, когда пришли заголовки. Тело читают отдельно и один раз.",
      "404 и 500 не отклоняют промис — проверяй `response.ok`. Отклонение — сеть, отмена, CORS.",
      "Отмена — `AbortController` и `signal`, ошибка `AbortError`. Тайм-аут — `AbortSignal.timeout(ms)`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "`Response` — тот же объект, который возвращает `fetch`. Что выведет этот код?",
      code: `const res = new Response(JSON.stringify({ name: "Аня" }), { status: 404 });
console.log(res.ok, res.status);
res.json()
  .then((data) => {
    console.log(data.name);
    return res.json();
  })
  .catch((e) => console.log(e.name));`,
      opts: ["false 404\nАня\nTypeError", "false 404\nTypeError", "true 404\nАня\nАня", "false 404\nАня\nAbortError"],
      a: 0,
      why: "Ответ 404 — это `ok: false`, но тело у него есть и читается. Второе чтение того же тела бросает `TypeError`: поток уже прочитан.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const controller = new AbortController();
controller.signal.onabort = () => {
  console.log("отменено:", controller.signal.reason.name);
};
console.log(controller.signal.aborted);
controller.abort();
console.log(controller.signal.aborted);`,
      opts: ["false\nотменено: AbortError\ntrue", "false\ntrue\nотменено: AbortError", "true\nотменено: AbortError\ntrue", "false\nотменено: TimeoutError\ntrue"],
      a: 0,
      why: "`abort()` сразу, синхронно, помечает сигнал и вызывает обработчик. Причина по умолчанию — ошибка с именем `AbortError`, с ней же отклонится и запрос с этим сигналом.",
    },
    {
      type: "quiz",
      q: "Когда промис `fetch` отклоняется?",
      opts: [
        "При сетевой ошибке, отмене через `signal` или блокировке CORS, но не при ответе 404 или 500",
        "При любом коде ответа, кроме 200",
        "При кодах 400–599",
        "Только при тайм-ауте",
      ],
      a: 0,
      why: "Для `fetch` сервер, ответивший ошибкой, — успешный обмен. Ошибку по коду проверяют сами через `response.ok`.",
    },
    {
      type: "run",
      goal: "Напиши `readJson(response)`: если `response.ok`, возвращает разобранное тело, иначе бросает `new Error(\"HTTP \" + статус)`.",
      code: `async function readJson(response) {
  return response.json();
}`,
      tests: [
        ["readJson(new Response('{\"a\":1}'))", "{\"a\":1}"],
        ["readJson(new Response('{}', { status: 404 })).catch((e) => e.message)", "\"HTTP 404\""],
        ["readJson(new Response('oops', { status: 500 })).catch((e) => e.message)", "\"HTTP 500\""],
      ],
      solution: `async function readJson(response) {
  if (!response.ok) throw new Error("HTTP " + response.status);
  return response.json();
}`,
      hint: "Проверь `response.ok` до чтения тела. Если он ложный — `throw new Error(\"HTTP \" + response.status)`.",
    },
  ],
};
