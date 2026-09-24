import { useEffect, useRef, useState } from "react";
import { CodeEditor } from "../../ui/CodeEditor";
import { buildDocument, type HarnessMessage } from "../../web/harness";
import { listenFrame } from "../../web/runner";

type LogLine = Extract<HarnessMessage, { type: "log" }>;

/** Консоль как в DevTools: строки с уровнями и счётчиком повторов. */
export function ConsolePanel({ lines, onClear }: { lines: LogLine[]; onClear?(): void }) {
  return (
    <div className="dt-console" role="log" aria-label="Консоль">
      <div className="dt-console-bar">
        <span>Console</span>
        {onClear && <button type="button" onClick={onClear} title="Очистить консоль">⊘</button>}
      </div>
      <div className="dt-console-body">
        {lines.length === 0 && <div className="dt-line empty">Пусто. Вызови console.log(...) в коде.</div>}
        {lines.map((l, i) => (
          <div key={i} className={`dt-line lv-${l.level}`}><span className="dt-arrow" aria-hidden="true">›</span>{l.text}</div>
        ))}
      </div>
    </div>
  );
}

/** Песочница «Браузера»: редактор JS и HTML, живая страница в изолированном iframe и консоль. */
export function WebSandbox({ html: initialHtml, code: initialCode }: { html: string; code: string }) {
  const [code, setCode] = useState(initialCode);
  const [html, setHtml] = useState(initialHtml);
  const [tab, setTab] = useState<"js" | "html">("js");
  const [doc, setDoc] = useState(() => buildDocument(initialHtml, initialCode));
  const [lines, setLines] = useState<LogLine[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);

  // Перезапуск через полсекунды после правки: страница и консоль отражают текущий код.
  // Если документ не изменился, iframe не перезагрузится — тогда и консоль не трогаем.
  const built = useRef(doc);
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = buildDocument(html, code);
      if (next === built.current) return;
      built.current = next;
      setLines([]);
      setDoc(next);
    }, 500);
    return () => window.clearTimeout(t);
  }, [html, code]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    return listenFrame(el, (m) => { if (m.type === "log") setLines((prev) => [...prev, m]); });
  }, [doc]);

  const rerun = () => {
    built.current = buildDocument(html, code);
    setLines([]);
    setDoc(built.current + `<!-- ${Date.now()} -->`);
  };

  return (
    <div className="dt-sandbox">
      <div className="dt-pane">
        <div className="dt-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "js"} onClick={() => setTab("js")}>script.js</button>
          <button type="button" role="tab" aria-selected={tab === "html"} onClick={() => setTab("html")}>index.html</button>
          <button type="button" className="dt-run" onClick={rerun} title="Перезапустить">▶ Запустить</button>
        </div>
        {tab === "js"
          ? <CodeEditor value={code} onChange={setCode} fileName="script.js" label="JavaScript песочницы" />
          : <CodeEditor value={html} onChange={setHtml} fileName="index.html" label="Разметка песочницы" assist={false} />}
      </div>
      <div className="dt-pane">
        <div className="dt-tabs"><span className="dt-tab-static">Страница</span></div>
        <iframe ref={frame} className="dt-preview" title="Результат" sandbox="allow-scripts" srcDoc={doc} />
        <ConsolePanel lines={lines} onClear={() => setLines([])} />
      </div>
    </div>
  );
}
