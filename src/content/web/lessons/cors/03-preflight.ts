import { json, msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "cors3",
  region: 7,
  title: "Простые запросы и preflight",
  q: "Когда браузер отправляет предварительный запрос OPTIONS (preflight)?",
  answer:
    "Простой запрос — `GET`, `HEAD` или `POST` только с простыми заголовками и `Content-Type` одного из трёх видов: форма, `multipart/form-data` или `text/plain`. Такой браузер отправляет сразу. Для всего остального — `PUT`, `DELETE`, JSON, заголовка `Authorization` — сначала уходит `OPTIONS` с вопросом «можно?». Сервер отвечает, какие методы и заголовки разрешены, и только тогда браузер отправляет настоящий запрос. Логика такая: простые запросы могла отправить и обычная HTML-форма, а остальные раньше были невозможны.",
  theory: {
    p: [
      "До CORS чужой сайт уже мог отправить на твой сервер `GET` через картинку и `POST` через HTML-форму. Серверы жили с этим десятилетиями. Поэтому такие же запросы с CORS назвали простыми и отправляют сразу: сервер ничего нового не увидит. Условия: метод `GET`, `HEAD` или `POST`; заголовки только из безопасного списка (`Accept`, `Accept-Language`, `Content-Language` и простой `Content-Type`); `Content-Type` — `application/x-www-form-urlencoded`, `multipart/form-data` или `text/plain`.",
      "Всё остальное форма сделать не могла: `PUT`, `DELETE`, `PATCH`, JSON в `Content-Type`, свои заголовки вроде `Authorization`. Старый сервер может не ждать таких запросов с чужих сайтов. Поэтому браузер сначала спрашивает разрешения: `OPTIONS /api/items/7` с заголовками `Origin`, `Access-Control-Request-Method: PUT` и `Access-Control-Request-Headers: content-type, authorization`.",
      "Сервер отвечает 204 с `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods` и `Access-Control-Allow-Headers`. Если всё сходится, браузер отправляет настоящий `PUT`. Если нет — настоящий запрос не уходит вообще, а в консоли ошибка CORS. Во вкладке «Сеть» preflight виден отдельной строкой с типом `preflight`.",
      "Важная деталь про простые запросы: они доходят до сервера и выполняются, браузер лишь прячет ответ от страницы. `POST` формы с чужого сайта спишет деньги, даже если CORS его «заблокировал». Preflight — лишний RTT, поэтому его ответ кэшируют: `Access-Control-Max-Age: 7200` — два часа не спрашивать заново. Chrome дольше двух часов не хранит.",
    ],
    requests: [
      {
        name: "items/7 (preflight)",
        type: "preflight",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 48], ["Загрузка", 1]],
        request: msg("OPTIONS /api/items/7 HTTP/2", [
          [":authority", "api.shop.ru"],
          ["origin", "https://app.shop.ru"],
          ["access-control-request-method", "PUT"],
          ["access-control-request-headers", "authorization, content-type"],
        ]),
        response: msg("HTTP/2 204", [
          ["access-control-allow-origin", "https://app.shop.ru"],
          ["access-control-allow-methods", "GET, PUT, DELETE"],
          ["access-control-allow-headers", "authorization, content-type"],
          ["access-control-max-age", "7200"],
          ["vary", "Origin"],
        ]),
      },
      {
        name: "items/7",
        type: "fetch",
        start: 55,
        timing: [["Очередь", 1], ["Ожидание ответа", 62], ["Загрузка", 1]],
        request: msg("PUT /api/items/7 HTTP/2", [[":authority", "api.shop.ru"], ["origin", "https://app.shop.ru"], ["authorization", "Bearer eyJ…"]], json("{\"count\":3}")),
        response: msg("HTTP/2 200", [["access-control-allow-origin", "https://app.shop.ru"], ["vary", "Origin"]], json("{\"id\":7,\"count\":3}")),
      },
    ],
    keys: [
      "Простой запрос: `GET`, `HEAD` или `POST`, простые заголовки, `Content-Type` формы или текста. Уходит сразу.",
      "Остальное — сначала `OPTIONS` с `Access-Control-Request-*`, сервер отвечает `Access-Control-Allow-*`.",
      "Простой запрос выполняется на сервере даже при ошибке CORS: скрывается только ответ.",
    ],
  },
  tasks: [
    {
      type: "sort",
      q: "Страница на `app.shop.ru` шлёт запросы на `api.shop.ru`. Для каких браузер отправит preflight?",
      groups: ["Сразу, без preflight", "Сначала preflight"],
      items: [
        ["`GET /api/items`", 0],
        ["`POST` с `Content-Type: application/x-www-form-urlencoded`", 0],
        ["`POST` с `Content-Type: application/json`", 1],
        ["`DELETE /api/items/7`", 1],
        ["`GET` с заголовком `Authorization`", 1],
        ["`POST` с `Content-Type: text/plain`", 0],
      ],
      why: "JSON, методы кроме `GET`, `HEAD`, `POST` и свои заголовки обычная форма отправить не могла, поэтому для них нужен preflight.",
    },
    {
      type: "quiz",
      q: "Сайт `evil.com` отправил простой `POST` на `bank.ru/transfer`, и в консоли ошибка CORS. Выполнился ли перевод?",
      opts: [
        "Да, если сервер принял запрос: CORS спрятал только ответ",
        "Нет, CORS не дал отправить запрос",
        "Нет, preflight отклонил запрос",
        "Перевод выполнится только после перезагрузки",
      ],
      a: 0,
      why: "Для простых запросов preflight нет, запрос сразу уходит на сервер. Защита от таких атак — `SameSite` и CSRF-токены, а не CORS.",
    },
    {
      type: "quiz",
      q: "Каждый запрос `PUT` к API сопровождается лишним `OPTIONS`. Как сократить их число?",
      opts: [
        "Вернуть в ответе на preflight `Access-Control-Max-Age`",
        "Отвечать на `OPTIONS` кодом 404",
        "Убрать из ответа `Access-Control-Allow-Methods`",
        "Перейти на HTTP/1.1",
      ],
      a: 0,
      why: "Браузер запомнит ответ на preflight на указанное время (в Chrome — не больше двух часов) и не будет спрашивать для каждого запроса.",
    },
  ],
};
