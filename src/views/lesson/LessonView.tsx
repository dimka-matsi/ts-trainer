import { LESSONS } from "../../content/lessons";
import { REGIONS } from "../../content/regions";
import type { Lesson, Task } from "../../content/types";
import { hasExam } from "../../content/exams";
import { lessonDone, lessonStep, regionDone, stepAfter, stepRoute } from "../../state/path";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { Md } from "../../ui/Code";
import { TheoryBlock } from "../../ui/TheoryBlock";
import { ChoiceTaskCard } from "./ChoiceTaskCard";
import { CodeTaskCard } from "./CodeTaskCard";
import { EngineStatus, Sandbox } from "./Sandbox";

const kindLabel = (t: Task) =>
  t.type === "predict" ? "Предскажи тип" : t.type === "quiz" ? "Вопрос" : t.kind === "write" ? "Напиши тип" : "Почини код";

export function LessonView({ lesson }: { lesson: Lesson }) {
  const { progress, markTask } = useProgress();
  const inRegion = LESSONS.filter((l) => l.region === lesson.region);
  const idx = inRegion.indexOf(lesson);
  const prev = inRegion[idx - 1];
  const after = (() => { const s = lessonStep(lesson.id); return s ? stepAfter(s) : undefined; })();
  const finished = lessonDone(progress, lesson);
  const examReady = !after || after.region !== lesson.region ? regionDone(progress, lesson.region) && hasExam(lesson.region) : false;
  const done = progress.lessons[lesson.id] ?? {};

  return (
    <section>
      <section className="intro">
        <p className="crumb">{REGIONS[lesson.region]!.name}, урок {idx + 1} из {inRegion.length}</p>
        <h1>{lesson.title}</h1>
        <div className="qbox"><b>Как спрашивают на собеседовании</b><Md text={lesson.q} /></div>
        <TheoryBlock theory={lesson.theory} open={!lessonDone(progress, lesson)} />
      </section>

      <section className="block">
        <h2>Песочница</h2>
        <p className="how"><EngineStatus /> Меняй код: ошибки и выведенные типы обновляются сразу.</p>
        <Sandbox initial={lesson.theory.example} />
      </section>

      <section className="block">
        <h2>Упражнения</h2>
        {lesson.tasks.map((task, i) => (
          <article key={i} className={`task${done[i] ? " done" : ""}`}>
            <div className="thead">
              <span className="tnum">{i + 1}</span>
              <span className="tkind">{kindLabel(task)}</span>
              <span className="tdone">✓ выполнено</span>
            </div>
            {task.type === "code"
              ? <CodeTaskCard task={task} onSolved={() => markTask(lesson.id, i)} />
              : <ChoiceTaskCard task={task} onSolved={() => markTask(lesson.id, i)} />}
          </article>
        ))}
      </section>

      <section className="block">
        <h2>Ответь вслух</h2>
        <p className="tq"><Md text={lesson.q} /></p>
        <p className="how">Скажи ответ вслух за 40–60 секунд: определение, пример, подвох. Потом сравни с образцом.</p>
        <details className="theory">
          <summary>Показать пример ответа</summary>
          <div className="tbody"><p><Md text={lesson.answer} /></p></div>
        </details>
      </section>

      <div className="lsnav">
        {prev && <button type="button" className="btn ghost" onClick={() => navigate({ view: "lesson", id: prev.id })}>Назад: {prev.title}</button>}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "map" })}>К карте</button>
        {examReady && (
          <button type="button" className="btn ghost" onClick={() => navigate({ view: "exam", region: lesson.region })}>Итоговый экзамен региона</button>
        )}
        {after && (
          <button type="button" className="btn" disabled={!finished} onClick={() => navigate(stepRoute(after))}>
            Дальше: {after.title}
          </button>
        )}
      </div>
      {after && !finished && <p className="muted lsnote">Следующая тема откроется, когда будут выполнены все упражнения этого урока.</p>}
    </section>
  );
}
