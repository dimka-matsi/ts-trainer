import { msg } from "../../http";
import type { WebLesson } from "../../types";

const CSP = "script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'";

export const lesson: WebLesson = {
  id: "sec4",
  region: 8,
  title: "Content Security Policy",
  q: "Что делает заголовок `Content-Security-Policy`? Зачем nonce и `strict-dynamic`?",
  answer:
    "CSP — список правил, откуда странице можно загружать и выполнять ресурсы. Даже если злоумышленник вставил на страницу `<script>`, браузер его не выполнит, если скрипт не разрешён политикой. Надёжнее всего политика на nonce: сервер на каждый ответ генерирует случайное значение, пишет его в заголовок и в атрибут своих `<script>`, и выполняются только скрипты с этим значением. `strict-dynamic` разрешает доверенным скриптам подгружать другие. `'unsafe-inline'` сводит защиту на нет.",
  theory: {
    p: [
      "CSP — заголовок ответа с директивами: `default-src`, `script-src`, `style-src`, `img-src`, `connect-src` и другими. Каждая перечисляет разрешённые источники: `'self'`, `https://cdn.shop.ru`, `'none'`. Всё, что не разрешено, браузер блокирует и пишет в консоль. Это страховка на случай, если XSS всё-таки пролез.",
      "Старый подход — белый список доменов: `script-src 'self' https://cdn.jsdelivr.net`. Он плохо защищает: на разрешённых CDN лежат тысячи библиотек, и среди них находятся те, через которые можно выполнить произвольный код. Поэтому сейчас рекомендуют строгую политику на nonce: `script-src 'nonce-r4nd0m' 'strict-dynamic'; object-src 'none'; base-uri 'none'`.",
      "Nonce — случайное значение, новое на каждый ответ. Сервер пишет его в заголовок и в атрибут `nonce` своих тегов `<script>`. Внедрённый комментарий `<script>` nonce не знает и не выполнится. `strict-dynamic` передаёт доверие дальше: скрипт с правильным nonce может загрузить другие скрипты, и их тоже выполнят. Встроенные обработчики вроде `onclick=\"…\"` и ссылки `javascript:` под такой политикой не работают, если не добавить `'unsafe-inline'`, а он отключает всю защиту от внедрённых скриптов.",
      "Внедряют постепенно. `Content-Security-Policy-Report-Only` ничего не блокирует, а только сообщает о нарушениях на адрес из `report-to`. Собирают отчёты, чинят страницы, потом включают настоящий заголовок. Ещё полезные директивы: `frame-ancestors` (кто может встраивать сайт во фрейм) и `upgrade-insecure-requests` (переписать `http://`-ресурсы на `https://`).",
    ],
    requests: [
      {
        name: "product/7",
        type: "document",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 60], ["Загрузка", 4]],
        request: msg("GET /product/7 HTTP/2", [[":authority", "shop.ru"]]),
        response: msg("HTTP/2 200", [["content-security-policy", CSP]], {
          type: "text/html; charset=utf-8",
          text: "<script nonce=\"r4nd0m\" src=\"/assets/app.3f9a1c.js\"></script>\n<p class=\"comment\"><script src=\"https://evil.com/x.js\"></script></p>",
        }),
      },
      {
        name: "app.3f9a1c.js",
        type: "script",
        start: 70,
        timing: [["Очередь", 1], ["Ожидание ответа", 30], ["Загрузка", 8]],
        request: msg("GET /assets/app.3f9a1c.js HTTP/2", [[":authority", "shop.ru"]]),
        response: msg("HTTP/2 200", [["content-type", "text/javascript"], ["content-length", "184233"]]),
      },
    ],
    keys: [
      "CSP говорит браузеру, откуда можно грузить и выполнять ресурсы. Это вторая линия обороны от XSS.",
      "Строгая политика: `script-src 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'none'`. Nonce новый на каждый ответ.",
      "`'unsafe-inline'` отключает защиту. Внедряют через `Report-Only`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Страница отдана с `script-src 'nonce-r4nd0m' 'strict-dynamic'`, и на ней оказался внедрённый `<script src=\"https://evil.com/x.js\">` без nonce. Что сделает браузер?",
      opts: [
        "Не загрузит и не выполнит его, в консоли будет нарушение CSP",
        "Выполнит, потому что это внешний скрипт",
        "Выполнит, но без доступа к cookies",
        "Удалит всю страницу",
      ],
      a: 0,
      why: "`script-src` разрешает только скрипты с nonce `r4nd0m` и то, что они сами загрузили. У внедрённого тега nonce нет.",
    },
    {
      type: "quiz",
      q: "Почему nonce должен быть новым в каждом ответе?",
      opts: [
        "Постоянный nonce злоумышленник узнает и допишет в свой внедрённый тег",
        "Браузер запоминает nonce и не принимает повторы",
        "Иначе страница не закэшируется",
        "Так требует HTTP/2",
      ],
      a: 0,
      why: "Nonce работает как одноразовый пароль. Если он один на все ответы, его видно в любом HTML сайта.",
    },
    {
      type: "match",
      q: "Сопоставь директиву и смысл.",
      pairs: [
        ["`script-src 'nonce-…'`", "выполнять только скрипты с этим nonce"],
        ["`'strict-dynamic'`", "доверенные скрипты могут загружать другие"],
        ["`'unsafe-inline'`", "разрешить встроенные скрипты и обработчики — защиты нет"],
        ["`frame-ancestors 'self'`", "встраивать страницу во фрейм может только свой сайт"],
        ["`Report-Only`", "не блокировать, только сообщать о нарушениях"],
      ],
      why: "Строгая политика строится на nonce и `strict-dynamic`. Всё с `unsafe` в названии ослабляет защиту.",
    },
  ],
};
