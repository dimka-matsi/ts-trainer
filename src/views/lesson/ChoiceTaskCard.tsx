import { useState } from "react";
import { probeType } from "../../engine/check";
import type { PredictTask, QuizTask } from "../../content/types";
import { useEngine } from "../../state/engine";
import { CodeBlock, Md } from "../../ui/Code";

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

  const choose = (j: number) => {
    if (j !== task.a) { setWrong((w) => [...w, j]); return; }
    setSolved(true);
    if (task.type === "predict" && engine) setCompiler(probeType(engine, task.code, task.probe));
    onSolved();
  };

  return (
    <>
      {task.type === "predict" && <CodeBlock code={task.code} />}
      <p className="tq"><Md text={task.q} /></p>
      <div className="opts">
        {task.opts.map((o, j) => (
          <button key={j} type="button"
            className={`opt${predict ? " mono" : ""}${solved && j === task.a ? " right" : ""}${wrong.includes(j) ? " wrong" : ""}`}
            disabled={solved || wrong.includes(j)} onClick={() => choose(j)}>
            {predict ? o : <Md text={o} />}
          </button>
        ))}
      </div>
      <div className="tfb" aria-live="polite">
        {solved ? (
          <>
            <p className="ok-t"><b>Верно.</b> <Md text={task.why} /></p>
            {compiler && <><p className="where">Компилятор показывает:</p><CodeBlock code={compiler} className="code ty" /></>}
          </>
        ) : wrong.length > 0 && (
          <p className="bad-t"><b>Не совсем.</b> Попробуй ещё раз: подумай, что компилятор знает в этой точке.</p>
        )}
      </div>
    </>
  );
}
