import { json, msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "cors5",
  region: 1,
  title: "Запросы с cookies",
  q: "Почему с cookies нельзя ответить `Access-Control-Allow-Origin: *`? Что нужно, чтобы запрос на другой источник ушёл с cookies?",
  answer:
    "По умолчанию запросы на другой источник уходят без cookies. Клиент должен явно включить режим с учётными данными (credentials), а сервер — ответить `Access-Control-Allow-Credentials: true` и указать точный источник вместо `*`. Звёздочка с учётными данными запрещена: иначе любой сайт мог бы читать ответы с твоей сессией. Кроме того, сами cookies должны разрешать отправку: для другого сайта это `SameSite=None; Secure`.",
  theory: {
    p: [
      "Фоновый запрос на другой источник по умолчанию идёт без cookies и без заголовка `Authorization` из браузера. Чтобы приложить cookies, клиент включает режим с учётными данными (credentials). Тогда к правилам CORS добавляются строгие условия.",
      "Сервер должен ответить `Access-Control-Allow-Credentials: true` и точным источником в `Access-Control-Allow-Origin`. `*` в этом режиме запрещена, и в `Allow-Methods` и `Allow-Headers` тоже. Иначе любой сайт в интернете мог бы читать ответы API с сессией пользователя — ровно то, от чего защищает политика одного источника.",
      "Опасная ошибка — отражать любой `Origin` из запроса вместе с `Allow-Credentials: true`. Формально это не `*`, но по смыслу то же самое: `evil.com` получит ответ `Allow-Origin: https://evil.com` и прочитает данные пользователя. Источники сверяют с белым списком.",
      "И отдельный слой — cookies. Если фронтенд и API на одном сайте (`app.shop.ru` и `api.shop.ru`), cookie с `SameSite=Lax` уйдёт. Если на разных сайтах (`shop.ru` и `shop-api.com`), нужна `SameSite=None; Secure`, а это сторонняя cookie со всеми ограничениями браузеров. Поэтому API держат на поддомене основного домена.",
    ],
    requests: [
      {
        name: "cart",
        type: "fetch",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 60], ["Загрузка", 1]],
        request: msg("GET /api/cart HTTP/2", [[":authority", "api.shop.ru"], ["origin", "https://app.shop.ru"], ["cookie", "__Host-sid=a8f3k2"]]),
        response: msg("HTTP/2 200", [
          ["access-control-allow-origin", "https://app.shop.ru"],
          ["access-control-allow-credentials", "true"],
          ["vary", "Origin"],
          ["cache-control", "private, no-store"],
        ], json("{\"items\":[{\"id\":7,\"count\":2}]}")),
      },
    ],
    keys: [
      "Cookies на другой источник уходят, только если клиент включил режим credentials.",
      "Сервер отвечает `Allow-Credentials: true` и точным источником — `*` запрещена.",
      "Отражать любой `Origin` с credentials — дыра. Сверяй с белым списком.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Запрос с учётными данными, сервер ответил `Access-Control-Allow-Origin: *` и `Access-Control-Allow-Credentials: true`. Что будет?",
      opts: [
        "Ошибка CORS: с учётными данными звёздочка запрещена",
        "Ответ прочитает любой сайт",
        "Браузер отправит запрос повторно без cookies",
        "Всё сработает",
      ],
      a: 0,
      why: "Браузер требует точный источник, когда ответ содержит данные пользователя. Звёздочка допустима только для публичных данных без cookies.",
    },
    {
      type: "quiz",
      q: "API на `api.shop.ru` отвечает `Access-Control-Allow-Origin` со значением из заголовка `Origin` любого запроса и `Allow-Credentials: true`. Чем это опасно?",
      opts: [
        "Любой сайт прочитает данные пользователя с его сессией",
        "Ничем, это обычная настройка",
        "API перестанет работать для своего фронтенда",
        "Браузер заблокирует такие ответы",
      ],
      a: 0,
      why: "`evil.com` получит в ответе своё же имя и формально пройдёт проверку. Источник нужно сверять со списком разрешённых.",
    },
    {
      type: "sort",
      q: "Фронтенд на `https://shop.ru`. Какой `SameSite` нужен сессионной cookie API, чтобы она уходила с запросами?",
      groups: ["Хватит `Lax`", "Нужен `None; Secure`"],
      items: [
        ["API на `https://api.shop.ru`", 0],
        ["API на `https://shop.ru/api`", 0],
        ["API на `https://shop-api.com`", 1],
        ["API на `https://shop.herokuapp.com`", 1],
      ],
      why: "`SameSite` смотрит на сайт. Поддомен и путь того же домена — тот же сайт. Другой регистрируемый домен — другой сайт, а cookie становится сторонней.",
    },
  ],
};
