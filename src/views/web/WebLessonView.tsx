import { useState } from "react";
import { WEB_LESSONS, WEB_REGIONS } from "../../content/web";
import type { WebLesson, WebTask } from "../../content/web/types";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { useToast } from "../../state/toast";
import { webLessonAfter, webLessonDone, webRegionDone } from "../../state/webPath";
import { CodeBlock, Md } from "../../ui/Code";
import { ChoiceTaskCard } from "../lesson/ChoiceTaskCard";
import { WebSandbox } from "./WebSandbox";
import { DomTaskCard, OutputTaskCard } from "./WebTasks";

type Panel = "theory" | "sandbox" | "tasks" | "answer";

const kindLabel = (t: WebTask) =>
  t.type === "output" ? "Что выведется" : t.type === "quiz" ? "Вопрос" : t.kind === "write" ? "Напиши код" : "Почини код";

/** Урок «Браузера»: разделы — вкладки как в DevTools, внизу строка состояния с прогрессом. */
export function WebLessonView({ lesson }: { lesson: WebLesson }) {
  const { progress, markTask } = useProgress();
  const toast = useToast();
  const [panel, setPanel] = useState<Panel>("theory");
  const inRegion = WEB_LESSONS.filter((l) => l.region === lesson.region);
  const idx = inRegion.indexOf(lesson);
  const done = progress.lessons[lesson.id] ?? {};
  const solved = lesson.tasks.filter((_, i) => done[i]).length;
  const finished = webLessonDone(progress, lesson);
  const after = webLessonAfter(lesson);
  const examReady = (!after || after.region !== lesson.region) && webRegionDone(progress, lesson.region);

  const solve = (i: number) => {
    if (done[i]) return;
    markTask(lesson.id, i);
    if (solved + 1 === lesson.tasks.length) toast(`Урок пройден: ${lesson.title}`);
  };

  const tabs: [Panel, string][] = [["theory", "Теория"], ["sandbox", "Песочница"], ["tasks", `Упражнения ${solved}/${lesson.tasks.length}`], ["answer", "Ответ вслух"]];

  return (
    <section className="wl">
      <p className="crumb">{WEB_REGIONS[lesson.region]!.name} › урок {idx + 1} из {inRegion.length}</p>
      <h1>{lesson.title}</h1>
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
              <CodeBlock code={lesson.theory.example} />
              <div className="keys"><b>Главное</b><ul>{lesson.theory.keys.map((k, i) => <li key={i}><Md text={k} /></li>)}</ul></div>
              <div className="actions"><button type="button" className="btn" onClick={() => setPanel("sandbox")}>Открыть пример в песочнице</button></div>
            </div>
          )}
          {panel === "sandbox" && (
            <>
              <p className="how">Меняй код и разметку: страница и консоль обновятся сами. Код выполняется в изолированном iframe.</p>
              <WebSandbox html={lesson.theory.html} code={lesson.theory.example} />
            </>
          )}
          {panel === "tasks" && lesson.tasks.map((task, i) => (
            <article key={i} className={`task${done[i] ? " done" : ""}`}>
              <div className="thead">
                <span className="tnum">{i + 1}</span>
                <span className="tkind">{kindLabel(task)}</span>
                <span className="tdone">✓ выполнено</span>
              </div>
              {task.type === "output" ? <OutputTaskCard task={task} onSolved={() => solve(i)} />
                : task.type === "dom" ? <DomTaskCard task={task} onSolved={() => solve(i)} />
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
            </div>
          )}
        </div>

        <div className="dt-status" role="status">
          <span className="lb-segs" aria-hidden="true">{lesson.tasks.map((_, i) => <i key={i} className={done[i] ? "ok" : undefined} />)}</span>
          <span>{finished ? "Урок пройден" : `Упражнения: ${solved} из ${lesson.tasks.length}`}</span>
          <span className="dt-status-gap" />
          {examReady && <button type="button" className="btn ghost small" onClick={() => navigate({ view: "web-exam", region: lesson.region })}>Итоговый экзамен</button>}
          {after && (
            <button type="button" className="btn small" disabled={!finished} title={finished ? undefined : "Откроется после всех упражнений"}
              onClick={() => navigate({ view: "web-lesson", id: after.id })}>
              Дальше: {after.title}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
