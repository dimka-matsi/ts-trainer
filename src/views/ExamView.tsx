import { useState } from "react";
import { EXAM_PASS, EXAM_SIZE, examPool, type ExamTask } from "../content/exams";
import { LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { useProgress } from "../state/progress";
import { shuffle } from "../state/random";
import { navigate, type Route } from "../state/route";
import { CodeBlock, Md } from "../ui/Code";

interface Question {
  task: ExamTask;
  /** Порядок показа вариантов: индексы из task.opts. */
  order: number[];
}

interface Run {
  questions: Question[];
  /** Выбранный вариант по каждому вопросу. */
  chosen: number[];
  index: number;
  done: boolean;
}

/** Что нужно экзамену: название региона, вопросы и куда вести кнопки. Общий для всех направлений. */
export interface ExamConfig {
  name: string;
  regionNo: number;
  pool: ExamTask[];
  /** Ключ результата в progress.exams. */
  examKey: number;
  /** Откуда вопросы — фраза для экрана перед началом. */
  source: string;
  back: Route;
  cards: Route;
}

/** Экзамен региона TypeScript. */
export const tsExam = (region: number): ExamConfig => ({
  name: REGIONS[region]!.name,
  regionNo: region + 1,
  pool: examPool(region),
  examKey: region,
  source: LESSONS.some((l) => l.region === region) ? "Вопросы берутся из упражнений уроков и из отдельного банка экзамена" : "Вопросы берутся из банка экзамена",
  back: { view: "map" },
  cards: { view: "cards" },
});

function draw(pool: ExamTask[]): Run {
  const questions = shuffle(pool).slice(0, EXAM_SIZE)
    .map((task) => ({ task, order: shuffle(task.opts.map((_, i) => i)) }));
  return { questions, chosen: [], index: 0, done: false };
}

const isRight = (run: Run, j: number) => run.chosen[j] === run.questions[j]!.task.a;

/** Итоговый экзамен по региону: случайные вопросы, одна попытка на вопрос, разбор ошибок в конце. */
export function ExamView({ cfg }: { cfg: ExamConfig }) {
  const { progress, setExam } = useProgress();
  const [run, setRun] = useState<Run | null>(null);
  const pool = cfg.pool;
  const best = progress.exams[cfg.examKey];
  const crumb = <p className="crumb">Итоговый экзамен · регион {cfg.regionNo}</p>;

  if (!run) {
    return (
      <section className="intro exam">
        {crumb}
        <h1>{cfg.name}</h1>
        <p>{Math.min(EXAM_SIZE, pool.length)} случайных вопросов по темам региона. На каждый вопрос одна попытка, объяснение появляется сразу после ответа. Чтобы сдать, нужно {EXAM_PASS}% правильных.</p>
        <p className="how">{cfg.source}, всего {pool.length}. Каждая попытка — новый набор и новый порядок вариантов.</p>
        {best != null && <p className="how">Лучший результат: <b>{best}%</b>{best >= EXAM_PASS ? ", экзамен сдан" : ""}.</p>}
        <div className="actions">
          <button type="button" className="btn" onClick={() => setRun(draw(pool))}>Начать экзамен</button>
          <button type="button" className="btn ghost" onClick={() => navigate(cfg.back)}>К карте</button>
        </div>
      </section>
    );
  }

  const total = run.questions.length;

  if (run.done) {
    const right = run.questions.filter((_, j) => isRight(run, j)).length;
    const pct = Math.round((right / total) * 100);
    const passed = pct >= EXAM_PASS;
    const mistakes = run.questions.map((q, j) => ({ q, chosen: run.chosen[j]! })).filter((_, j) => !isRight(run, j));
    return (
      <section className="intro exam">
        {crumb}
        <h1>{passed ? "Экзамен сдан" : "Пока не сдан"}</h1>
        <div className="stats">
          <div><b>{right}/{total}</b><span>правильно</span></div>
          <div><b className={passed ? "ok-num" : "bad-num"}>{pct}%</b><span>нужно {EXAM_PASS}%</span></div>
          <div><b>{Math.max(pct, best ?? 0)}%</b><span>лучший результат</span></div>
        </div>
        <ExamBar run={run} />
        {mistakes.length > 0 ? (
          <div className="block">
            <h2>Разбор ошибок</h2>
            {mistakes.map(({ q, chosen }, j) => (
              <article key={j} className="task">
                {q.task.type === "predict" && <CodeBlock code={q.task.code} />}
        {q.task.type === "quiz" && q.task.code && <CodeBlock code={q.task.code} />}
                <p className="tq"><Md text={q.task.q} /></p>
                <p className="where">Твой ответ: <Opt task={q.task} i={chosen} /> · правильно: <Opt task={q.task} i={q.task.a} /></p>
                <p><Md text={q.task.why} /></p>
                {q.task.type === "quiz" && q.task.example && <CodeBlock code={q.task.example} />}
              </article>
            ))}
          </div>
        ) : <p className="okline">Ни одной ошибки.</p>}
        <div className="actions">
          <button type="button" className="btn" onClick={() => setRun(draw(pool))}>Новая попытка</button>
          <button type="button" className="btn ghost" onClick={() => navigate(cfg.cards)}>Повторить по карточкам</button>
          <button type="button" className="btn ghost" onClick={() => navigate(cfg.back)}>К карте</button>
        </div>
      </section>
    );
  }

  const q = run.questions[run.index]!;
  const chosen = run.chosen[run.index];
  const answered = chosen !== undefined;
  const last = run.index === total - 1;

  const choose = (opt: number) => {
    if (answered) return;
    const next = { ...run, chosen: [...run.chosen, opt] };
    setRun(next);
    if (next.chosen.length === total) {
      const right = next.questions.filter((_, j) => isRight(next, j)).length;
      setExam(cfg.examKey, Math.round((right / total) * 100));
    }
  };

  return (
    <section className="intro exam">
      <p className="crumb">Экзамен «{cfg.name}» · вопрос {run.index + 1} из {total}</p>
      <ExamBar run={run} />
      <article className="task exam-q">
        {q.task.type === "predict" && <CodeBlock code={q.task.code} />}
        {q.task.type === "quiz" && q.task.code && <CodeBlock code={q.task.code} />}
        <p className="tq"><Md text={q.task.q} /></p>
        <div className="opts">
          {q.order.map((j) => (
            <button key={j} type="button"
              className={`opt${q.task.type === "predict" ? " mono" : ""}${answered && j === q.task.a ? " right" : ""}${answered && j === chosen && j !== q.task.a ? " wrong" : ""}`}
              disabled={answered} onClick={() => choose(j)}>
              {q.task.type === "predict" ? q.task.opts[j] : <Md text={q.task.opts[j] ?? ""} />}
            </button>
          ))}
        </div>
        <div className="tfb" aria-live="polite">
          {answered && (
            <p className={chosen === q.task.a ? "ok-t" : "bad-t"}>
              <b>{chosen === q.task.a ? "Верно." : "Неверно."}</b> <Md text={q.task.why} />
            </p>
          )}
          {answered && q.task.type === "quiz" && q.task.example && <CodeBlock code={q.task.example} />}
        </div>
        {answered && (
          <div className="actions">
            <button type="button" className="btn" onClick={() => setRun(last ? { ...run, done: true } : { ...run, index: run.index + 1 })}>
              {last ? "Итоги" : "Дальше"}
            </button>
          </div>
        )}
      </article>
    </section>
  );
}

function Opt({ task, i }: { task: ExamTask; i: number }) {
  const text = task.opts[i] ?? "";
  return task.type === "predict" ? <code>{text}</code> : <Md text={text} />;
}

function ExamBar({ run }: { run: Run }) {
  return (
    <div className="exam-bar" aria-hidden="true">
      {run.questions.map((_, j) => (
        <i key={j} className={run.chosen[j] !== undefined ? (isRight(run, j) ? "ok" : "bad") : j === run.index && !run.done ? "cur" : undefined} />
      ))}
    </div>
  );
}
