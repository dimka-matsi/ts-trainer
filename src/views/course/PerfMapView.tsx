import { useState } from "react";
import type { Course } from "../../content/course/types";
import { EXAM_PASS } from "../../content/exams";
import { useProgress } from "../../state/progress";
import { navigate } from "../../state/route";
import { courseCurrent, courseLessonDone, courseLessonUnlocked, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { Md } from "../../ui/Code";

/** Цвет как у оценок Lighthouse: 0–49 плохо, 50–89 средне, 90–100 хорошо. */
const grade = (pct: number) => (pct >= 90 ? "pass" : pct >= 50 ? "average" : "fail");

/** Круговая шкала с процентом внутри, как у категорий Lighthouse. */
function Gauge({ pct, size = 96, label }: { pct: number; size?: number; label: string }) {
  const r = 42;
  const len = 2 * Math.PI * r;
  return (
    <span className={`lh-gauge lh-${grade(pct)}`} style={{ width: size, height: size }} role="img" aria-label={`${label}: ${pct}%`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="lh-gauge-base" cx="50" cy="50" r={r} />
        <circle className="lh-gauge-arc" cx="50" cy="50" r={r} strokeDasharray={`${(pct / 100) * len} ${len}`} />
      </svg>
      <b>{pct}</b>
    </span>
  );
}

/** Карта «Оптимизации» как отчёт Lighthouse: категории-регионы со шкалами и уроки-аудиты. */
export function PerfMapView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const now = courseCurrent(course, progress);
  const [sel, setSel] = useState(now?.region ?? 0);
  const done = course.lessons.filter((l) => courseLessonDone(progress, l)).length;
  const total = Math.round((done / course.lessons.length) * 100);
  const regionPct = (ri: number) => {
    const ls = courseRegionLessons(course, ri);
    return ls.length ? Math.round((ls.filter((l) => courseLessonDone(progress, l)).length / ls.length) * 100) : 0;
  };
  const region = course.regions[sel]!;
  const lessons = courseRegionLessons(course, sel);
  const best = progress.exams[course.examBase + sel];

  return (
    <section className="lh">
      <div className="lh-hero">
        <Gauge pct={total} size={128} label="Пройдено всего" />
        <div>
          <p className="eyebrow">// отчёт о скорости</p>
          <h1>Оптимизация</h1>
          <p className="lead">Как сделать сайт быстрым и как это доказать цифрами: измерение, сеть и загрузка, сборка, сервер, интерфейс, React, JS-движок и разбор задач с собеседований. Опирается на «Браузер»: механизмы там, здесь — приёмы.</p>
          <div className="actions">
            {now && (
              <button type="button" className="btn" onClick={() => navigate({ view: "course-lesson", course: course.id, id: now.id })}>
                {done ? "Продолжить" : "Начать"}: {now.title}
              </button>
            )}
            <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-cards", course: course.id })}>Карточки: {course.flashcards.length}</button>
          </div>
        </div>
      </div>

      <div className="lh-cats" role="tablist" aria-label="Категории">
        {course.regions.map((r, ri) => (
          <button key={r.name} type="button" role="tab" aria-selected={ri === sel} className="lh-cat" onClick={() => setSel(ri)}>
            <Gauge pct={regionPct(ri)} size={72} label={r.name} />
            <span>{r.name}</span>
          </button>
        ))}
      </div>

      <div className="lh-report" role="tabpanel">
        <div className="lh-report-head">
          <Gauge pct={regionPct(sel)} size={88} label={region.name} />
          <div>
            <h2>{region.name}</h2>
            <p className="rdesc"><Md text={region.desc} /></p>
          </div>
        </div>
        <p className="lh-legend" aria-hidden="true"><i className="lh-ico fail" />закрыто <i className="lh-ico average" />на очереди <i className="lh-ico pass" />пройдено</p>
        <ol className="lh-audits">
          {lessons.map((l) => {
            const ok = courseLessonDone(progress, l);
            const can = courseLessonUnlocked(course, progress, l);
            const state = ok ? "pass" : can ? "average" : "fail";
            return (
              <li key={l.id}>
                <button type="button" className={`lh-audit ${state}${now?.id === l.id ? " cur" : ""}`} disabled={!can}
                  onClick={() => navigate({ view: "course-lesson", course: course.id, id: l.id })}>
                  <i className={`lh-ico ${state}`} aria-hidden="true" />
                  <span className="lh-audit-title">{l.title}{now?.id === l.id && <span className="cur-tag">сейчас</span>}</span>
                  <span className="lh-audit-q"><Md text={l.q} /></span>
                  <span className="lh-audit-meta">{ok ? "пройдено" : can ? `${l.tasks.length} задания` : "закрыто"}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="actions">
          {courseRegionDone(course, progress, sel)
            ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: sel })}>Итоговый экзамен{best != null ? ` · ${best}%${best >= EXAM_PASS ? " ✓" : ""}` : ""}</button>
            : <button type="button" className="btn ghost small" disabled>Экзамен после всех тем категории</button>}
        </div>
      </div>
    </section>
  );
}
