import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc10",
  region: 9,
  level: "senior",
  title: "retry с экспоненциальной паузой",
  q: "Напиши `retry(fn, attempts, delay)`: повторить асинхронную операцию при ошибке, с растущей паузой между попытками.",
  answer:
    "`retry` — `async` функция с циклом по попыткам: `try { return await fn(); }`, в `catch` запоминаем ошибку и, если попытки остались, ждём и пробуем снова. Пауза растёт экспоненциально — `delay`, `2·delay`, `4·delay` — чтобы не добивать упавший сервер. В реальном коде к паузе добавляют случайный разброс (jitter), чтобы тысячи клиентов не повторяли запрос одновременно, и повторяют только временные ошибки — сеть, 503, 429, — но не 400 или 404. Если все попытки кончились — бросаем последнюю ошибку.",
  theory: {
    p: [
      "Сеть и серверы иногда отвечают ошибкой один раз, а со второй попытки всё работает. `retry` прячет такие сбои: вызывает операцию, при ошибке ждёт и повторяет, пока не кончатся попытки. Операция передаётся функцией, а не промисом: промис уже запущен, а нам нужно запускать заново.",
      "Паузы. Повтор сразу же часто бесполезен: сервер ещё лежит. Экспоненциальная пауза растёт: `delay * 2 ** (попытка - 1)`. К ней добавляют случайный разброс, чтобы клиенты, упавшие одновременно, не вернулись одновременно и не устроили новую волну нагрузки.",
      "Что повторять. Имеет смысл повторять временные ошибки: сеть, тайм-аут, 503, 429 (для 429 сервер может сказать, сколько ждать, в заголовке `Retry-After`). Ошибки запроса — 400, 401, 404 — повторять бессмысленно. Повторять безопасно только идемпотентные операции: повторный `GET` ничего не сломает, а повторный платёж — может.",
    ],
    code: `async function retrySimple(fn, attempts) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();           // успех — сразу выходим
    } catch (e) {
      lastError = e;
      console.log("попытка", i, "упала");
    }
  }
  throw lastError;                 // попытки кончились
}

let calls = 0;
retrySimple(async () => {
  calls++;
  if (calls < 3) throw new Error("сбой сети");
  return "ответ";
}, 5).then((v) => console.log(v, "с попытки", calls));`,
    keys: [
      "Операцию передают функцией, чтобы запускать заново. Цикл с `try { return await fn() }`.",
      "Пауза растёт экспоненциально: `delay * 2 ** (n - 1)`, плюс случайный разброс.",
      "Повторяют временные ошибки и идемпотентные операции. После последней попытки бросают последнюю ошибку.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `retry(fn, attempts, delay)`: вызывает `fn` до `attempts` раз, пока не получится. Перед повтором ждёт `delay`, потом `2·delay`, `4·delay` и так далее. Если все попытки упали — отклоняется последней ошибкой.",
      code: `async function retry(fn, attempts, delay) {
  return fn();
}`,
      tests: [
        ["(async () => { let n = 0; const r = await retry(async () => { n++; if (n < 3) throw new Error(\"fail\"); return \"ok\"; }, 5, 1); return [r, n]; })()", "[\"ok\",3]"],
        ["(async () => { let n = 0; return retry(async () => { n++; throw new Error(\"всегда \" + n); }, 3, 1).catch((e) => [e.message, n]); })()", "[\"всегда 3\",3]"],
        ["(async () => { let n = 0; const t = Date.now(); await retry(async () => { if (++n < 3) throw new Error(\"x\"); return 1; }, 3, 20); return Date.now() - t >= 55; })()", "true"],
      ],
      solution: `async function retry(fn, attempts, delay) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (i < attempts) await new Promise((r) => setTimeout(r, delay * 2 ** (i - 1)));
    }
  }
  throw lastError;
}`,
      hint: "Возьми `retrySimple` из теории. После ошибки, если попытка не последняя, подожди `delay * 2 ** (i - 1)` миллисекунд: `await new Promise((r) => setTimeout(r, ms))`.",
    },
    {
      type: "quiz",
      q: "Какую ошибку не стоит повторять через `retry`?",
      opts: ["`404 Not Found`", "`503 Service Unavailable`", "Обрыв сети", "`429 Too Many Requests`"],
      a: 0,
      why: "Ресурса нет — повтор ничего не изменит. 503, 429 и обрыв сети — временные: через паузу запрос может пройти.",
    },
  ],
};
