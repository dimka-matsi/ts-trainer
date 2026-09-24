import { buildDocument, HARNESS_TAG, type HarnessMessage } from "./harness";

export interface RunOutcome {
  logs: { level: "log" | "info" | "warn" | "error"; text: string }[];
  test?: { ok: boolean; text?: string };
}

const isHarness = (data: unknown): data is HarnessMessage =>
  typeof data === "object" && data !== null && (data as Record<string, unknown>)[HARNESS_TAG] === true;

/**
 * Подписка на сообщения конкретного iframe песочницы. Возвращает функцию отписки.
 * Iframe без allow-same-origin, поэтому сообщения сверяются по source.
 */
export function listenFrame(frame: HTMLIFrameElement, onMessage: (m: HarnessMessage) => void): () => void {
  const handler = (e: MessageEvent) => {
    if (e.source === frame.contentWindow && isHarness(e.data)) onMessage(e.data);
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

/** Запуск в скрытом iframe: для проверки заданий. Ждёт результата тестов или settleMs без тестов. */
export function runHidden(html: string, code: string, tests?: string, settleMs = 400): Promise<RunOutcome> {
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;border:0";
    const out: RunOutcome = { logs: [] };
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      stop();
      frame.remove();
      resolve(out);
    };
    const stop = listenFrame(frame, (m) => {
      if (m.type === "log") out.logs.push({ level: m.level, text: m.text });
      else { out.test = { ok: m.ok, text: m.text }; window.setTimeout(finish, 0); }
    });
    window.setTimeout(finish, tests == null ? settleMs : 4000);
    frame.srcdoc = buildDocument(html, code, tests);
    document.body.append(frame);
  });
}
