/**
 * Обвязка запуска для раздела «Браузер»: собирает HTML-документ с разметкой, кодом ученика и тестами.
 * В браузере документ открывается в iframe с sandbox="allow-scripts" и шлёт сообщения родителю,
 * в verify — в jsdom, где window.__report задаётся заранее. Код ученика идёт отдельным <script>,
 * поэтому его объявления видны тестам.
 */

export type HarnessMessage =
  | { type: "log"; level: "log" | "info" | "warn" | "error"; text: string }
  | { type: "test"; ok: boolean; text?: string };

/** Метка сообщений от песочницы, чтобы не путать их с чужими postMessage. */
export const HARNESS_TAG = "__ts_trainer_web";

const PRELUDE = `(function () {
  var report = window.__report || function (m) { m.${HARNESS_TAG} = true; parent.postMessage(m, "*"); };
  window.__report = report;
  var fmt = function (v) {
    if (typeof v === "string") return v;
    if (v instanceof Element) return "<" + v.tagName.toLowerCase() + (v.id ? "#" + v.id : "") + ">";
    try { var s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
  };
  var logs = [];
  ["log", "info", "warn", "error"].forEach(function (level) {
    console[level] = function () {
      var text = Array.prototype.map.call(arguments, fmt).join(" ");
      if (level === "log") logs.push(text);
      report({ type: "log", level: level, text: text });
    };
  });
  window.addEventListener("error", function (e) { report({ type: "log", level: "error", text: String(e.message) }); });
  window.addEventListener("unhandledrejection", function (e) { report({ type: "log", level: "error", text: "Unhandled: " + String(e.reason) }); });
  window.logs = function () { return logs.slice(); };
  window.assert = function (cond, msg) { if (!cond) throw new Error(msg); };
  window.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
})();`;

const escapeScript = (code: string) => code.replace(/<\/script/gi, "<\\/script");

export function buildDocument(html: string, code: string, tests?: string): string {
  const testScript = tests == null ? "" : `<script>
(async function () {
  try {
    await (async function () {
${escapeScript(tests)}
    })();
    window.__report({ type: "test", ok: true });
  } catch (e) {
    window.__report({ type: "test", ok: false, text: e && e.message ? e.message : String(e) });
  }
})();
</script>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
body{font:14px/1.5 system-ui,sans-serif;margin:12px;color:#202124;background:#fff}
button{font:inherit;padding:4px 10px}
input,textarea{font:inherit}
</style><script>${PRELUDE}</script></head><body>
${html}
<script>
${escapeScript(code)}
</script>
${testScript}
</body></html>`;
}
