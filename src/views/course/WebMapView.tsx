import { useState } from "react";
import { EXAM_PASS } from "../../content/exams";
import type { Course } from "../../content/course/types";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { courseCurrent, courseLessonDone, courseLessonUnlocked, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { Md } from "../../ui/Code";

/** Карта «Браузера» как вкладка Network: регион — строка запроса, прогресс — водопад. */
export function WebMapView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  const [open, setOpen] = useState<Set<number>>(() => new Set([now?.region ?? 0]));
  const toggle = (ri: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(ri)) next.delete(ri); else next.add(ri);
    return next;
  });
  const doneCount = course.lessons.filter((l) => courseLessonDone(progress, l)).length;
  const topicsTotal = course.regions.reduce((n, r) => n + (r.kind === "lessons" ? courseRegionLessons(course, course.regions.indexOf(r)).length : r.topics?.length ?? 0), 0);

  return (
    <section className="wm">
      <p className="eyebrow">// браузер → собеседование</p>
      <h1>Браузер</h1>
      <p className="lead">Как страница попадает в браузер: IP и TCP, DNS, HTTP и HTTPS, cookies, кэш и CDN, CORS, безопасность и отрисовка. Всё, что спрашивают на фронтенд-собеседованиях про сеть. Без кода: схемы обмена, вкладка «Сеть» и задания на понимание.</p>
      <div className="actions hero-actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>
            {doneCount ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-cards", course: course.id })}>Карточки: {course.flashcards.length} вопросов</button>
      </div>

      <div className="dt-network" role="table" aria-label="Регионы раздела">
        <div className="dt-net-toolbar">
          <span className="dt-rec" aria-hidden="true" />
          <span>Регионы</span>
          <span className="dt-net-gap" />
          <span>{doneCount} из {course.lessons.length} уроков пройдено</span>
        </div>
        <div className="dt-row dt-head" role="row">
          <span role="columnheader">Имя</span><span role="columnheader">Статус</span><span role="columnheader">Тип</span>
          <span role="columnheader">Тем</span><span role="columnheader">Водопад</span>
        </div>
        {course.regions.map((r, ri) => {
          const lessons = courseRegionLessons(course, ri);
          const live = r.kind === "lessons";
          const done = lessons.filter((l) => courseLessonDone(progress, l)).length;
          const unlocked = live && lessons[0] ? courseLessonUnlocked(course, progress, lessons[0]) : false;
          const status = !live ? { code: "—", text: "скоро", cls: "soon" }
            : done === lessons.length ? { code: "200", text: "OK", cls: "ok" }
            : unlocked ? { code: "206", text: "в процессе", cls: "partial" }
            : { code: "(blocked)", text: "закрыто", cls: "blocked" };
          const count = live ? lessons.length : r.topics?.length ?? 0;
          const best = progress.exams[course.examBase + ri];
          return (
            <div key={ri} className={`dt-group${open.has(ri) ? " open" : ""}`}>
              <button type="button" className={`dt-row dt-region st-${status.cls}`} role="row" aria-expanded={open.has(ri)} onClick={() => toggle(ri)}>
                <span role="cell" className="dt-name"><span className="dt-caret" aria-hidden="true">▸</span>{ri + 1}. {r.name}</span>
                <span role="cell" className={`dt-status-code st-${status.cls}`}>{status.code} <small>{status.text}</small></span>
                <span role="cell">{live ? "уроки" : "план"}</span>
                <span role="cell">{count}</span>
                <span role="cell" className="dt-wf" aria-label={`${done} из ${count}`}>
                  <i className="dt-wf-bar" style={{ width: `${live && count ? (done / count) * 100 : 0}%`, marginLeft: `${(ri / course.regions.length) * 40}%` }} />
                </span>
              </button>
              {open.has(ri) && (
                <div className="dt-detail">
                  <p className="rdesc"><Md text={r.desc} /></p>
                  {live ? lessons.map((l) => {
                    const ok = courseLessonDone(progress, l);
                    const can = courseLessonUnlocked(course, progress, l);
                    return (
                      <button key={l.id} type="button" className={`dt-row dt-topic${ok ? " st-ok" : can ? "" : " st-blocked"}${now?.id === l.id ? " cur" : ""}`}
                        disabled={!can} onClick={() => navigate({ view: "course-lesson", course: course.id, id: l.id })}>
                        <span className="dt-name">{ok ? "✓" : can ? "●" : <i className="lock" aria-hidden="true" />} {l.title}{now?.id === l.id && <span className="cur-tag">сейчас</span>}</span>
                        <span className={`dt-status-code st-${ok ? "ok" : can ? "partial" : "blocked"}`}>{ok ? "200" : can ? "pending" : "(blocked)"}</span>
                        <span>урок</span>
                        <span>{l.tasks.length} зад.</span>
                        <span className="dt-q"><Md text={l.q} /></span>
                      </button>
                    );
                  }) : (r.topics ?? []).map((t) => (
                    <div key={t.t} className="dt-row dt-topic st-soon">
                      <span className="dt-name">○ {t.t}</span>
                      <span className="dt-status-code st-soon">—</span>
                      <span>тема</span>
                      <span />
                      <span className="dt-q"><Md text={t.q} /></span>
                    </div>
                  ))}
                  {live && (
                    <div className="actions">
                      {courseRegionDone(course, progress, ri)
                        ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: ri })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
                        : <button type="button" className="btn ghost small" disabled>Экзамен после всех тем</button>}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div className="dt-net-footer">{course.regions.length} регионов · {topicsTotal} тем · {course.regions.filter((r) => r.kind === "lessons").length} открыто</div>
      </div>
    </section>
  );
}
