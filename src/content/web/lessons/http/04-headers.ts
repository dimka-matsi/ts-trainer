import { json, msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "http4",
  region: 2,
  level: "junior",
  title: "Заголовки",
  q: "Какие заголовки запроса и ответа ты знаешь? Зачем `Content-Type`, `Accept`, `Authorization`, `Location`?",
  answer:
    "Заголовки — метаданные сообщения. В запросе: `Host` — какой сайт, `Accept` — какие форматы клиент примет, `Authorization` — учётные данные, `User-Agent` — кто спрашивает. В ответе: `Content-Type` — формат тела, `Content-Length` — его размер, `Location` — куда перейти при перенаправлении или где созданный ресурс. `Content-Type` бывает и в запросе, если у него есть тело.",
  theory: {
    p: [
      "Клиент и сервер договариваются о формате. `Accept: application/json` — какие форматы клиент понимает. `Accept-Language: ru, en;q=0.8` — языки с весами. `Accept-Encoding: gzip, br` — какое сжатие он умеет распаковать. Сервер выбирает вариант и сообщает его в `Content-Type`, `Content-Language` и `Content-Encoding`.",
      "`Content-Type` описывает тело: `text/html; charset=utf-8`, `application/json`, `multipart/form-data` для отправки файлов. С неверным типом браузер может неправильно понять ответ. `Content-Length` — длина тела в байтах: по ней получатель понимает, где тело кончается.",
      "`Authorization` передаёт учётные данные. `Bearer` — токен, `Basic` — логин и пароль в base64, а base64 — это не шифрование: его раскодирует кто угодно. `User-Agent` описывает клиента. `Referer` (с опечаткой, так исторически сложилось) — с какой страницы пришли. `Location` в ответе 3xx или 201 — адрес перехода или созданного ресурса. `Retry-After` — когда повторить после 429 или 503.",
      "Имена заголовков не зависят от регистра: `content-type` и `Content-Type` — одно и то же, а в HTTP/2 их пишут строчными. Свои заголовки раньше начинали с `X-`. Сейчас так делать не советуют, но `X-Request-Id` встречается повсюду. Заголовки кэширования, безопасности и доступа с чужих сайтов разберём в своих регионах.",
    ],
    requests: [
      {
        name: "profile",
        type: "fetch",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 52], ["Загрузка", 2]],
        request: msg("GET /api/profile HTTP/1.1", [
          ["Host", "shop.ru"],
          ["Accept", "application/json"],
          ["Accept-Language", "ru, en;q=0.8"],
          ["Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1In0.sig"],
          ["User-Agent", "Mozilla/5.0 …"],
        ]),
        response: msg("HTTP/1.1 200 OK", [["Content-Language", "ru"]], json("{\"id\":5,\"name\":\"Анна\"}")),
      },
      {
        name: "avatar",
        type: "fetch",
        start: 70,
        timing: [["Очередь", 1], ["Ожидание ответа", 120], ["Загрузка", 2]],
        request: msg("POST /api/avatar HTTP/1.1", [["Host", "shop.ru"], ["Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1In0.sig"]], {
          type: "multipart/form-data; boundary=x1",
          text: "--x1\r\nContent-Disposition: form-data; name=\"file\"; filename=\"me.png\"\r\nContent-Type: image/png\r\n\r\n(байты картинки)\r\n--x1--",
        }),
        response: msg("HTTP/1.1 201 Created", [["Location", "/api/avatar/81"]]),
      },
    ],
    keys: [
      "`Accept*` — что клиент хочет получить, `Content-*` — что на самом деле в теле.",
      "`Authorization` несёт токен или логин с паролем. `Basic` — не шифрование, защищает только HTTPS.",
      "`Location` — адрес перехода или созданного ресурса. Имена заголовков не зависят от регистра.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь заголовок и его назначение.",
      pairs: [
        ["`Accept`", "форматы, которые клиент примет"],
        ["`Content-Type`", "формат тела этого сообщения"],
        ["`Authorization`", "учётные данные клиента"],
        ["`Location`", "адрес перехода или созданного ресурса"],
        ["`Accept-Encoding`", "сжатие, которое клиент умеет распаковать"],
        ["`Retry-After`", "когда повторить запрос"],
      ],
      why: "Заголовки с `Accept` — пожелания клиента. Заголовки с `Content` описывают то, что реально лежит в теле.",
    },
    {
      type: "quiz",
      q: "В запросе заголовок `Authorization: Basic YW5uYTpxd2VydHk=`. Насколько он защищает логин и пароль сам по себе?",
      opts: [
        "Никак: это base64, его раскодирует кто угодно, защищает только HTTPS",
        "Надёжно: пароль зашифрован",
        "Пароль захэширован и не восстанавливается",
        "Сервер не сможет прочитать пароль",
      ],
      a: 0,
      why: "`YW5uYTpxd2VydHk=` — это просто `anna:qwerty` в base64. Без HTTPS его прочитает любой на пути.",
    },
    {
      type: "quiz",
      q: "Чем `Content-Type` в запросе отличается от `Accept`?",
      opts: [
        "`Content-Type` описывает тело, которое отправляют, а `Accept` — формат, который хотят получить",
        "Это синонимы",
        "`Accept` описывает тело запроса, а `Content-Type` — тело ответа",
        "`Content-Type` нужен только в ответах",
      ],
      a: 0,
      why: "Клиент может отправить JSON (`Content-Type: application/json`) и попросить в ответ HTML (`Accept: text/html`). Это разные вопросы.",
    },
  ],
};
