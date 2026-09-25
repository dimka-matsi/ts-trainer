import { useState } from "react";
import { probeType } from "../../engine/check";
import type { PredictTask, QuizTask } from "../../content/types";
import { useEngine } from "../../state/engine";
import { CodeBlock, Md } from "../../ui/Code";
import { RunnableCode } from "../course/RunTaskCard";

interface Props {
  task: PredictTask | QuizTask;
  onSolved: () => void;
}

/** «Предскажи тип» и «Вопрос»: неверный вариант гасится, верный раскрывает объяснение. */
export function ChoiceTaskCard({ task, onSolved }: Props) {
  const { engine } = useEngine();
  const [wrong, setWrong] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [compiler, setCompiler] = useState<string | null>(null);
  const predict = task.type === "predict";
  /** Варианты — код или вывод консоли: моноширинный шрифт, текст как есть. */
  const mono = predict || (task.type === "quiz" && !!task.output);

  const choose = (j: number) => {
    if (j !== task.a) { setWrong((w) => [...w, j]); return; }
    setSolved(true);
    if (task.type === "predict" && engine) setCompiler(probeType(engine, task.code, task.probe));
    onSolved();
  };

  return (
    <>
      {task.type === "predict" && <CodeBlock code={task.code} />}
      {task.type === "quiz" && task.code && <CodeBlock code={task.code} />}
      <p className="tq"><Md text={task.q} /></p>
      <div className="opts">
        {task.opts.map((o, j) => (
          <button key={j} type="button"
            className={`opt${mono ? " mono" : ""}${solved && j === task.a ? " right" : ""}${wrong.includes(j) ? " wrong" : ""}`}
            disabled={solved || wrong.includes(j)} onClick={() => choose(j)}>
            {mono ? o : <Md text={o} />}
          </button>
        ))}
      </div>
      <div className="tfb" aria-live="polite">
        {solved ? (
          <>
            <p className="ok-t"><b>Верно.</b> <Md text={task.why} /></p>
            {task.type === "quiz" && task.example && <CodeBlock code={task.example} />}
            {task.type === "quiz" && task.output && task.code && <RunnableCode code={task.code} hideCode />}
            {compiler && <><p className="where">Компилятор показывает:</p><CodeBlock code={compiler} className="code ty" /></>}
          </>
        ) : wrong.length > 0 && (
          <p className="bad-t"><b>Не совсем.</b> {predict ? "Попробуй ещё раз: подумай, что компилятор знает в этой точке."
            : mono ? "Попробуй ещё раз: пройди код построчно и запиши, что появится в консоли."
            : "Попробуй ещё раз: перечитай вопрос и вспомни главное из урока."}</p>
        )}
      </div>
    </>
  );
}
