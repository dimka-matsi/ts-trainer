import type { Flashcard } from "../flashcards";
import { lessons as browser } from "./lessons/browser";
import { lessons as cache } from "./lessons/cache";
import { lessons as cdn } from "./lessons/cdn";
import { lessons as cookies } from "./lessons/cookies";
import { lessons as cors } from "./lessons/cors";
import { lessons as dns } from "./lessons/dns";
import { lessons as http } from "./lessons/http";
import { lessons as net } from "./lessons/net";
import { lessons as realtime } from "./lessons/realtime";
import { lessons as render } from "./lessons/render";
import { lessons as security } from "./lessons/security";
import { lessons as tls } from "./lessons/tls";
import { makeCourse, type WebLesson, type WebRegion } from "../course/types";

/** Уроки по регионам: индекс в массиве = индекс региона в WEB_REGIONS. */
const REGION_LESSONS: WebLesson[][] = [net, dns, http, tls, cookies, cache, cdn, cors, security, browser, render, realtime];


/**
 * Регионы «Браузера»: сеть и протоколы, без JavaScript. Порядок — путь запроса:
 * от IP и TCP через DNS и HTTP к кэшу, безопасности и отрисовке страницы.
 * Темы «скоро» — вопросы, которые задают на фронтенд-собеседованиях.
 */
const REGIONS: WebRegion[] = [
  { name: "Как работает интернет", kind: "lessons", desc: "IP-адреса и порты, уровни сети, TCP и UDP, путь запроса от URL до страницы." },
  { name: "DNS", kind: "lessons", desc: "Как имя сайта превращается в IP-адрес: путь запроса, записи, TTL, подмена и шифрование." },
  { name: "HTTP", kind: "lessons", desc: "Запрос и ответ, методы, коды, заголовки, соединения, стили API и версии протокола." },
  { name: "HTTPS и TLS", kind: "lessons", desc: "Зачем HTTPS, шифрование, сертификаты, рукопожатие TLS 1.3 и HSTS." },
  { name: "Cookies, сессии и вход", kind: "lessons", desc: "Как сервер узнаёт пользователя: cookies и их флаги, сторонние cookies, сессии и токены, OAuth." },
  { name: "Кэширование", kind: "lessons", desc: "HTTP-кэш браузера и общие кэши: свежесть, проверка и 304, файлы с хэшем, Vary, bfcache." },
  { name: "CDN, прокси и балансировка", kind: "lessons", desc: "Серверы между пользователем и приложением: CDN и его кэш, прокси, балансировщики." },
  { name: "CORS", kind: "lessons", desc: "Политика одного источника и как сервер разрешает чтение с других источников." },
  { name: "Безопасность", kind: "lessons", desc: "Атаки на сайт и защита от них: XSS, CSRF, CSP, clickjacking, чужой код, заголовки, изоляция." },
  { name: "Устройство браузера", kind: "lessons", desc: "Из каких процессов состоит браузер, как он изолирует сайты и чем отличаются движки." },
  { name: "Рендеринг страницы", kind: "lessons", desc: "Путь от байтов HTML до пикселей, блокирующие ресурсы, шрифты и способы рендеринга сайта." },
  { name: "Реальное время", kind: "lessons", desc: "Как сервер отправляет данные сам: polling, Server-Sent Events, WebSocket, WebRTC." },
];

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

/** Курс «Браузер»: как устроены сеть и браузер. Карточки уроков — `net-lesson-<id>`, экзамены — 100 + регион. */
export const WEB = makeCourse("web", "Браузер", REGIONS, REGION_LESSONS, EXTRA_CARDS, "net", 100);
