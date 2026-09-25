import { useState, type ReactNode } from "react";
import type { RunTask } from "../../content/course/types";
import { runOutputInWorker, runTestsInWorker } from "../../state/jsRun";
import { CodeBlock, Md } from "../../ui/Code";
import { CodeEditor } from "../../ui/CodeEditor";

/** «Напиши код» на JavaScript: код выполняется в воркере, проверки — выражения с ожидаемым результатом. */
export function RunTaskCard({ task, onSolved }: { task: RunTask; onSolved: () => void }) {
  const [code, setCode] = useState(task.code);
  const [feedback, setFeedback] = useState<ReactNode>(null);
  const [busy, setBusy] = useState(false);

  const check = async () => {
    const broken = (task.forbid ?? []).filter((f) => new RegExp(f.re).test(code));
    if (broken.length) {
      setFeedback(<>{broken.map((f, i) => <p key={i} className="bad-t"><b>Нарушено условие.</b> <Md text={f.msg} /></p>)}</>);
      return;
    }
    setBusy(true);
    setFeedback(<p className="muted">Выполняю проверки…</p>);
    const results = await runTestsInWorker(code, task.tests);
    setBusy(false);
    if (!results) {
      setFeedback(<p className="bad-t"><b>Код не завершился.</b> Похоже на бесконечный цикл или промис, который никогда не выполнится.</p>);
      return;
    }
    const failed = results.filter((r) => !r.pass);
    if (!failed.length) {
      setFeedback(<p className="ok-t"><b>Все проверки прошли.</b> {results.length} из {results.length}.</p>);
      onSolved();
      return;
    }
    setFeedback(
      <>
        <p className="bad-t"><b>Прошло {results.length - failed.length} из {results.length}.</b></p>
        <ul className="rt">
          {failed.map((r, i) => <li key={i}><code>{r.expr}</code> вернул <code>{r.got}</code>, а ждали <code>{r.want}</code></li>)}
        </ul>
      </>,
    );
  };

  const showSolution = () => setFeedback(
    <>
      <p><b>Решение.</b> Разберись, почему оно работает, и проверь его.</p>
      <CodeBlock code={task.solution} />
      <button type="button" className="btn ghost" onClick={() => setCode(task.solution)}>Вставить в редактор</button>
    </>,
  );

  return (
    <>
      <p className="tq"><Md text={task.goal} /></p>
      <CodeEditor value={code} onChange={setCode} fileName="main.js" assist={false} />
      <details className="tests">
        <summary>Проверки</summary>
        <ul className="rt">{task.tests.map(([expr, want], i) => <li key={i}><code>{expr}</code> вернёт <code>{want}</code></li>)}</ul>
      </details>
      <div className="actions">
        <button type="button" className="btn" disabled={busy} onClick={check}>Проверить</button>
        <button type="button" className="btn ghost" onClick={() => setFeedback(<p><b>Подсказка.</b> <Md text={task.hint} /></p>)}>Подсказка</button>
        <button type="button" className="btn ghost" onClick={showSolution}>Показать решение</button>
        <button type="button" className="btn ghost" onClick={() => { setCode(task.code); setFeedback(null); }}>Сбросить</button>
      </div>
      <div className="tfb" aria-live="polite">{feedback}</div>
    </>
  );
}

/** Код с кнопкой «Запустить»: вывод появляется ниже, как в консоли DevTools. `hideCode` — код уже показан выше. */
export function RunnableCode({ code, hideCode = false }: { code: string; hideCode?: boolean }) {
  const [out, setOut] = useState<string[] | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    setOut(await runOutputInWorker(code));
    setBusy(false);
  };
  return (
    <div className="runnable">
      {!hideCode && <CodeBlock code={code} />}
      <div className="run-bar">
        <button type="button" className="btn small" disabled={busy} onClick={run}>{busy ? "Выполняю…" : out === undefined ? "▶ Запустить" : "▶ Ещё раз"}</button>
      </div>
      {out !== undefined && <ConsoleOutput lines={out} />}
    </div>
  );
}

/** Вывод консоли: строки, ошибки красным. `null` — код не завершился вовремя. */
export function ConsoleOutput({ lines }: { lines: string[] | null }) {
  return (
    <div className="jcon" role="log" aria-label="Вывод консоли">
      {lines === null ? <p className="con-err">Код не завершился за 5 секунд и был остановлен</p>
        : !lines.length ? <p className="con-empty">Ничего не выведено</p>
        : lines.map((l, i) => <p key={i} className={l.startsWith("Uncaught ") ? "con-err" : undefined}>{l}</p>)}
    </div>
  );
}
