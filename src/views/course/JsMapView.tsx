import { useState } from "react";
import { EXAM_PASS } from "../../content/exams";
import type { Course } from "../../content/course/types";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { courseCurrent, courseLessonDone, courseLessonUnlocked, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { Md } from "../../ui/Code";

/** Карта JavaScript как консоль DevTools: в консоль выведен массив регионов, каждый раскрывается в список уроков. */
export function JsMapView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  const [open, setOpen] = useState<Set<number>>(() => new Set([now?.region ?? 0]));
  const doneCount = course.lessons.filter((l) => courseLessonDone(progress, l)).length;

  const toggle = (ri: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(ri)) next.delete(ri); else next.add(ri);
    return next;
  });

  return (
    <section className="wm jc-map">
      <p className="eyebrow">// javascript → собеседование</p>
      <h1>JavaScript</h1>
      <p className="lead"><Md text="Язык, на котором задают больше всего вопросов: типы и приведение, замыкания, `this`, прототипы, event loop и промисы, DOM и события, Web API и модули. Задания «что выведет» проверяются настоящим запуском кода, а в конце — задачи live coding: debounce, deepClone, Promise.all и другие." /></p>
      <div className="actions hero-actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>
            {doneCount ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-cards", course: course.id })}>Карточки: {course.flashcards.length} вопросов</button>
      </div>

      <div className="jc-console">
        <div className="jc-bar">
          <span className="jc-tab">Console</span>
          <span className="jc-filter" aria-hidden="true">Filter</span>
          <span className="jc-gap" />
          <span>{doneCount} из {course.lessons.length} уроков</span>
        </div>
        <p className="jc-line jc-in"><span>course.regions</span></p>
        <p className="jc-line jc-out jc-dim">({course.regions.length}) [{course.regions.map((r) => r.name).slice(0, 2).map((n) => `"${n}"`).join(", ")}, …]</p>
        {course.regions.map((r, ri) => {
          const ls = courseRegionLessons(course, ri);
          const live = r.kind === "lessons";
          const d = ls.filter((l) => courseLessonDone(progress, l)).length;
          const expanded = open.has(ri);
          const best = progress.exams[course.examBase + ri];
          const cur = now?.region === ri;
          return (
            <div key={ri}>
              <button type="button" className={`jc-line jc-out jc-region${cur ? " sel" : ""}`} aria-expanded={expanded} onClick={() => toggle(ri)}>
                <span className="jc-caret" aria-hidden="true">{expanded ? "▾" : "▸"}</span>
                <span className="jc-idx">{ri}:</span>
                <span className="jc-cls">Region</span>
                <span>{"{"}<span className="jc-key">name</span>: <span className="jc-str">"{r.name}"</span>
                  {live ? <>, <span className="jc-key">done</span>: <span className="jc-num">{d}</span>/<span className="jc-num">{ls.length}</span></> : <>, <span className="jc-key">status</span>: <span className="jc-str">"скоро"</span></>}
                  {"}"}</span>
                {cur && <span className="jc-badge">сейчас</span>}
              </button>
              {expanded && (
                <div className="jc-lessons">
                  <p className="jc-desc"><Md text={r.desc} /></p>
                  {ls.map((l) => {
                    const ok = courseLessonDone(progress, l);
                    const can = courseLessonUnlocked(course, progress, l);
                    const isNow = now?.id === l.id;
                    return (
                      <button key={l.id} type="button" className={`jc-lesson${ok ? " ok" : ""}${isNow ? " cur" : ""}`} disabled={!can}
                        onClick={() => navigate({ view: "course-lesson", course: course.id, id: l.id })}>
                        <span className="jc-mark" aria-hidden="true">{ok ? "✓" : can ? "●" : <i className="lock" />}</span>
                        <span className="jc-title">{l.title}</span>
                        {isNow && <span className="jc-badge">сейчас</span>}
                      </button>
                    );
                  })}
                  {!live && r.topics && <ul className="jc-desc">{r.topics.map((t) => <li key={t.t}><Md text={t.q} /></li>)}</ul>}
                  {live && (
                    <div className="jc-exam">
                      {courseRegionDone(course, progress, ri)
                        ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: ri })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
                        : <button type="button" className="btn ghost small" disabled>Экзамен после всех уроков</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <p className="jc-line jc-in jc-prompt-end"><span className="jc-cursor" aria-hidden="true" /></p>
      </div>
    </section>
  );
}
