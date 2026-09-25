import { useState } from "react";
import type { Course } from "../../content/course/types";
import { EXAM_PASS } from "../../content/exams";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { courseCurrent, courseLessonDone, courseLessonUnlocked, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { Md } from "../../ui/Code";

/** Насколько опасна категория, если её не знать: как уровни в отчётах сканеров. */
const SEVERITY: { label: string; cls: string }[] = [
  { label: "HIGH", cls: "high" },
  { label: "MEDIUM", cls: "medium" },
  { label: "CRITICAL", cls: "critical" },
  { label: "HIGH", cls: "high" },
  { label: "CRITICAL", cls: "critical" },
];

/** Карта «Безопасности» как отчёт сканера уязвимостей: категории угроз и находки-уроки со статусом. */
export function SecMapView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  const [open, setOpen] = useState<Set<number>>(() => new Set([now?.region ?? 0]));
  const toggle = (ri: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(ri)) next.delete(ri); else next.add(ri);
    return next;
  });
  const fixed = course.lessons.filter((l) => courseLessonDone(progress, l)).length;
  const openNow = course.lessons.filter((l) => !courseLessonDone(progress, l) && courseLessonUnlocked(course, progress, l)).length;
  const unchecked = course.lessons.length - fixed - openNow;

  return (
    <section className="sc">
      <p className="sc-cmd" aria-hidden="true"><span>$</span> audit --target=frontend-interview</p>
      <h1>Безопасность</h1>
      <p className="lead">Как атакуют сайт и как защищаться: флаги cookies, CORS, XSS и CSRF, CSP и заголовки защиты, аутентификация. Опирается на «Браузер»: механизмы там, здесь — угрозы и защита.</p>
      <div className="sc-summary" role="status">
        <span className="sc-count fixed"><b>{fixed}</b> исправлено</span>
        <span className="sc-count open"><b>{openNow}</b> открыто</span>
        <span className="sc-count unchecked"><b>{unchecked}</b> не проверено</span>
      </div>
      <div className="actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>
            {fixed ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-cards", course: course.id })}>Карточки: {course.flashcards.length}</button>
      </div>

      <div className="sc-report">
        {course.regions.map((r, ri) => {
          const lessons = courseRegionLessons(course, ri);
          const done = lessons.filter((l) => courseLessonDone(progress, l)).length;
          const sev = SEVERITY[ri] ?? SEVERITY[0]!;
          const best = progress.exams[course.examBase + ri];
          const isOpen = open.has(ri);
          return (
            <div key={r.name} className={`sc-cat${isOpen ? " open" : ""}`}>
              <button type="button" className="sc-cat-head" aria-expanded={isOpen} onClick={() => toggle(ri)}>
                <span className={`sc-sev ${sev.cls}`}>{sev.label}</span>
                <span className="sc-cat-name">{r.name}</span>
                <span className="sc-cat-meta">{done}/{lessons.length} исправлено</span>
                <span className="sc-caret" aria-hidden="true">▸</span>
              </button>
              {isOpen && (
                <div className="sc-cat-body">
                  <p className="rdesc"><Md text={r.desc} /></p>
                  <ol className="sc-findings">
                    {lessons.map((l) => {
                      const ok = courseLessonDone(progress, l);
                      const can = courseLessonUnlocked(course, progress, l);
                      const state = ok ? "fixed" : can ? "open" : "unchecked";
                      return (
                        <li key={l.id}>
                          <button type="button" className={`sc-finding ${state}${now?.id === l.id ? " cur" : ""}`} disabled={!can}
                            onClick={() => navigate({ view: "course-lesson", course: course.id, id: l.id })}>
                            <span className="sc-fid">F-{String(course.lessons.indexOf(l) + 1).padStart(2, "0")}</span>
                            <span className="sc-ftitle">{l.title}{now?.id === l.id && <span className="cur-tag">сейчас</span>}</span>
                            <span className={`sc-status ${state}`}>{ok ? "исправлено" : can ? "открыто" : "не проверено"}</span>
                            <span className="sc-fq"><Md text={l.q} /></span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="actions">
                    {courseRegionDone(course, progress, ri)
                      ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: ri })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
                      : <button type="button" className="btn ghost small" disabled>Экзамен после всех тем категории</button>}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
