import { useState } from "react";
import { EXAM_PASS, hasExam } from "../content/exams";
import { FLASHCARDS } from "../content/flashcards";
import { LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { currentStep, PATH, regionDone, regionUnlocked, stepDone, stepRoute } from "../state/path";
import { allTopics, ICON, topicState, type PlacedTopic } from "../state/topics";
import { Md } from "../ui/Code";
import { TopicDialog } from "./TopicDialog";

export function MapView() {
  const { progress } = useProgress();
  const [dialog, setDialog] = useState<PlacedTopic | null>(null);
  const topics = allTopics();
  const liveRegions = REGIONS.filter((r) => r.kind !== "soon").length;
  const learned = topics.filter((t) => topicState(progress, t) === "done").length;

  const openTopic = (t: PlacedTopic) => {
    if (t.lesson && topicState(progress, t) !== "ahead") navigate({ view: "lesson", id: t.lesson });
    else setDialog(t);
  };
  const now = currentStep(progress);

  return (
    <section className="map">
      <p className="eyebrow">// TypeScript Handbook → собеседование</p>
      <h1>Дорожная карта</h1>
      <p className="lead">Регионы идут по порядку TypeScript Handbook, от основ до контрактов API, а в конце — React и компилятор. Каждая тема — это вопрос, который задают на собеседованиях по TypeScript. Нажми на тему, чтобы открыть урок или теорию.</p>
      <div className="stats">
        <div><b>{learned}/{topics.length}</b><span>тем изучено</span></div>
        <div><b>{liveRegions}/{REGIONS.length}</b><span>регионов открыто</span></div>
        <div><b>{LESSONS.length}</b><span>уроков</span></div>
      </div>
      <div className="actions hero-actions">
        {now && (
          <button type="button" className="btn" onClick={() => navigate(stepRoute(now))}>
            {learned ? "Продолжить" : "Начать"}: {now.title}
          </button>
        )}
        <button type="button" className="btn ghost" onClick={() => navigate({ view: "cards" })}>Флеш-карточки: {FLASHCARDS.length} вопросов</button>
      </div>
      <div className="legend"><span>✓ изучено</span><span>● открыто</span><span>○ откроется после предыдущих тем</span></div>
      <div className="regions">
        {REGIONS.map((r, ri) => {
          const ts = topics.filter((t) => t.ri === ri);
          const done = ts.filter((t) => topicState(progress, t) === "done").length;
          let cta = null;
          if (r.kind !== "soon") {
            const steps = PATH.filter((s) => s.region === ri);
            const next = steps.find((s) => !stepDone(progress, s));
            if (!regionUnlocked(progress, ri)) {
              const prev = REGIONS.slice(0, ri).map((x, i) => ({ x, i })).reverse().find(({ x }) => x.kind !== "soon");
              cta = <button type="button" className="btn" disabled>Откроется после региона «{prev?.x.name}»</button>;
            } else if (next) {
              cta = (
                <button type="button" className="btn" onClick={() => navigate(stepRoute(next))}>
                  {done ? "Продолжить" : "Начать"}: {next.title}
                </button>
              );
            } else if (steps[0]) {
              const first = steps[0];
              cta = <button type="button" className="btn ghost" onClick={() => navigate(stepRoute(first))}>Повторить регион</button>;
            }
          }
          return (
            <div key={ri} className={`region ${r.kind === "soon" ? "soon" : "live"}`}>
              <div className="rail"><div className="num">{ri + 1}</div></div>
              <div className="rcard">
                <div className="rhead">
                  <h2>{r.name}</h2>
                  <span className="rstat">{r.kind === "soon" ? `Скоро, ${ts.length} темы` : `Изучено ${done} из ${ts.length}`}</span>
                </div>
                <p className="rdesc"><Md text={r.desc} /></p>
                {r.kind !== "soon" && <div className="bar" aria-hidden="true"><i style={{ width: `${Math.round((done / ts.length) * 100)}%` }} /></div>}
                <div className="topics">
                  {ts.map((t) => {
                    const st = topicState(progress, t);
                    return (
                      <button key={t.ti} type="button" className={`topic ${st}`} onClick={() => openTopic(t)}>
                        <span className="ic" aria-hidden="true">{ICON[st]}</span>{t.t}
                      </button>
                    );
                  })}
                </div>
                {(cta || (r.kind !== "soon" && hasExam(ri))) && (
                  <div className="rlevels">
                    {cta}
                    {r.kind !== "soon" && hasExam(ri) && (
                      regionDone(progress, ri) ? (
                        <button type="button" className="btn ghost" onClick={() => navigate({ view: "exam", region: ri })}>
                          Итоговый экзамен{progress.exams[ri] != null ? ` · ${progress.exams[ri]}%${progress.exams[ri]! >= EXAM_PASS ? " ✓" : ""}` : ""}
                        </button>
                      ) : (
                        <button type="button" className="btn ghost" disabled title="Экзамен откроется, когда будут пройдены все темы региона">
                          Экзамен после всех тем
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <TopicDialog topic={dialog} onClose={() => setDialog(null)} />
    </section>
  );
}
