/**
 * Проверка раздела «Браузер» (сеть и протоколы):
 *  - форма урока: 3–4 абзаца, ровно три главных пункта, 2–4 задания хотя бы двух видов;
 *  - задания: ответ в пределах вариантов, варианты и пары не повторяются, у групп есть пункты;
 *  - схемы и запросы: участники существуют, стартовые строки и коды ответа — настоящие,
 *    фазы тайминга идут в порядке DevTools, у HTTP/1.1 есть Host, у 304 нет тела,
 *    `SameSite=None` только вместе с `Secure`;
 *  - в разделе нет JavaScript: только сеть и протоколы;
 *  - порядок тем: понятие не встречается раньше урока, где его объясняют.
 */
import { LESSONS } from "../src/content/lessons";
import { WEB_FLASHCARDS, WEB_LESSONS, WEB_REGIONS } from "../src/content/web";
import type { HttpMessage, NetRequest, WebLesson, WebTask } from "../src/content/web/types";

/** Где понятие объясняют впервые. Раньше этого урока его не упоминают. */
const CONCEPTS: { name: string; re: RegExp; at: string }[] = [
  { name: "TCP", re: /\bTCP\b/, at: "net2" },
  { name: "UDP", re: /\bUDP\b/, at: "net2" },
  { name: "DNS", re: /\bDNS\b/, at: "net2" },
  { name: "OSI", re: /\bOSI\b|\bL[47]\b/, at: "net2" },
  { name: "рукопожатие", re: /рукопожати|\bSYN\b|\bACK\b/, at: "net3" },
  { name: "RTT", re: /\bRTT\b/, at: "net3" },
  { name: "head-of-line blocking", re: /head-of-line/, at: "net3" },
  { name: "QUIC", re: /\bQUIC\b/, at: "net4" },
  { name: "HTTP/2 и HTTP/3", re: /HTTP\/[23]\b/, at: "net4" },
  { name: "TLS", re: /\bTLS\b/, at: "net5" },
  { name: "DOM", re: /\bDOM\b/, at: "net5" },
  { name: "резолвер", re: /резолвер/i, at: "dns1" },
  { name: "TTL", re: /\bTTL\b/, at: "dns1" },
  { name: "CNAME", re: /\bCNAME\b/, at: "dns2" },
  { name: "DNSSEC и DoH", re: /\bDNSSEC\b|\bDoH\b|DNS over/, at: "dns4" },
  { name: "идемпотентность", re: /идемпотент/i, at: "http2" },
  { name: "keep-alive", re: /keep-alive/i, at: "http5" },
  { name: "REST и GraphQL", re: /\bREST\b|GraphQL|gRPC/, at: "http6" },
  { name: "мультиплексирование", re: /мультиплекс|HPACK/i, at: "http7" },
  { name: "MITM и SNI", re: /\bMITM\b|посередине|\bSNI\b/, at: "tls1" },
  { name: "обмен ключами", re: /ECDHE|Диффи|прямая секретность|forward secrecy/i, at: "tls2" },
  { name: "центр сертификации", re: /центр сертификации|Let's Encrypt|Certificate Transparency|промежуточн\S* (центр|сертификат)/i, at: "tls3" },
  { name: "0-RTT", re: /0-RTT|ClientHello/, at: "tls4" },
  { name: "HSTS", re: /\bHSTS\b|Strict-Transport-Security/i, at: "tls5" },
  { name: "cookie", re: /cookie(?!s, сессии)/i, at: "ck1" },
  { name: "XSS", re: /\bXSS\b/, at: "ck2" },
  { name: "CSRF", re: /\bCSRF\b/, at: "ck3" },
  { name: "сторонние cookies", re: /сторонн\S* cookie|Partitioned|CHIPS/i, at: "ck4" },
  { name: "JWT", re: /\bJWT\b/, at: "ck5" },
  { name: "refresh-токен", re: /refresh/i, at: "ck6" },
  { name: "OAuth", re: /OAuth|PKCE|OpenID/, at: "ck7" },
];

/** Признаки JavaScript: в «Браузере» его быть не должно. */
const JS = /=>|\bfunction\b|\bconst\s|\blet\s|console\.|addEventListener|document\.(?!cookie\b)|fetch\(/;

/** Коды ответа и их стандартные фразы (RFC 9110). */
const REASONS: Record<string, string> = {
  "100": "Continue", "101": "Switching Protocols",
  "200": "OK", "201": "Created", "202": "Accepted", "204": "No Content", "206": "Partial Content",
  "301": "Moved Permanently", "302": "Found", "303": "See Other", "304": "Not Modified", "307": "Temporary Redirect", "308": "Permanent Redirect",
  "400": "Bad Request", "401": "Unauthorized", "403": "Forbidden", "404": "Not Found", "405": "Method Not Allowed", "409": "Conflict", "410": "Gone", "413": "Content Too Large", "415": "Unsupported Media Type", "422": "Unprocessable Content", "429": "Too Many Requests",
  "500": "Internal Server Error", "501": "Not Implemented", "502": "Bad Gateway", "503": "Service Unavailable", "504": "Gateway Timeout",
};

/** Фазы запроса в том порядке, в каком их показывает вкладка «Сеть». */
const PHASES = ["Очередь", "DNS", "TCP", "TLS", "Ожидание ответа", "Загрузка"];

const METHODS = /^(GET|HEAD|POST|PUT|PATCH|DELETE|OPTIONS) \S+ HTTP\/(1\.0|1\.1|2|3)$/;

const taskText = (t: WebTask) =>
  t.type === "quiz" ? [t.q, ...t.opts, t.why, t.example ?? ""]
    : t.type === "order" ? [t.q, ...t.items, t.why]
    : t.type === "match" ? [t.q, ...t.pairs.flat(), t.why]
    : [t.q, ...t.groups, ...t.items.map(([s]) => s), t.why];

const messageText = (m: HttpMessage) => [m.line, ...m.headers.map(([k, v]) => `${k}: ${v}`), m.body ?? ""];

function lessonText(l: WebLesson): string[] {
  const flow = l.theory.flow ? [...l.theory.flow.actors, ...l.theory.flow.steps.flatMap((s) => [s.label, s.note ?? ""])] : [];
  const reqs = (l.theory.requests ?? []).flatMap((r) => [r.name, ...messageText(r.request), ...messageText(r.response)]);
  return [l.title, l.q, l.answer, ...l.theory.p, ...l.theory.keys, ...flow, ...reqs, ...l.tasks.flatMap(taskText)];
}

const header = (m: HttpMessage, name: string) => m.headers.filter(([k]) => k.toLowerCase() === name.toLowerCase()).map(([, v]) => v);

function checkRequest(r: NetRequest, tag: string, fail: (msg: string) => void) {
  const req = METHODS.exec(r.request.line);
  if (!req) fail(`${tag}: стартовая строка запроса «${r.request.line}» не похожа на HTTP`);
  else if (req[2] === "1.1" && header(r.request, "Host").length !== 1) fail(`${tag}: в HTTP/1.1 нужен ровно один заголовок Host`);
  const res = /^HTTP\/(1\.0|1\.1|2|3) (\d{3})(?: (.*))?$/.exec(r.response.line);
  if (!res) fail(`${tag}: строка ответа «${r.response.line}» не похожа на HTTP`);
  else {
    const [, version, code, reason] = res;
    const legacy = version!.startsWith("1");
    if (req && (req[2]!.startsWith("1") !== legacy)) fail(`${tag}: версии HTTP у запроса и ответа разные`);
    if (!REASONS[code!]) fail(`${tag}: неизвестный код ${code}`);
    // В HTTP/2 и HTTP/3 фразы после кода нет, в HTTP/1.x она обязательна.
    else if (legacy && reason !== REASONS[code!]) fail(`${tag}: у кода ${code} фраза «${REASONS[code!]}», а не «${reason}»`);
    else if (!legacy && reason) fail(`${tag}: в HTTP/${version} нет фразы после кода`);
    if ((code === "304" || code === "204") && r.response.body) fail(`${tag}: у ответа ${code} не бывает тела`);
  }
  for (const [side, m] of [["запрос", r.request], ["ответ", r.response]] as const) {
    const len = header(m, "Content-Length")[0];
    // Тело с «…» показано не целиком, его длину не сверяем.
    if (len && m.body && !m.body.includes("…") && Number(len) !== Buffer.byteLength(m.body)) {
      fail(`${tag}: ${side}: Content-Length ${len}, а в теле ${Buffer.byteLength(m.body)} байт`);
    }
  }
  if (r.request.body && !header(r.request, "Content-Type").length) fail(`${tag}: у запроса с телом нет Content-Type`);
  for (const c of header(r.response, "Set-Cookie")) {
    const secure = /;\s*secure\b/i.test(c);
    if (/samesite=none/i.test(c) && !secure) fail(`${tag}: cookie с SameSite=None без Secure браузер отклонит`);
    if (/partitioned/i.test(c) && !secure) fail(`${tag}: Partitioned-cookie без Secure браузер отклонит`);
    if (/^__Secure-/.test(c) && !secure) fail(`${tag}: префикс __Secure- требует Secure`);
    if (/^__Host-/.test(c) && (!secure || !/;\s*path=\/(;|$)/i.test(c) || /;\s*domain=/i.test(c))) fail(`${tag}: префикс __Host- требует Secure, Path=/ и запрещает Domain`);
  }
  let last = -1;
  for (const [phase, ms] of r.timing) {
    const at = PHASES.indexOf(phase);
    if (at < 0) fail(`${tag}: неизвестная фаза «${phase}»`);
    else if (at <= last) fail(`${tag}: фаза «${phase}» стоит не на своём месте`);
    last = Math.max(last, at);
    if (!(ms > 0)) fail(`${tag}: у фазы «${phase}» длительность должна быть больше нуля`);
  }
  const has = (p: string) => r.timing.some(([x]) => x === p);
  if (has("TLS") && !has("TCP")) fail(`${tag}: TLS без нового TCP-соединения не бывает`);
  if (!has("Ожидание ответа") || !has("Загрузка")) fail(`${tag}: у запроса нет ожидания ответа или загрузки`);
}

export function checkWeb(fail: (msg: string) => void) {
  const order = WEB_LESSONS.map((l) => l.id);
  if (new Set(order).size !== order.length) fail("id уроков «Браузера» повторяются");
  // Прогресс хранится по id урока, поэтому id не должны совпадать с уроками TypeScript.
  const tsIds = new Set(LESSONS.map((l) => l.id));
  for (const id of order) if (tsIds.has(id)) fail(`${id}: такой id уже есть у урока TypeScript`);
  // Уроки идут регион за регионом, в экзамене региона хотя бы 6 вопросов.
  WEB_LESSONS.forEach((l, i) => { if (i > 0 && l.region < WEB_LESSONS[i - 1]!.region) fail(`${l.id}: уроки регионов перемешаны`); });
  WEB_REGIONS.forEach((r, ri) => {
    const mine = WEB_LESSONS.filter((l) => l.region === ri);
    if (r.kind === "lessons" && !mine.length) fail(`регион «${r.name}» с уроками, но уроков нет`);
    if (r.kind === "soon" && mine.length) fail(`регион «${r.name}» помечен «скоро», но в нём есть уроки`);
    const quizzes = mine.flatMap((l) => l.tasks.filter((t) => t.type === "quiz")).length;
    if (r.kind === "lessons" && quizzes < 6) fail(`регион «${r.name}»: для экзамена нужно хотя бы 6 вопросов, есть ${quizzes}`);
  });

  for (const lesson of WEB_LESSONS) {
    console.log(`${lesson.id} ${lesson.title}`);
    const tag = lesson.id;
    if (!WEB_REGIONS[lesson.region] || WEB_REGIONS[lesson.region]!.kind !== "lessons") fail(`${tag}: регион ${lesson.region} не с уроками`);
    const { p, keys, flow, requests } = lesson.theory;
    if (p.length < 3 || p.length > 4) fail(`${tag}: в теории ${p.length} абзацев, нужно 3–4`);
    if (keys.length !== 3) fail(`${tag}: главных пунктов ${keys.length}, нужно ровно 3`);
    if (!flow && !requests?.length) fail(`${tag}: нет ни схемы, ни запросов для разбора`);
    if (lesson.tasks.length < 2 || lesson.tasks.length > 4) fail(`${tag}: заданий ${lesson.tasks.length}, нужно 2–4`);
    if (new Set(lesson.tasks.map((t) => t.type)).size < 2) fail(`${tag}: все задания одного вида`);

    if (flow) {
      if (flow.actors.length < 2) fail(`${tag}: на схеме меньше двух участников`);
      flow.steps.forEach((s, i) => {
        if (!flow.actors[s.from] || !flow.actors[s.to]) fail(`${tag}: шаг ${i + 1} схемы ссылается на несуществующего участника`);
      });
    }
    (requests ?? []).forEach((r) => checkRequest(r, `${tag} запрос ${r.name}`, fail));

    const texts = lessonText(lesson);
    for (const text of texts) {
      const m = JS.exec(text);
      if (m) fail(`${tag}: в «Браузере» не должно быть JavaScript: …${text.slice(Math.max(0, m.index - 30), m.index + 30)}…`);
    }
    const pos = order.indexOf(lesson.id);
    for (const c of CONCEPTS) {
      if (order.indexOf(c.at) <= pos) continue;
      for (const text of texts) {
        const m = c.re.exec(text);
        if (m) { fail(`${tag}: «${c.name}» встречается раньше урока ${c.at}: …${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ")}…`); break; }
      }
    }

    for (const [i, task] of lesson.tasks.entries()) {
      const t = `${tag} [${i + 1}] ${task.type}`;
      if (task.type === "quiz") {
        if (task.a < 0 || task.a >= task.opts.length) fail(`${t}: индекс ответа вне вариантов`);
        if (new Set(task.opts).size !== task.opts.length) fail(`${t}: варианты повторяются`);
      } else if (task.type === "order") {
        if (task.items.length < 3) fail(`${t}: меньше трёх шагов`);
        if (new Set(task.items).size !== task.items.length) fail(`${t}: шаги повторяются`);
      } else if (task.type === "match") {
        if (task.pairs.length < 3) fail(`${t}: меньше трёх пар`);
        if (new Set(task.pairs.map(([l]) => l)).size !== task.pairs.length) fail(`${t}: левые части повторяются`);
        if (new Set(task.pairs.map(([, r]) => r)).size !== task.pairs.length) fail(`${t}: правые части повторяются, ответ неоднозначен`);
      } else {
        if (task.groups.length < 2) fail(`${t}: меньше двух групп`);
        if (task.items.length < 4) fail(`${t}: меньше четырёх пунктов`);
        if (new Set(task.items.map(([s]) => s)).size !== task.items.length) fail(`${t}: пункты повторяются`);
        task.groups.forEach((g, gi) => { if (!task.items.some(([, x]) => x === gi)) fail(`${t}: в группу «${g}» ничего не попадает`); });
        task.items.forEach(([s, gi]) => { if (!task.groups[gi]) fail(`${t}: у «${s}» нет группы ${gi}`); });
      }
    }
  }

  console.log("карточки «Браузера»");
  const ids = new Set<string>();
  const questions = new Set<string>();
  for (const card of WEB_FLASHCARDS) {
    if (ids.has(card.id) || questions.has(card.q)) fail(`карточка ${card.id}: повторяется id или вопрос`);
    ids.add(card.id);
    questions.add(card.q);
    if (!WEB_REGIONS[card.region]) fail(`карточка ${card.id}: нет региона ${card.region}`);
    const m = JS.exec([card.q, card.a, card.code ?? ""].join("\n"));
    if (m) fail(`карточка ${card.id}: в «Браузере» не должно быть JavaScript`);
  }
  return { lessons: WEB_LESSONS.length, cards: WEB_FLASHCARDS.length };
}
