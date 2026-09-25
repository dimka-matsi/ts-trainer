import type { Flashcard } from "../flashcards";
import { makeCourse, type WebLesson, type WebRegion } from "../course/types";
import { FOLLOW_UPS } from "./interview";
import { lessons as attacks } from "./lessons/attacks";
import { lessons as auth } from "./lessons/auth";
import { lessons as cookies } from "./lessons/cookies";
import { lessons as cors } from "./lessons/cors";
import { lessons as headers } from "./lessons/headers";
import { lessons as ops } from "./lessons/ops";

/**
 * «Безопасность»: как атакуют сайт и как от этого защищаются. Опирается на «Браузер» (HTTP, cookies, TLS),
 * поэтому механизмы там, здесь — угрозы и защита. Порядок: флаги cookies → политика одного источника и CORS →
 * атаки → заголовки защиты → аутентификация, где всё собирается вместе → эксплуатация: файлы, секреты, нагрузка.
 */
const REGION_LESSONS: WebLesson[][] = [cookies, cors, attacks, headers, auth, ops];

const REGIONS: WebRegion[] = [
  { name: "Cookies и их флаги", kind: "lessons", desc: "Как защитить cookie: `HttpOnly`, `Secure`, `SameSite`, сторонние cookies и `Partitioned`." },
  { name: "CORS", kind: "lessons", desc: "Политика одного источника и как сервер разрешает чтение с других источников." },
  { name: "Атаки", kind: "lessons", desc: "XSS и защита от него, CSRF и CSRF-токены, clickjacking и открытый редирект, инъекции на сервере и SSRF, prototype pollution, `postMessage` и `sandbox`." },
  { name: "Заголовки защиты", kind: "lessons", desc: "Content Security Policy, Subresource Integrity и чужой код, nosniff и Referrer-Policy, изоляция COOP и COEP, Trusted Types." },
  { name: "Аутентификация", kind: "lessons", desc: "Сессия или JWT и где хранить токен, access- и refresh-токены, OAuth 2.0 и OpenID Connect, хранение паролей, двухфакторная аутентификация и passkeys, права доступа и IDOR." },
  { name: "Эксплуатация", kind: "lessons", desc: "Загрузка файлов, секреты и личные данные во фронтенде, лимит запросов, боты и DDoS." },
];

/** Дополнительные карточки: частые вопросы собеседований, которые не стали отдельным уроком. id начинаются с `sec-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "sec-owasp", region: 2, level: "middle",
    q: "Что такое OWASP Top 10 и какие уязвимости в нём главные для фронтенда?",
    a: "OWASP Top 10 — список самых опасных уязвимостей веб-приложений, который обновляется раз в несколько лет. Для фронтенда важнее всего внедрение кода, включая XSS, ошибки контроля доступа, небезопасная аутентификация и уязвимые зависимости. На собеседовании хорошо связать их с защитой: экранирование и CSP, проверка прав на сервере, флаги cookies, аудит пакетов.",
  },
  {
    id: "sec-client-validation", region: 2, level: "junior",
    q: "Достаточно ли проверять данные формы на фронтенде?",
    a: "Нет. Проверка на фронтенде — удобство для пользователя: быстрая подсказка без запроса. Злоумышленник отправит запрос напрямую, минуя интерфейс, поэтому всё, что важно для безопасности, проверяет сервер: права, формат, лимиты. Фронтенд и сервер проверяют одно и то же, но доверять можно только серверу.",
  },
];

/** Курс «Безопасность». Карточки уроков — `sec-lesson-<id>`, экзамены — 300 + регион. */
export const SEC = makeCourse("sec", "Безопасность", REGIONS, REGION_LESSONS, EXTRA_CARDS, "sec", 300, { followUps: FOLLOW_UPS });
