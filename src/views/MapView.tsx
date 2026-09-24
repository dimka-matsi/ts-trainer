import { useState } from "react";
import { REGIONS } from "../content/regions";
import { useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { allTopics, ICON, nextLesson, nextLevel, topicState, type PlacedTopic } from "../state/topics";
import { Md } from "../ui/Code";
import { TopicDialog } from "./TopicDialog";

export function MapView() {
  const { progress } = useProgress();
  const [dialog, setDialog] = useState<PlacedTopic | null>(null);
  const topics = allTopics();
  const learned = topics.filter((t) => topicState(progress, t) === "done").length;

  const openTopic = (t: PlacedTopic) => {
    if (t.lesson) navigate({ view: "lesson", id: t.lesson });
    else setDialog(t);
  };

  return (
    <section className="map">
      <h1>Дорожная карта</h1>
      <p className="lead">Девять регионов по порядку TypeScript Handbook, от основ до контрактов API. Каждая тема — это вопрос, который задают на собеседованиях по TypeScript. Нажми на тему, чтобы открыть урок или теорию.</p>
      <p className="total">Изучено {learned} из {topics.length} тем. Сейчас открыты регионы «Основы», «Болото союзов» и «Мастерская утилит».</p>
      <div className="legend"><span>✓ изучено</span><span>● можно пройти</span><span>○ впереди</span></div>
      <div className="regions">
        {REGIONS.map((r, ri) => {
          const ts = topics.filter((t) => t.ri === ri);
          const done = ts.filter((t) => topicState(progress, t) === "done").length;
          let cta = null;
          if (r.kind === "sorter") {
            const nl = nextLevel(progress);
            cta = (
              <button type="button" className="btn" onClick={() => navigate({ view: "level", index: nl >= 0 ? nl : 0 })}>
                {nl >= 0 ? (done ? `Продолжить: уровень ${nl + 1}` : "Начать с уровня 1") : "Переиграть регион"}
              </button>
            );
          } else if (r.kind === "lessons") {
            const nx = nextLesson(progress, ri);
            cta = (
              <button type="button" className="btn" onClick={() => navigate({ view: "lesson", id: nx.lesson.id })}>
                {nx.index < 0 ? "Повторить регион" : done ? `Продолжить: урок ${nx.index + 1}` : "Начать с урока 1"}
              </button>
            );
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
                {cta && <div className="rlevels">{cta}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <TopicDialog topic={dialog} onClose={() => setDialog(null)} />
    </section>
  );
}
