import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "ck7",
  region: 4,
  level: "senior",
  title: "OAuth 2.0 и OpenID Connect",
  q: "Как работает вход через Google? Что такое OAuth 2.0, authorization code и PKCE?",
  answer:
    "OAuth 2.0 — протокол, которым пользователь разрешает приложению доступ к своим данным в другом сервисе, не отдавая пароль. В потоке authorization code приложение перенаправляет пользователя на сервер авторизации, тот после входа и согласия возвращает одноразовый код, а приложение меняет код на токены. PKCE защищает этот обмен: только тот, кто начал вход, знает секрет `code_verifier`. OpenID Connect добавляет `id_token` — подписанный JWT о том, кто вошёл. Это и есть «вход через Google».",
  theory: {
    p: [
      "Участники: пользователь, приложение (клиент), сервер авторизации `accounts.google.com` и API с данными. Приложение никогда не видит пароль от Google. Оно получает токен с ограниченными правами (scope), например «читать email».",
      "Поток authorization code. Приложение перенаправляет браузер на `/authorize?response_type=code&client_id=…&redirect_uri=…&scope=openid email&state=xyz&code_challenge=…`. Пользователь входит в Google и соглашается. Google перенаправляет его обратно на `redirect_uri?code=abc&state=xyz`. Приложение сверяет `state` — это защита от CSRF — и отправляет код на `/token`. В ответ приходит access-токен, иногда refresh, а в OpenID Connect ещё и `id_token`.",
      "PKCE (Proof Key for Code Exchange). Перед входом клиент придумывает случайный `code_verifier` и отправляет в `/authorize` только его хэш — `code_challenge`. При обмене кода клиент показывает сам `code_verifier`. Кто перехватил код, verifier не знает и обменять код не сможет. Браузерным и мобильным приложениям негде спрятать секрет клиента, поэтому для них PKCE обязателен. Старый implicit flow, где токен сразу приходил в адресе, больше не рекомендуют.",
      "OAuth — про доступ (authorization), а не про то, кто пользователь (authentication). Access-токен говорит «этому приложению можно читать email», но не «это Анна». OpenID Connect добавляет `scope=openid` и `id_token` — JWT с `sub` (идентификатор пользователя), `email`, `aud` (для какого приложения) и сроком. Приложение проверяет подпись `id_token` и создаёт у себя обычную сессию.",
    ],
    flow: {
      actors: ["Браузер", "Приложение\nshop.ru", "Google\nсервер авторизации"],
      steps: [
        { from: 0, to: 1, label: "нажал «Войти через Google»" },
        { from: 1, to: 0, label: "302 на /authorize?…code_challenge=H(v)&state=xyz", note: "verifier v остался у приложения" },
        { from: 0, to: 2, label: "GET /authorize…", note: "пользователь входит и соглашается" },
        { from: 2, to: 0, label: "302 на shop.ru/callback?code=abc&state=xyz" },
        { from: 0, to: 1, label: "GET /callback?code=abc&state=xyz", note: "приложение сверяет state" },
        { from: 1, to: 2, label: "POST /token: code=abc, code_verifier=v", note: "Google проверяет, что H(v) совпал" },
        { from: 2, to: 1, label: "access_token, id_token" },
        { from: 1, to: 0, label: "Set-Cookie: сессия shop.ru", note: "дальше обычная сессия приложения" },
      ],
    },
    keys: [
      "OAuth 2.0 выдаёт приложению ограниченный доступ без пароля пользователя.",
      "Authorization code + PKCE: код в адресе бесполезен без `code_verifier`. `state` защищает от CSRF.",
      "OpenID Connect добавляет `id_token` — JWT о том, кто вошёл.",
    ],
  },
  tasks: [
    {
      type: "order",
      q: "Расставь шаги входа через Google по порядку.",
      items: [
        "приложение перенаправляет на `/authorize` с `code_challenge` и `state`",
        "пользователь входит в Google и соглашается",
        "Google перенаправляет обратно с `code` и `state`",
        "приложение сверяет `state`",
        "приложение меняет `code` и `code_verifier` на токены",
        "приложение создаёт свою сессию",
      ],
      why: "Код приходит через браузер и поэтому считается открытым. Ценность у него появляется только вместе с verifier, который браузер не видел.",
    },
    {
      type: "quiz",
      q: "Зачем в OAuth параметр `state`?",
      opts: [
        "Чтобы приложение убедилось, что ответ пришёл на вход, который оно само начало",
        "Чтобы передать Google пароль пользователя",
        "Чтобы выбрать язык страницы входа",
        "Чтобы указать срок жизни токена",
      ],
      a: 0,
      why: "Без `state` злоумышленник может подсунуть свой код на `/callback`, и жертва войдёт в чужой аккаунт. Это CSRF на процесс входа.",
    },
    {
      type: "quiz",
      q: "Злоумышленник перехватил `code` из адреса перенаправления. Почему с PKCE он не получит токены?",
      opts: [
        "Для обмена нужен `code_verifier`, который знает только приложение",
        "Код действует только в том же браузере",
        "Google шифрует код ключом пользователя",
        "Код можно обменять только по HTTP/3",
      ],
      a: 0,
      why: "В `/authorize` ушёл только хэш verifier. Восстановить verifier по хэшу нельзя, а без него `/token` откажет.",
    },
  ],
};
