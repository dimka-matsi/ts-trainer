import { useState, type ReactNode } from "react";
import type { DomTask, OutputTask } from "../../content/web/types";
import { CodeBlock, Md } from "../../ui/Code";
import { CodeEditor } from "../../ui/CodeEditor";
import { runHidden, type RunOutcome } from "../../web/runner";
import { ConsolePanel } from "./WebSandbox";

/** «Что выведется»: варианты ответа, после верного — объяснение и настоящий запуск в консоли. */
export function OutputTaskCard({ task, onSolved }: { task: OutputTask; onSolved(): void }) {
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [run, setRun] = useState<RunOutcome | null>(null);

  const choose = (j: number) => {
    if (j !== task.a) { setWrong((w) => [...w, j]); return; }
    setSolved(true);
    onSolved();
  };

  return (
    <>
      {task.html && (
        <details className="dt-html">
          <summary>index.html</summary>
          <CodeBlock code={task.html} className="code ty" />
        </details>
      )}
      <CodeBlock code={task.code} />
      <p className="tq"><Md text={task.q} /></p>
      <div className="opts">
        {task.opts.map((o, j) => (
          <button key={j} type="button" className={`opt mono${solved && j === task.a ? " right" : ""}${wrong.includes(j) ? " wrong" : ""}`}
            disabled={solved || wrong.includes(j)} onClick={() => choose(j)}>
            {o}
          </button>
        ))}
      </div>
      <div className="tfb" aria-live="polite">
        {solved ? (
          <>
            <p className="ok-t"><b>Верно.</b> <Md text={task.why} /></p>
            {!run && <button type="button" className="btn ghost small" onClick={() => void runHidden(task.html ?? "", task.code).then(setRun)}>Запустить и посмотреть консоль</button>}
            {run && <ConsolePanel lines={run.logs.map((l) => ({ type: "log", ...l }))} />}
          </>
        ) : wrong.length > 0 && (
          <p className="bad-t"><b>Не совсем.</b> Попробуй ещё раз: пройди код строка за строкой и подумай, когда срабатывает каждый обработчик.</p>
        )}
      </div>
    </>
  );
}

/** Задание на DOM: код ученика запускается в скрытом iframe вместе с тестами. */
export function DomTaskCard({ task, onSolved }: { task: DomTask; onSolved(): void }) {
  const [code, setCode] = useState(task.code);
  const [feedback, setFeedback] = useState<ReactNode>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => {
    const missing = (task.must ?? []).filter((m) => !code.includes(m));
    if (missing.length) {
      setFeedback(<>{missing.map((m) => <p key={m} className="where">В коде должно быть <code>{m}</code></p>)}</>);
      return;
    }
    setBusy(true);
    const r = await runHidden(task.html, code, task.tests);
    setBusy(false);
    const errors = r.logs.filter((l) => l.level === "error");
    if (r.test?.ok) {
      setFeedback(<p className="ok-t"><b>Всё сходится.</b> Тесты прошли.</p>);
      onSolved();
      return;
    }
    setFeedback(
      <>
        <p className="bad-t"><b>Пока не сходится.</b> {r.test ? <Md text={r.test.text ?? ""} /> : "Тесты не успели завершиться."}</p>
        {r.logs.length > 0 && <ConsolePanel lines={r.logs.map((l) => ({ type: "log", ...l }))} />}
        {errors.length > 0 && <p className="where">Сначала посмотри на ошибки в консоли.</p>}
      </>,
    );
  };

  return (
    <>
      <p className="tq"><Md text={task.goal} /></p>
      <details className="dt-html">
        <summary>index.html</summary>
        <CodeBlock code={task.html} className="code ty" />
      </details>
      <CodeEditor value={code} onChange={(v) => { setCode(v); setFeedback(null); }} fileName="script.js" label="Код задания" />
      <details className="tests">
        <summary>Тесты, которые должны пройти</summary>
        <p className="muted"><Md text={"Тесты выполняются после твоего кода. `assert(условие, текст)` падает с этим текстом, если условие ложно, `logs()` возвращает строки из `console.log`."} /></p>
        <CodeBlock code={task.tests} />
      </details>
      <div className="actions">
        <button type="button" className="btn" disabled={busy} onClick={() => void check()}>{busy ? "Проверяю…" : "Проверить"}</button>
        <button type="button" className="btn ghost" onClick={() => setFeedback(<p><b>Подсказка.</b> <Md text={task.hint} /></p>)}>Подсказка</button>
        <button type="button" className="btn ghost" onClick={() => setFeedback(
          <>
            <p><b>Решение.</b> Разберись, почему оно работает, и проверь его.</p>
            <CodeBlock code={task.solution} />
            <button type="button" className="btn ghost" onClick={() => setCode(task.solution)}>Вставить в редактор</button>
          </>,
        )}>Показать решение</button>
        <button type="button" className="btn ghost" onClick={() => { setCode(task.code); setFeedback(null); }}>Сбросить</button>
      </div>
      <div className="tfb" aria-live="polite">{feedback}</div>
    </>
  );
}
