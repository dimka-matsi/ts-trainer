import { json, msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "cors4",
  region: 1,
  title: "Заголовки Access-Control-*",
  q: "Какие заголовки должен вернуть сервер, чтобы разрешить запрос с другого источника?",
  answer:
    "Главный — `Access-Control-Allow-Origin`: либо конкретный источник, либо `*` для публичных данных. Для preflight ещё `Access-Control-Allow-Methods` и `Access-Control-Allow-Headers`, по желанию `Access-Control-Max-Age`. Чтобы странице были видны нестандартные заголовки ответа, нужен `Access-Control-Expose-Headers`. Если сервер подставляет в ответ источник из запроса, он обязан добавить `Vary: Origin`, иначе кэш отдаст разрешение для одного источника другому.",
  theory: {
    p: [
      "`Access-Control-Allow-Origin` принимает одно значение: `*` или один источник. Списка через запятую не бывает. Если разрешить нужно нескольким фронтендам, сервер смотрит на заголовок `Origin` в запросе, сверяет со своим списком и возвращает именно его.",
      "Когда ответ зависит от `Origin`, обязателен `Vary: Origin`. Иначе CDN закэширует ответ с `Access-Control-Allow-Origin: https://app.shop.ru`, отдаст его запросу с `admin.shop.ru`, и у админки сломается CORS. Или наоборот, разрешение попадёт тому, кому не положено.",
      "Для preflight: `Access-Control-Allow-Methods: GET, PUT, DELETE` и `Access-Control-Allow-Headers: authorization, content-type` — что можно в настоящем запросе. `Access-Control-Max-Age` — сколько секунд помнить этот ответ.",
      "По умолчанию странице видны только простые заголовки ответа: `Cache-Control`, `Content-Language`, `Content-Length`, `Content-Type`, `Expires`, `Last-Modified`, `Pragma`. Если фронтенду нужен `X-Total-Count` для пагинации или `ETag`, сервер перечисляет их в `Access-Control-Expose-Headers`. Иначе браузер получит заголовок, но код страницы его не увидит.",
    ],
    requests: [
      {
        name: "items?page=2",
        type: "fetch",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 58], ["Загрузка", 2]],
        request: msg("GET /api/items?page=2 HTTP/2", [[":authority", "api.shop.ru"], ["origin", "https://admin.shop.ru"]]),
        response: msg("HTTP/2 200", [
          ["access-control-allow-origin", "https://admin.shop.ru"],
          ["access-control-expose-headers", "X-Total-Count, ETag"],
          ["vary", "Origin"],
          ["x-total-count", "134"],
          ["etag", "\"p2-v9\""],
        ], json("{\"items\":[{\"id\":21},{\"id\":22}]}")),
      },
      {
        name: "public/rates",
        type: "fetch",
        start: 70,
        timing: [["Очередь", 1], ["Ожидание ответа", 30], ["Загрузка", 1]],
        request: msg("GET /public/rates HTTP/2", [[":authority", "api.shop.ru"], ["origin", "https://anyone.io"]]),
        response: msg("HTTP/2 200", [["access-control-allow-origin", "*"], ["cache-control", "max-age=300"]], json("{\"usd\":90.5}")),
      },
    ],
    keys: [
      "`Access-Control-Allow-Origin` — `*` или ровно один источник. Для нескольких сверяют `Origin` со списком.",
      "Если значение зависит от `Origin` — обязательно `Vary: Origin`.",
      "Нестандартные заголовки ответа странице видны только через `Access-Control-Expose-Headers`.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь заголовок и его роль.",
      pairs: [
        ["`Access-Control-Allow-Origin`", "каким источникам можно читать ответ"],
        ["`Access-Control-Allow-Methods`", "какие методы можно в настоящем запросе"],
        ["`Access-Control-Allow-Headers`", "какие заголовки запроса разрешены"],
        ["`Access-Control-Expose-Headers`", "какие заголовки ответа видны странице"],
        ["`Access-Control-Max-Age`", "сколько помнить ответ на preflight"],
      ],
      why: "`Allow-*` отвечают на вопросы preflight и разрешают чтение, `Expose-Headers` открывает заголовки ответа, `Max-Age` экономит повторные preflight.",
    },
    {
      type: "quiz",
      q: "Сервер вернул `Access-Control-Allow-Origin: https://a.ru, https://b.ru`. Что будет?",
      opts: [
        "Ошибка CORS для обоих: допустим только один источник или `*`",
        "Доступ получат оба сайта",
        "Доступ получит только первый",
        "Браузер разрешит всем",
      ],
      a: 0,
      why: "Список в этом заголовке не поддерживается. Сервер должен сам выбрать подходящий источник из `Origin` запроса и вернуть только его.",
    },
    {
      type: "quiz",
      q: "Сервер присылает `X-Total-Count`, а фронтенд на другом источнике не может его прочитать. Что добавить в ответ?",
      opts: [
        "`Access-Control-Expose-Headers: X-Total-Count`",
        "`Access-Control-Allow-Headers: X-Total-Count`",
        "`Vary: X-Total-Count`",
        "`Access-Control-Allow-Origin: *`",
      ],
      a: 0,
      why: "`Allow-Headers` — про заголовки запроса. Открыть заголовок ответа можно только через `Expose-Headers`.",
    },
  ],
};
