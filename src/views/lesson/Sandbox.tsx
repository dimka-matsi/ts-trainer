import { useEffect, useState } from "react";
import type { Declaration, Diagnostic } from "../../engine/engine";
import { useEngine } from "../../state/engine";
import { CodeBlock } from "../../ui/Code";
import { CodeEditor } from "../../ui/CodeEditor";
import { DiagnosticItem } from "../../ui/Diagnostic";

export function EngineStatus() {
  const { engine, status } = useEngine();
  if (status === "ready" && engine) return <span className="tsstat ready">Компилятор TypeScript {engine.version} готов, режим strict.</span>;
  if (status === "error") return <span className="tsstat">Компилятор не загрузился, обнови страницу.</span>;
  return <span className="tsstat">Компилятор TypeScript загружается…</span>;
}

/** Редактор примера с живыми ошибками и выведенными типами. */
export function Sandbox({ initial }: { initial: string }) {
  const { engine } = useEngine();
  const [code, setCode] = useState(initial);
  const [result, setResult] = useState<{ diags: Diagnostic[]; decls: Declaration[] } | null>(null);

  useEffect(() => {
    if (!engine) return;
    const t = setTimeout(() => {
      engine.set(code);
      setResult({ diags: engine.diagnostics(), decls: engine.declarations() });
    }, 200);
    return () => clearTimeout(t);
  }, [code, engine]);

  return (
    <div className="sbgrid">
      <CodeEditor value={code} onChange={setCode} label="Код песочницы" marks={result?.diags} />
      <div className="sbside">
        <div className="panel">
          <b>Что видит компилятор</b>
          {!result ? <p className="muted">Ждём компилятор…</p>
            : result.decls.length ? result.decls.map((d, i) => <CodeBlock key={i} code={d.info} className="code ty" />)
            : <p className="muted">Объяви тип или переменную, чтобы увидеть, что выводит компилятор.</p>}
        </div>
        <div className="panel">
          <b>Ошибки</b>
          {result && (result.diags.length
            ? result.diags.map((d, i) => <DiagnosticItem key={i} code={d.code} msg={d.msg} where={`строка ${d.line}`} />)
            : <p className="okline">Ошибок нет</p>)}
        </div>
      </div>
    </div>
  );
}
