import type { Course } from "../../content/course/types";
import { EXAM_PASS } from "../../content/exams";
import { courseLessonDone, courseRegionDone, courseRegionLessons } from "../../state/coursePath";
import { cardDue, cardKnown, useProgress } from "../../state/progress";
import { navigate } from "../../state/route";

/** Страница прогресса курса без кода: уроки по регионам, экзамены и карточки. */
export function CourseProgressView({ course }: { course: Course }) {
  const { progress } = useProgress();
  const done = course.lessons.filter((l) => courseLessonDone(progress, l)).length;
  const known = course.flashcards.filter((c) => cardKnown(progress, c.id)).length;
  const due = course.flashcards.filter((c) => cardDue(progress, c.id)).length;
  const passed = course.regions.filter((_, i) => (progress.exams[course.examBase + i] ?? 0) >= EXAM_PASS).length;

  return (
    <section className="intro progress">
      <p className="eyebrow">// прогресс</p>
      <h1>Прогресс: {course.name}</h1>
      <div className="stats">
        <div><b>{done}/{course.lessons.length}</b><span>уроков пройдено</span></div>
        <div><b>{known}/{course.flashcards.length}</b><span>карточек выучено</span></div>
        <div><b>{passed}/{course.regions.length}</b><span>экзаменов сдано</span></div>
      </div>
      <div className="actions">
        {due > 0 && <button type="button" className="btn" onClick={() => navigate({ view: "course-cards", course: course.id })}>Повторить карточки: {due}</button>}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "course-interview", course: course.id })}>Пробное собеседование</button>
      </div>

      <div className="block">
        <h2>Регионы</h2>
        <table className="ptable">
          <thead><tr><th>Регион</th><th>Уроки</th><th>Экзамен</th></tr></thead>
          <tbody>
            {course.regions.map((r, i) => {
              const ls = courseRegionLessons(course, i);
              const d = ls.filter((l) => courseLessonDone(progress, l)).length;
              const best = progress.exams[course.examBase + i];
              return (
                <tr key={r.name}>
                  <td>{i + 1}. {r.name}</td>
                  <td>
                    <span className="pbar" aria-hidden="true"><i style={{ width: `${ls.length ? (d / ls.length) * 100 : 0}%` }} /></span>
                    {d} из {ls.length}
                  </td>
                  <td>
                    {best != null ? <b className={best >= EXAM_PASS ? "ok-num" : "bad-num"}>{best}%</b>
                      : courseRegionDone(course, progress, i) ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "course-exam", course: course.id, region: i })}>Сдать</button>
                      : <span className="muted">после всех уроков</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
