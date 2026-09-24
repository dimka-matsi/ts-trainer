import { useState, type ReactNode } from "react";
import { checkCode } from "../../engine/check";
import type { CodeTask } from "../../content/types";
import { useEngine } from "../../state/engine";
import { useProgress } from "../../state/progress";
import { CodeBlock, Md } from "../../ui/Code";
import { CodeEditor, type EditorMark } from "../../ui/CodeEditor";
import { DiagnosticItem } from "../../ui/Diagnostic";

interface Props {
  task: CodeTask;
  onSolved: () => void;
}

/** «Почини код» и «Напиши тип»: проверка ошибок, скрытых тестов, запретов и запуска. */
export function CodeTaskCard({ task, onSolved }: Props) {
  const { engine } = useEngine();
  const { unlock } = useProgress();
  const [code, setCode] = useState(task.code);
  const [feedback, setFeedback] = useState<ReactNode>(null);
  const [marks, setMarks] = useState<EditorMark[]>([]);
  const edit = (next: string) => { setCode(next); setMarks([]); };

  const check = () => {
    if (!engine) { setFeedback(<p className="muted">Компилятор ещё загружается, попробуй через пару секунд.</p>); return; }
    const r = checkCode(engine, task, code);
    setMarks(r.errors);
    if (r.ok) {
      setFeedback(<p className="ok-t"><b>Всё сходится.</b> Ошибок нет{task.tests ? ", тесты прошли" : ""}{task.runtime ? ", проверки при запуске тоже" : ""}.</p>);
      if (task.kind === "write") unlock("firsttype");
      onSolved();
      return;
    }
    setFeedback(
      <>
        <p className="bad-t"><b>Пока не сходится.</b></p>
        {r.errors.map((d, i) => <DiagnosticItem key={`e${i}`} code={d.code} msg={d.msg} where={`строка ${d.line}`} />)}
        {r.testFailures.map((f, i) => <DiagnosticItem key={`t${i}`} code={f.code} msg={f.msg} where={<>тест не прошёл: <code>{f.line}</code></>} />)}
        {r.forbidden.map((f, i) => <p key={`f${i}`} className="where">Нарушено условие: <Md text={f} /></p>)}
        {r.missing.map((m, i) => <p key={`m${i}`} className="where">В коде должно остаться <code>{m}</code></p>)}
        {r.runtime.filter((x) => !x.pass).map((x, i) => (
          <p key={`r${i}`} className="where"><code>{x.expr}</code> вернул <code>{x.got}</code>, а ждали <code>{x.want}</code></p>
        ))}
      </>,
    );
  };

  const showSolution = () => setFeedback(
    <>
      <p><b>Решение.</b> Разберись, почему оно работает, и проверь его.</p>
      <CodeBlock code={task.solution} />
      <button type="button" className="btn ghost" onClick={() => edit(task.solution)}>Вставить в редактор</button>
    </>,
  );

  return (
    <>
      <p className="tq"><Md text={task.goal} /></p>
      <CodeEditor value={code} onChange={edit} marks={marks} />
      {task.tests && (
        <details className="tests">
          <summary>Тесты, которые должны пройти</summary>
          <p className="muted"><Md text={"Строка `Expect<Equal<A, B>>` компилируется, только если типы `A` и `B` совпадают. Строка после `// @ts-expect-error` должна давать ошибку, иначе тест не пройден."} /></p>
          <CodeBlock code={task.tests} />
        </details>
      )}
      {task.runtime && (
        <details className="tests">
          <summary>Проверки при запуске</summary>
          <ul className="rt">{task.runtime.map(([expr, want], i) => <li key={i}><code>{expr}</code> вернёт <code>{want}</code></li>)}</ul>
        </details>
      )}
      <div className="actions">
        <button type="button" className="btn" onClick={check}>Проверить</button>
        <button type="button" className="btn ghost" onClick={() => setFeedback(<p><b>Подсказка.</b> <Md text={task.hint} /></p>)}>Подсказка</button>
        <button type="button" className="btn ghost" onClick={showSolution}>Показать решение</button>
        <button type="button" className="btn ghost" onClick={() => { edit(task.code); setFeedback(null); }}>Сбросить</button>
      </div>
      <div className="tfb" aria-live="polite">{feedback}</div>
    </>
  );
}
