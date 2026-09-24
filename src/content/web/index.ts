import type { Flashcard } from "../flashcards";
import { lessons as cache } from "./lessons/cache";
import { lessons as cdn } from "./lessons/cdn";
import { lessons as cookies } from "./lessons/cookies";
import { lessons as cors } from "./lessons/cors";
import { lessons as dns } from "./lessons/dns";
import { lessons as http } from "./lessons/http";
import { lessons as net } from "./lessons/net";
import { lessons as security } from "./lessons/security";
import { lessons as tls } from "./lessons/tls";
import type { WebLesson, WebRegion } from "./types";

/** Уроки по регионам: индекс в массиве = индекс региона в WEB_REGIONS. */
const REGION_LESSONS: WebLesson[][] = [net, dns, http, tls, cookies, cache, cdn, cors, security];

/** Уроки раздела «Браузер» в порядке прохождения. */
export const WEB_LESSONS: WebLesson[] = REGION_LESSONS.flat();
export const WEB_LESSON_BY_ID: Record<string, WebLesson> = Object.fromEntries(WEB_LESSONS.map((l) => [l.id, l]));

/**
 * Регионы «Браузера»: сеть и протоколы, без JavaScript. Порядок — путь запроса:
 * от IP и TCP через DNS и HTTP к кэшу, безопасности и отрисовке страницы.
 * Темы «скоро» — вопросы, которые задают на фронтенд-собеседованиях.
 */
export const WEB_REGIONS: WebRegion[] = [
  { name: "Как работает интернет", kind: "lessons", desc: "IP-адреса и порты, уровни сети, TCP и UDP, путь запроса от URL до страницы." },
  { name: "DNS", kind: "lessons", desc: "Как имя сайта превращается в IP-адрес: путь запроса, записи, TTL, подмена и шифрование." },
  { name: "HTTP", kind: "lessons", desc: "Запрос и ответ, методы, коды, заголовки, соединения, стили API и версии протокола." },
  { name: "HTTPS и TLS", kind: "lessons", desc: "Зачем HTTPS, шифрование, сертификаты, рукопожатие TLS 1.3 и HSTS." },
  { name: "Cookies, сессии и вход", kind: "lessons", desc: "Как сервер узнаёт пользователя: cookies и их флаги, сторонние cookies, сессии и токены, OAuth." },
  { name: "Кэширование", kind: "lessons", desc: "HTTP-кэш браузера и общие кэши: свежесть, проверка и 304, файлы с хэшем, Vary, bfcache." },
  { name: "CDN, прокси и балансировка", kind: "lessons", desc: "Серверы между пользователем и приложением: CDN и его кэш, прокси, балансировщики." },
  { name: "CORS", kind: "lessons", desc: "Политика одного источника и как сервер разрешает чтение с других источников." },
  { name: "Безопасность", kind: "lessons", desc: "Атаки на сайт и защита от них: XSS, CSRF, CSP, clickjacking, чужой код, заголовки, изоляция." },
  { name: "Устройство браузера", kind: "soon", desc: "Из каких частей состоит браузер и как он изолирует сайты.", topics: [
    { t: "Процессы браузера", q: "Зачем браузеру отдельные процессы: главный, вкладок, GPU, сети?" },
    { t: "Изоляция сайтов и песочница", q: "Почему одна вкладка не может прочитать память другой?" },
    { t: "Движки", q: "Что такое Blink, WebKit и Gecko и почему сайт может выглядеть по-разному?" },
  ] },
  { name: "Рендеринг страницы", kind: "soon", desc: "Путь от байтов HTML до пикселей на экране и способы рендеринга сайта.", topics: [
    { t: "Critical rendering path", q: "Что происходит от получения HTML до первого кадра?" },
    { t: "Блокирующие ресурсы", q: "Почему CSS и скрипты в `<head>` задерживают отрисовку? Чем `async` отличается от `defer`?" },
    { t: "Layout, paint, composite", q: "Что вызывает перерасчёт раскладки и почему анимировать `transform` дешевле, чем `top`?" },
    { t: "Шрифты", q: "Что такое FOIT и FOUT и зачем `font-display`?" },
    { t: "CSR, SSR, SSG и гидратация", q: "Чем рендеринг на клиенте отличается от серверного и статической генерации?" },
  ] },
  { name: "Реальное время", kind: "soon", desc: "Как сервер отправляет данные сам: polling, SSE, WebSocket, WebRTC.", topics: [
    { t: "Polling и long polling", q: "Как получать обновления от сервера без WebSocket?" },
    { t: "Server-Sent Events", q: "Когда хватит SSE?" },
    { t: "WebSocket", q: "Как открывается WebSocket и чем он отличается от HTTP?" },
    { t: "WebRTC", q: "Как два браузера связываются напрямую и зачем серверы STUN и TURN?" },
  ] },
  { name: "Скорость загрузки", kind: "soon", desc: "Меньше байтов, меньше кругов туда-обратно, быстрее первый кадр.", topics: [
    { t: "Сжатие", q: "Как работают gzip и Brotli и что сжимать не стоит?" },
    { t: "Подсказки браузеру", q: "Чем отличаются `preload`, `prefetch`, `preconnect` и `dns-prefetch`?" },
    { t: "Картинки", q: "Какие форматы картинок выбрать и как отдать разный размер под разные экраны?" },
    { t: "Ленивая загрузка", q: "Как отложить загрузку картинок и iframe ниже первого экрана?" },
    { t: "Core Web Vitals", q: "Что измеряют LCP, INP и CLS и как их улучшить?" },
  ] },
];

/** Ключ экзамена региона в общем прогрессе: у TypeScript ключи 0…10, у «Браузера» 100 и дальше. */
export const WEB_EXAM_KEY = (region: number) => 100 + region;

/** Флеш-карточки «Браузера»: вопросы уроков и дополнительные. id начинаются с `net-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "net-rtt", region: 0, level: "junior",
    q: "Что такое RTT и почему он важен для скорости сайта?",
    a: "RTT — время, за которое пакет доходит до сервера и ответ возвращается обратно. Каждый обмен «вопрос-ответ» стоит хотя бы один RTT: TCP-рукопожатие, TLS, сам запрос. Поэтому сервер ближе к пользователю и меньше кругов туда-обратно ускоряют сайт сильнее, чем быстрый канал.",
  },
  {
    id: "net-nat", region: 0, level: "middle",
    q: "Что такое NAT и зачем он нужен?",
    a: "NAT — подмена адресов на роутере. Устройства дома получают частные адреса вроде `192.168.1.5`, а в интернет выходят под одним публичным адресом роутера. Роутер запоминает, чей был запрос, и возвращает ответ нужному устройству. Так экономят адреса IPv4.",
  },
  {
    id: "net-mac-ip", region: 0, level: "middle",
    q: "Чем MAC-адрес отличается от IP-адреса?",
    a: "MAC-адрес обычно задаёт производитель сетевой карты, и он нужен канальному уровню: доставить кадр соседнему устройству в той же сети. IP-адрес логический, его выдаёт сеть, и по нему пакет едет через много роутеров. На каждом отрезке пути MAC-адреса в кадре меняются, а IP-адреса в пакете остаются прежними.",
  },
  {
    id: "net-hol", region: 0, level: "senior",
    q: "Что такое head-of-line blocking и как с ним борются HTTP/2 и HTTP/3?",
    a: "Это когда один застрявший элемент задерживает всех за ним. В HTTP/1.1 ответы на одном соединении идут строго по очереди. HTTP/2 пускает много запросов по одному соединению, но TCP под ним всё равно ждёт каждый потерянный пакет. HTTP/3 работает на QUIC поверх UDP: потеря тормозит только свой поток.",
  },
];

export const WEB_FLASHCARDS: Flashcard[] = [
  ...WEB_LESSONS.map((l): Flashcard => ({
    id: `net-lesson-${l.id}`,
    region: l.region,
    level: "junior",
    q: l.q,
    a: l.answer,
  })),
  ...EXTRA_CARDS,
];
