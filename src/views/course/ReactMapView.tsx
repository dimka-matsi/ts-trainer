import { useState } from "react";
import { EXAM_PASS } from "../../content/exams";
import type { Course } from "../../content/course/types";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { courseCurrent, courseLessonDone, courseLessonUnlocked, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { Atom } from "../../ui/Atom";
import { Md } from "../../ui/Code";

/** Имя компонента региона в дереве. Индекс — индекс региона. */
const REGION_TAGS = ["Components", "LocalState", "Hooks", "Reconciler", "ContextProvider", "ReduxStore", "ExternalStores", "ServerCache", "Architecture", "Profiler", "Actions", "ServerComponents", "Patterns", "Testing"];

/** Карта React как вкладка Components в React DevTools: слева дерево регионов и уроков, справа пропсы выбранного региона. */
export function ReactMapView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  const [sel, setSel] = useState(now?.region ?? 0);
  const [open, setOpen] = useState<Set<number>>(() => new Set([now?.region ?? 0]));
  const doneCount = course.lessons.filter((l) => courseLessonDone(progress, l)).length;

  const toggle = (ri: number) => {
    setSel(ri);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(ri) && sel === ri) next.delete(ri); else next.add(ri);
      return next;
    });
  };

  const region = course.regions[sel]!;
  const lessons = courseRegionLessons(course, sel);
  const live = region.kind === "lessons";
  const done = lessons.filter((l) => courseLessonDone(progress, l)).length;
  const best = progress.exams[course.examBase + sel];
  const tag = REGION_TAGS[sel] ?? `Region${sel + 1}`;

  return (
    <section className="wm rx-map">
      <p className="eyebrow">// react → собеседование</p>
      <h1>React</h1>
      <p className="lead">Всё, что спрашивают о React на собеседованиях: компоненты, состояние и хуки, как устроен рендеринг, Context, Redux, Zustand и серверное состояние, производительность, React 19 с Actions и Server Components, паттерны и тестирование. Каждая страница справочника react.dev привязана к уроку.</p>
      <div className="actions hero-actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>
            {doneCount ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-cards", course: course.id })}>Карточки: {course.flashcards.length} вопросов</button>
      </div>

      <div className="rx-devtools">
        <div className="rx-bar">
          <span className="rx-logo"><Atom size={15} /> Components</span>
          <span className="rx-bar-tab">Profiler</span>
          <span className="rx-bar-gap" />
          <span className="rx-bar-meta">{doneCount} из {course.lessons.length} уроков</span>
        </div>
        <div className="rx-split">
          <div className="rx-tree" role="tree" aria-label="Регионы и уроки">
            <div className="rx-node rx-root"><span className="rx-caret" aria-hidden="true">▾</span><span className="rx-comp">App</span></div>
            {course.regions.map((r, ri) => {
              const ls = courseRegionLessons(course, ri);
              const isLive = r.kind === "lessons";
              const d = ls.filter((l) => courseLessonDone(progress, l)).length;
              const expanded = open.has(ri);
              return (
                <div key={ri} role="treeitem" aria-expanded={isLive ? expanded : undefined} aria-selected={sel === ri}>
                  <button type="button" className={`rx-node rx-region${sel === ri ? " sel" : ""}${isLive ? "" : " soon"}`} onClick={() => toggle(ri)}>
                    <span className="rx-caret" aria-hidden="true">{isLive ? (expanded ? "▾" : "▸") : " "}</span>
                    <span className="rx-comp">{REGION_TAGS[ri] ?? `Region${ri + 1}`}</span>
                    <span className="rx-attr"><span className="rx-key">name</span><span className="rx-eq">=</span><span className="rx-str">"{r.name}"</span></span>
                    {isLive ? <span className={`rx-badge${d === ls.length ? " ok" : d ? " part" : ""}`}>{d}/{ls.length}</span> : <span className="rx-badge soon">скоро</span>}
                  </button>
                  {isLive && expanded && ls.map((l) => {
                    const ok = courseLessonDone(progress, l);
                    const can = courseLessonUnlocked(course, progress, l);
                    const cur = now?.id === l.id;
                    return (
                      <button key={l.id} type="button" className={`rx-node rx-lesson${ok ? " ok" : ""}${cur ? " cur" : ""}`} disabled={!can}
                        onClick={() => navigate({ view: "course-lesson", course: course.id, id: l.id })}>
                        <span className="rx-mark" aria-hidden="true">{ok ? "✓" : can ? "●" : <i className="lock" />}</span>
                        <span className="rx-comp">Lesson</span>
                        <span className="rx-title">{l.title}</span>
                        {cur && <span className="rx-badge now">сейчас</span>}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          <aside className="rx-inspect" aria-label={`Регион ${region.name}`}>
            <p className="rx-inspect-head"><span className="rx-comp">{tag}</span></p>
            <div className="rx-section">
              <p className="rx-label">props</p>
              <p className="rx-prop"><span className="rx-key">name</span>: <span className="rx-str">"{region.name}"</span></p>
              {live ? (
                <>
                  <p className="rx-prop"><span className="rx-key">lessons</span>: <span className="rx-num">{lessons.length}</span></p>
                  <p className="rx-prop"><span className="rx-key">done</span>: <span className="rx-num">{done}</span></p>
                  <p className="rx-prop"><span className="rx-key">exam</span>: <span className="rx-str">{best != null ? `"${best}%"` : courseRegionDone(course, progress, sel) ? '"открыт"' : '"после всех уроков"'}</span></p>
                </>
              ) : <p className="rx-prop"><span className="rx-key">status</span>: <span className="rx-str">"скоро"</span></p>}
            </div>
            <div className="rx-section">
              <p className="rx-label">о чём</p>
              <p className="rx-desc"><Md text={region.desc} /></p>
              {!live && region.topics && (
                <ul className="rx-topics">{region.topics.map((t) => <li key={t.t}><Md text={t.q} /></li>)}</ul>
              )}
            </div>
            {live && (
              <div className="actions">
                {courseRegionDone(course, progress, sel)
                  ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: sel })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
                  : <button type="button" className="btn ghost small" disabled>Экзамен после всех уроков</button>}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
