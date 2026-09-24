import { msg } from "../../http";
import type { WebLesson } from "../../types";

export const lesson: WebLesson = {
  id: "ck4",
  region: 4,
  title: "Сторонние cookies",
  q: "Что такое сторонние cookies и почему браузеры их ограничивают?",
  answer:
    "Сторонняя cookie принадлежит не сайту в адресной строке, а другому домену, чей ресурс встроен в страницу: счётчику, рекламе, виджету. Один трекер встроен в тысячи сайтов и по своей cookie узнаёт тебя везде — так строится профиль посещений. Safari и Firefox по умолчанию блокируют или изолируют такие cookies, а для честных встраиваний есть атрибут `Partitioned` (CHIPS): отдельная копия cookie для каждого сайта.",
  theory: {
    p: [
      "Ты открыл `news.ru`. На странице картинка-счётчик с `tracker.com`. Для этого запроса `tracker.com` — третья сторона: в адресной строке другой сайт. Если трекер ставит cookie `uid=77` с `SameSite=None; Secure`, она будет уходить ему со всех сайтов, где стоит счётчик. Трекер видит: пользователь 77 читал `news.ru`, потом смотрел `shop.ru`.",
      "Поэтому браузеры такие cookies ограничивают. Safari блокирует сторонние cookies полностью с 2020 года. Firefox по умолчанию изолирует их: у `tracker.com` на `news.ru` и на `shop.ru` разные хранилища. Chrome от полного отключения отказался, но пользователь может заблокировать их в настройках.",
      "Ограничения ломают и честные сценарии: чат поддержки в iframe, встроенные карты. Для них есть атрибут `Partitioned` (CHIPS): `Set-Cookie: chat=1; Secure; SameSite=None; Partitioned`. Браузер хранит отдельную копию для каждого сайта верхнего уровня. Виджет на `shop.ru` помнит свою сессию, но связать её с `news.ru` не может.",
      "Вывод для своих проектов: не строй вход на сторонних cookies. Если фронтенд на `app.shop.ru`, а API на `api.shop.ru`, это один сайт, cookie для них первичные (first-party), и ограничения их не касаются. Держи фронтенд и API под одним регистрируемым доменом.",
    ],
    requests: [
      {
        name: "news.ru",
        type: "document",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 70], ["Загрузка", 10]],
        request: msg("GET / HTTP/2", [[":authority", "news.ru"]]),
        response: msg("HTTP/2 200", [], { type: "text/html; charset=utf-8", text: "<img src=\"https://tracker.com/pixel.gif\">" }),
      },
      {
        name: "pixel.gif",
        type: "gif",
        start: 90,
        timing: [["Очередь", 1], ["DNS", 20], ["TCP", 30], ["TLS", 32], ["Ожидание ответа", 25], ["Загрузка", 1]],
        request: msg("GET /pixel.gif HTTP/2", [[":authority", "tracker.com"], ["cookie", "uid=77"], ["referer", "https://news.ru/"]]),
        response: msg("HTTP/2 200", [["set-cookie", "uid=77; Max-Age=31536000; Secure; SameSite=None"], ["content-type", "image/gif"], ["content-length", "43"]]),
      },
      {
        name: "chat-widget",
        type: "document",
        start: 100,
        timing: [["Очередь", 1], ["DNS", 18], ["TCP", 28], ["TLS", 30], ["Ожидание ответа", 60], ["Загрузка", 4]],
        request: msg("GET /widget HTTP/2", [[":authority", "support-chat.io"]]),
        response: msg("HTTP/2 200", [["set-cookie", "chat=s91; Path=/; Secure; SameSite=None; Partitioned"]], { type: "text/html; charset=utf-8", text: "<div id=\"chat\"></div>" }),
      },
    ],
    keys: [
      "Сторонняя cookie — от домена встроенного ресурса, а не от сайта в адресной строке.",
      "Трекеры склеивают по ним посещения разных сайтов, поэтому Safari и Firefox их блокируют или изолируют.",
      "`Partitioned` даёт отдельную копию на каждый сайт. Свои фронтенд и API держи на одном домене.",
    ],
  },
  tasks: [
    {
      type: "sort",
      q: "Ты на странице `shop.ru`. Разложи cookies: первичная или сторонняя?",
      groups: ["Первичная", "Сторонняя"],
      items: [
        ["от `shop.ru`", 0],
        ["от `api.shop.ru`", 0],
        ["от `static.shop.ru`", 0],
        ["от `tracker.com` на картинке-счётчике", 1],
        ["от `youtube.com` во встроенном видео", 1],
        ["от `ads.net` в рекламном iframe", 1],
      ],
      why: "Первичность определяется сайтом в адресной строке. Все поддомены `shop.ru` — тот же сайт, остальные домены — третьи стороны.",
    },
    {
      type: "quiz",
      q: "Фронтенд работает на `app.shop.ru`, API — на `api.shop.ru`. Сторонние ли cookie у API?",
      opts: [
        "Нет: это один сайт `shop.ru`, cookie первичные",
        "Да: домены разные",
        "Да, если API отвечает JSON",
        "Только в Safari",
      ],
      a: 0,
      why: "Сайт — это схема и регистрируемый домен. У обоих адресов он общий, поэтому ограничения сторонних cookies их не трогают.",
    },
    {
      type: "quiz",
      q: "Что делает атрибут `Partitioned`?",
      opts: [
        "Хранит отдельную копию cookie для каждого сайта, куда встроен ресурс",
        "Делит одну cookie на части по 4 КБ",
        "Запрещает отправку cookie по HTTP",
        "Отправляет cookie только в iframe",
      ],
      a: 0,
      why: "Виджет продолжает работать, но у него на каждом сайте своя cookie, и отследить пользователя между сайтами нельзя.",
    },
  ],
};
