/** Запуск документа песочницы «Браузер» в jsdom: для verify. */
import { JSDOM, VirtualConsole } from "jsdom";
import { buildDocument, type HarnessMessage } from "../src/web/harness";

export interface RunResult {
  logs: string[];
  errors: string[];
  test?: { ok: boolean; text?: string };
}

export function runInJsdom(html: string, code: string, tests?: string, settleMs = 80): Promise<RunResult> {
  return new Promise((resolve) => {
    const result: RunResult = { logs: [], errors: [] };
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", (e) => result.errors.push(e.message));
    let dom: JSDOM | undefined;
    const finish = () => { dom?.window.close(); resolve(result); };
    const timer = setTimeout(finish, tests == null ? settleMs : 3000);
    dom = new JSDOM(buildDocument(html, code, tests), {
      runScripts: "dangerously",
      pretendToBeVisual: true,
      virtualConsole,
      beforeParse(window) {
        (window as unknown as { __report: (m: HarnessMessage) => void }).__report = (m) => {
          if (m.type === "log") {
            if (m.level === "log") result.logs.push(m.text);
            if (m.level === "error") result.errors.push(m.text);
          } else {
            result.test = { ok: m.ok, text: m.text };
            clearTimeout(timer);
            setTimeout(finish, 0);
          }
        };
      },
    });
  });
}
