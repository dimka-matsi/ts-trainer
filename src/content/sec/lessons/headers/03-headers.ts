import { msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "sec7",
  region: 3,
  level: "middle",
  title: "Заголовки защиты",
  q: "Зачем `X-Content-Type-Options: nosniff`, `Referrer-Policy` и `Permissions-Policy`?",
  answer:
    "`X-Content-Type-Options: nosniff` запрещает браузеру угадывать тип файла по содержимому: загруженная «картинка» с кодом внутри не выполнится как скрипт. `Referrer-Policy` решает, какой адрес страницы уходит другим сайтам в заголовке `Referer`: по умолчанию браузеры отправляют чужим сайтам только источник, без пути и параметров, где могут быть токены. `Permissions-Policy` отключает возможности браузера — камеру, микрофон, геолокацию — для страницы и встроенных фреймов.",
  theory: {
    p: [
      "`X-Content-Type-Options: nosniff`. Раньше браузеры угадывали тип файла по содержимому, если `Content-Type` казался неправильным. Злоумышленник загружал аватарку `avatar.png` с JavaScript внутри и подключал её как скрипт на другой странице. С `nosniff` браузер строго сверяет тип: скрипт с `Content-Type: image/png` или стиль с `text/plain` будет заблокирован.",
      "`Referrer-Policy`. При переходе и загрузке ресурсов браузер сообщает в `Referer`, откуда пришёл запрос. В адресе могут быть данные: `/reset-password?token=…` или `/orders/12345`. Значение по умолчанию в браузерах — `strict-origin-when-cross-origin`: своему сайту — полный адрес, чужому — только источник, а с HTTPS на HTTP — ничего. `no-referrer` не отправляет ничего и подходит для страниц с секретами в адресе.",
      "`Permissions-Policy: camera=(), microphone=(), geolocation=(self)` отключает камеру и микрофон для страницы и всех её фреймов, а геолокацию оставляет только своему сайту. Это страховка: даже XSS или встроенный чужой виджет не смогут попросить доступ к камере.",
      "Полезный набор для большинства сайтов: HSTS, строгая CSP с `frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` с отключением ненужного. Проверить сайт можно сервисами вроде securityheaders.com или вкладкой «Сеть» в DevTools. Старый заголовок `X-XSS-Protection` браузеры больше не используют, ставить его не нужно.",
    ],
    requests: [
      {
        name: "shop.ru",
        type: "document",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 60], ["Загрузка", 5]],
        request: msg("GET / HTTP/2", [[":authority", "shop.ru"]]),
        response: msg("HTTP/2 200", [
          ["strict-transport-security", "max-age=31536000; includeSubDomains"],
          ["content-security-policy", "script-src 'nonce-k2m9' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'"],
          ["x-content-type-options", "nosniff"],
          ["referrer-policy", "strict-origin-when-cross-origin"],
          ["permissions-policy", "camera=(), microphone=(), geolocation=(self)"],
        ], { type: "text/html; charset=utf-8", text: "<!doctype html><title>Магазин</title>" }),
      },
      {
        name: "partner.com/logo.png",
        type: "png",
        start: 80,
        timing: [["Очередь", 1], ["DNS", 14], ["TCP", 22], ["TLS", 24], ["Ожидание ответа", 30], ["Загрузка", 4]],
        request: msg("GET /logo.png HTTP/2", [[":authority", "partner.com"], ["referer", "https://shop.ru/"]]),
        response: msg("HTTP/2 200", [["content-type", "image/png"], ["content-length", "5120"], ["x-content-type-options", "nosniff"]]),
      },
    ],
    keys: [
      "`nosniff` — строгий `Content-Type`, «картинка» не выполнится как скрипт.",
      "`Referrer-Policy` — сколько адреса узнают другие сайты. По умолчанию чужим — только источник.",
      "`Permissions-Policy` отключает камеру, микрофон и прочее для страницы и фреймов.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь заголовок и защиту.",
      pairs: [
        ["`X-Content-Type-Options: nosniff`", "браузер не угадывает тип файла"],
        ["`Referrer-Policy: no-referrer`", "адрес страницы не уходит в `Referer`"],
        ["`Permissions-Policy: camera=()`", "камера недоступна странице и фреймам"],
        ["`Strict-Transport-Security`", "только HTTPS для домена"],
      ],
      why: "Каждый заголовок закрывает одну конкретную дыру. Вместе с CSP они составляют базовый набор защиты сайта.",
    },
    {
      type: "quiz",
      q: "Пользователь на странице `https://shop.ru/reset?token=abc` нажал ссылку на `https://blog.io`. Что уйдёт в `Referer` при политике по умолчанию?",
      opts: ["`https://shop.ru/`", "`https://shop.ru/reset?token=abc`", "Ничего", "`shop.ru/reset`"],
      a: 0,
      why: "`strict-origin-when-cross-origin` отправляет чужому сайту только источник. Путь и параметры с токеном останутся дома.",
    },
    {
      type: "quiz",
      q: "Пользователь загрузил `avatar.png`, внутри которого JavaScript. Что мешает подключить его как скрипт на странице сайта?",
      opts: [
        "`nosniff`: браузер не выполнит файл с `Content-Type: image/png` как скрипт",
        "`Referrer-Policy`",
        "HTTPS",
        "`Permissions-Policy`",
      ],
      a: 0,
      why: "Без `nosniff` браузер мог решить по содержимому, что это скрипт. С ним тип из заголовка — закон.",
    },
  ],
};
