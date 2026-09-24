import { ACHIEVEMENTS } from "../content/achievements";
import { EXAM_PASS, hasExam } from "../content/exams";
import { FLASHCARDS } from "../content/flashcards";
import { REGIONS } from "../content/regions";
import { PATH, regionDone, stepDone } from "../state/path";
import { cardDue, cardKnown, useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { Md } from "../ui/Code";

/** Страница прогресса: темы по регионам, экзамены, карточки и достижения. */
export function ProgressView() {
  const { progress } = useProgress();
  const doneSteps = PATH.filter((s) => stepDone(progress, s)).length;
  const known = FLASHCARDS.filter((c) => cardKnown(progress, c.id)).length;
  const due = FLASHCARDS.filter((c) => cardDue(progress, c.id)).length;
  const live = REGIONS.map((r, i) => ({ r, i })).filter(({ r }) => r.kind !== "soon");

  return (
    <section className="intro progress">
      <p className="eyebrow">// прогресс</p>
      <h1>Прогресс</h1>
      <div className="stats">
        <div><b>{doneSteps}/{PATH.length}</b><span>тем пройдено</span></div>
        <div><b>{known}/{FLASHCARDS.length}</b><span>карточек выучено</span></div>
        <div><b>{progress.ach.length}/{ACHIEVEMENTS.length}</b><span>достижений</span></div>
      </div>
      {due > 0 && (
        <div className="actions"><button type="button" className="btn" onClick={() => navigate({ view: "cards" })}>Повторить карточки: {due}</button></div>
      )}

      <div className="block">
        <h2>Регионы</h2>
        <table className="ptable">
          <thead><tr><th>Регион</th><th>Темы</th><th>Экзамен</th></tr></thead>
          <tbody>
            {live.map(({ r, i }) => {
              const steps = PATH.filter((s) => s.region === i);
              const done = steps.filter((s) => stepDone(progress, s)).length;
              const best = progress.exams[i];
              return (
                <tr key={i}>
                  <td>{i + 1}. {r.name}</td>
                  <td>
                    <span className="pbar" aria-hidden="true"><i style={{ width: `${steps.length ? (done / steps.length) * 100 : 0}%` }} /></span>
                    {done} из {steps.length}
                  </td>
                  <td>
                    {!hasExam(i) ? "—"
                      : best != null ? <b className={best >= EXAM_PASS ? "ok-num" : "bad-num"}>{best}%</b>
                      : regionDone(progress, i) ? <button type="button" className="btn ghost small" onClick={() => navigate({ view: "exam", region: i })}>Сдать</button>
                      : <span className="muted">после всех тем</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="block">
        <h2>Достижения</h2>
        <ul className="ach-grid">
          {ACHIEVEMENTS.map((a) => (
            <li key={a.id} className={progress.ach.includes(a.id) ? "" : "locked"}>
              <b>{a.t}</b><span><Md text={a.d} /></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
