import { msg } from "../../../course/http";
import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "sec8",
  region: 3,
  title: "Изоляция: COOP, COEP и CORP",
  q: "Что такое COOP, COEP и CORP и зачем нужна cross-origin isolation?",
  answer:
    "После уязвимости Spectre стало ясно: код может читать чужие данные, если они лежат в памяти того же процесса. Три заголовка помогают браузеру держать чужое отдельно. CORP (`Cross-Origin-Resource-Policy`) говорит, кто может встраивать ресурс. COOP (`Cross-Origin-Opener-Policy: same-origin`) разрывает связь со всплывающими окнами других источников. COEP (`Cross-Origin-Embedder-Policy: require-corp`) требует, чтобы каждый встроенный ресурс явно разрешил встраивание. COOP и COEP вместе включают изоляцию (cross-origin isolation), и тогда странице доступны точные таймеры и общая память между потоками (SharedArrayBuffer).",
  theory: {
    p: [
      "Spectre (2018) показал: процессор при предсказании ветвлений оставляет следы в кэше, и по точному времени доступа код может прочитать память, которую ему читать нельзя. Если картинка или JSON с другого сайта загружены в тот же процесс, их содержимое можно вытащить, несмотря на политику одного источника. Защита — не пускать чужие данные в процесс страницы и отнять точные таймеры.",
      "CORP — ресурс сам говорит, кто может его встраивать: `Cross-Origin-Resource-Policy: same-origin` (только свой источник), `same-site` или `cross-origin`. Личная картинка или JSON с `same-origin` не загрузится на чужой странице даже как `<img>` и не попадёт в чужой процесс.",
      "COOP — политика для окон. Без неё страница, открытая во всплывающем окне или по ссылке с `target=_blank`, может держать ссылку на открывшее окно и живёт с ним в одной группе, иногда в одном процессе. `Cross-Origin-Opener-Policy: same-origin` разрывает эту связь с окнами других источников. Заодно это защищает от подмены страницы через открывшее окно.",
      "COEP: `Cross-Origin-Embedder-Policy: require-corp` — страница загружает с других источников только ресурсы, которые явно разрешили это через CORP или CORS. COOP `same-origin` вместе с COEP `require-corp` включают изоляцию: браузер гарантирует, что в процессе нет чужих данных, и открывает опасные возможности — SharedArrayBuffer и таймеры высокой точности. Они нужны, например, для многопоточного WebAssembly в видеоредакторах и играх.",
    ],
    requests: [
      {
        name: "editor",
        type: "document",
        start: 0,
        timing: [["Очередь", 1], ["Ожидание ответа", 70], ["Загрузка", 6]],
        request: msg("GET /editor HTTP/2", [[":authority", "video.shop.ru"]]),
        response: msg("HTTP/2 200", [
          ["cross-origin-opener-policy", "same-origin"],
          ["cross-origin-embedder-policy", "require-corp"],
        ], { type: "text/html; charset=utf-8", text: "<!doctype html><title>Редактор</title>" }),
      },
      {
        name: "avatar.jpg",
        type: "jpeg",
        start: 90,
        timing: [["Очередь", 1], ["Ожидание ответа", 35], ["Загрузка", 8]],
        request: msg("GET /u/5/avatar.jpg HTTP/2", [[":authority", "static.shop.ru"]]),
        response: msg("HTTP/2 200", [["cross-origin-resource-policy", "same-site"], ["content-type", "image/jpeg"], ["content-length", "18800"]]),
      },
    ],
    keys: [
      "Spectre: чужие данные в том же процессе можно прочитать через точные таймеры.",
      "CORP — кто может встраивать ресурс. COOP — разрыв связи с окнами других источников. COEP — встраивать только то, что разрешило.",
      "COOP `same-origin` + COEP `require-corp` = изоляция, открывающая SharedArrayBuffer и точные таймеры.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь заголовок и смысл.",
      pairs: [
        ["`Cross-Origin-Resource-Policy`", "ресурс говорит, кто может его встраивать"],
        ["`Cross-Origin-Opener-Policy`", "связь с окнами других источников разорвана"],
        ["`Cross-Origin-Embedder-Policy`", "встраивать только ресурсы, которые это разрешили"],
      ],
      why: "CORP ставит ресурс, COOP и COEP — страница. Вместе они не дают чужим данным попасть в процесс страницы.",
    },
    {
      type: "quiz",
      q: "Что нужно, чтобы странице стал доступен SharedArrayBuffer?",
      opts: [
        "Изоляция: `COOP: same-origin` и `COEP: require-corp` у документа",
        "Только HTTPS",
        "Заголовок `Access-Control-Allow-Origin: *`",
        "CSP с nonce",
      ],
      a: 0,
      why: "Точные таймеры и общая память опасны из-за Spectre, поэтому браузер даёт их только странице, где гарантированно нет чужих данных.",
    },
    {
      type: "quiz",
      q: "Страница включила `COEP: require-corp`, и перестали грузиться картинки с партнёрского сайта. Почему?",
      opts: [
        "Партнёрские ответы не разрешили встраивание через CORP или CORS",
        "COEP запрещает все картинки",
        "Картинки стали слишком большими",
        "Партнёр перешёл на HTTP/3",
      ],
      a: 0,
      why: "С `require-corp` каждый ресурс с другого источника должен явно согласиться на встраивание: `Cross-Origin-Resource-Policy: cross-origin` или ответ по CORS.",
    },
  ],
};
