import { useState } from "react";
import type { Course, WebLesson, WebTask } from "../../content/course/types";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { useToast } from "../../state/toast";
import { courseLessonAfter, courseLessonDone, courseRegionDone } from "../../state/coursePath";
import { LEVEL_NAME } from "../../content/flashcards";
import { CodeBlock, Md } from "../../ui/Code";
import { ChoiceTaskCard } from "../lesson/ChoiceTaskCard";
import { FlowDiagram, NetworkPanel } from "./NetVisuals";
import { needsPage } from "../../engine/jsRunner";
import { RunnableCode, RunTaskCard } from "./RunTaskCard";
import { MatchTaskCard, OrderTaskCard, SortTaskCard } from "./WebTasks";

type Panel = "theory" | "flow" | "network" | "tasks" | "answer";

const kindLabel = (t: WebTask) =>
  t.type === "run" ? "Напиши код" : t.type === "quiz" ? (t.output ? "Что выведет" : "Вопрос") : t.type === "order" ? "Расставь по порядку" : t.type === "match" ? "Сопоставь" : "Разложи по группам";

/** Урок курса без кода: разделы — вкладки как в DevTools, внизу строка состояния с прогрессом. */
export function CourseLessonView({ course, lesson }: { course: Course; lesson: WebLesson }) {
  const { progress, markTask } = useProgress();
  const toast = useToast();
  const [panel, setPanel] = useState<Panel>("theory");
  const inRegion = course.lessons.filter((l) => l.region === lesson.region);
  const idx = inRegion.indexOf(lesson);
  const done = progress.lessons[lesson.id] ?? {};
  const solved = lesson.tasks.filter((_, i) => done[i]).length;
  const finished = courseLessonDone(progress, lesson);
  const after = courseLessonAfter(course, lesson);
  const examReady = (!after || after.region !== lesson.region) && courseRegionDone(course, progress, lesson.region);

  const solve = (i: number) => {
    if (done[i]) return;
    markTask(lesson.id, i);
    if (solved + 1 === lesson.tasks.length) toast(`Урок пройден: ${lesson.title}`);
  };

  const { flow, requests } = lesson.theory;
  const tabs: [Panel, string][] = [
    ["theory", "Теория"],
    ...(flow ? [["flow", "Схема"] as [Panel, string]] : []),
    ...(requests?.length ? [["network", "Сеть"] as [Panel, string]] : []),
    ["tasks", `Упражнения ${solved}/${lesson.tasks.length}`],
    ["answer", "Ответ вслух"],
  ];
  const visual: Panel | null = flow ? "flow" : requests?.length ? "network" : null;

  return (
    <section className="wl">
      <p className="crumb">{course.regions[lesson.region]!.name} › урок {idx + 1} из {inRegion.length}</p>
      <h1>{lesson.title} <span className={`lvl ${lesson.level}`}>{LEVEL_NAME[lesson.level]}</span></h1>
      <div className="qbox"><b>Как спрашивают на собеседовании</b><Md text={lesson.q} /></div>

      <div className="dt-panel">
        <div className="dt-tabs" role="tablist" aria-label="Разделы урока">
          {tabs.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={panel === id} onClick={() => setPanel(id)}>{label}</button>
          ))}
        </div>

        <div className="dt-body" role="tabpanel">
          {panel === "theory" && (
            <div className="tbody wl-theory">
              {lesson.theory.p.map((p, i) => <p key={i}><Md text={p} /></p>)}
              {lesson.theory.code && (course.runnable && !needsPage(lesson.theory.code) ? <RunnableCode code={lesson.theory.code} /> : <CodeBlock code={lesson.theory.code} />)}
              <div className="keys"><b>Главное</b><ul>{lesson.theory.keys.map((k, i) => <li key={i}><Md text={k} /></li>)}</ul></div>
              {visual && <div className="actions"><button type="button" className="btn" onClick={() => setPanel(visual)}>{visual === "flow" ? "Разобрать по шагам на схеме" : "Открыть вкладку «Сеть»"}</button></div>}
            </div>
          )}
          {panel === "flow" && flow && (
            <>
              <p className="how">Нажимай «Следующий шаг»: стрелки показывают, кто кому и что отправляет.</p>
              <FlowDiagram flow={flow} />
            </>
          )}
          {panel === "network" && requests && (
            <>
              <p className="how">Так эту загрузку показала бы вкладка Network в DevTools. Выбери запрос, чтобы увидеть заголовки и тайминг.</p>
              <NetworkPanel requests={requests} />
            </>
          )}
          {panel === "tasks" && lesson.tasks.map((task, i) => (
            <article key={i} className={`task${done[i] ? " done" : ""}`}>
              <div className="thead">
                <span className="tnum">{i + 1}</span>
                <span className="tkind">{kindLabel(task)}</span>
                <span className="tdone">✓ выполнено</span>
              </div>
              {task.type === "order" ? <OrderTaskCard task={task} onSolved={() => solve(i)} />
                : task.type === "match" ? <MatchTaskCard task={task} onSolved={() => solve(i)} />
                : task.type === "sort" ? <SortTaskCard task={task} onSolved={() => solve(i)} />
                : task.type === "run" ? <RunTaskCard task={task} onSolved={() => solve(i)} />
                : <ChoiceTaskCard task={task} onSolved={() => solve(i)} />}
            </article>
          ))}
          {panel === "answer" && (
            <div className="tbody">
              <p className="tq"><Md text={lesson.q} /></p>
              <p className="how">Скажи ответ вслух за 40–60 секунд: определение, пример, подвох. Потом сравни с образцом.</p>
              <details className="theory">
                <summary>Показать пример ответа</summary>
                <div className="tbody"><p><Md text={lesson.answer} /></p></div>
              </details>
              {!!lesson.followUps?.length && (
                <div className="followups">
                  <h3>Уточняющие вопросы</h3>
                  <p className="how">Так интервьюер углубляется, когда базовый ответ уже прозвучал. Ответь вслух, потом открой образец.</p>
                  {lesson.followUps.map((f, i) => (
                    <details key={i} className="theory followup">
                      <summary><span className={`lvl ${f.level}`}>{LEVEL_NAME[f.level]}</span> <Md text={f.q} /></summary>
                      <div className="tbody"><p><Md text={f.a} /></p></div>
                    </details>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="dt-status" role="status">
          <span className="lb-segs" aria-hidden="true">{lesson.tasks.map((_, i) => <i key={i} className={done[i] ? "ok" : undefined} />)}</span>
          <span>{finished ? "Урок пройден" : `Упражнения: ${solved} из ${lesson.tasks.length}`}</span>
          <span className="dt-status-gap" />
          {examReady && <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: lesson.region })}>Итоговый экзамен</button>}
          {after && (
            <button type="button" className={`btn small${finished ? "" : " ghost"}`}
              onClick={() => navigate({ view: "course-lesson", course: course.id, id: after.id })}>
              Дальше: {after.title}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
