import { useEffect, useRef } from "react";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { blockerOf, currentStep, lessonStep, levelStep, levelUnlocked, stepRoute } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { topicState, type PlacedTopic } from "../state/topics";
import { FLASHCARDS } from "../content/flashcards";
import { CodeBlock, Md } from "../ui/Code";
import { TheoryBlock } from "../ui/TheoryBlock";

/** Карточка темы для уровней сортировщика и регионов «скоро». */
export function TopicDialog({ topic, onClose }: { topic: PlacedTopic | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { progress } = useProgress();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (topic && !d.open) d.showModal();
    if (!topic && d.open) d.close();
  }, [topic]);

  const region = topic ? REGIONS[topic.ri]! : null;
  const st = topic ? topicState(progress, topic) : "soon";
  const step = topic?.lesson ? lessonStep(topic.lesson) : topic?.lv != null ? levelStep(topic.lv) : undefined;
  const blocker = step ? blockerOf(progress, step) : undefined;
  const now = currentStep(progress);
  const status = {
    done: "Изучено",
    open: "Можно пройти",
    ahead: blocker ? `Откроется после «${blocker.title}»` : "Откроется после предыдущих тем",
    soon: region?.kind === "soon" ? `Регион «${region.name}» в разработке` : "Тема в разработке",
  }[st];
  const level = topic?.lv != null ? LEVELS[topic.lv] : undefined;
  const card = topic ? FLASHCARDS.find((c) => c.q === topic.q) : undefined;

  return (
    <dialog ref={ref} aria-labelledby="dlgTitle" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {topic && region && (
        <div className="dlg-in">
          <button type="button" className="x" aria-label="Закрыть" onClick={onClose}>×</button>
          <h2 id="dlgTitle">{topic.t}</h2>
          <p className="dlg-sub">Регион «{region.name}». {status}.</p>
          <div className="qbox"><b>Как спрашивают на собеседовании</b><Md text={topic.q} /></div>
          {card && st !== "ahead" && (
            <details className="theory">
              <summary>Образец ответа</summary>
              <div className="tbody"><p><Md text={card.a} /></p>{card.code && <CodeBlock code={card.code} />}</div>
            </details>
          )}
          {st === "ahead" ? (
            <>
              <p>Темы открываются по порядку: каждая опирается на предыдущие. Теория и упражнения этой темы откроются, когда будут пройдены все темы до неё.</p>
              {now && (
                <button type="button" className="btn" onClick={() => { onClose(); navigate(stepRoute(now)); }}>
                  Перейти к «{now.title}»
                </button>
              )}
            </>
          ) : level && topic.lv != null ? (
            <>
              <TheoryBlock theory={level.theory} open />
              {levelUnlocked(progress, topic.lv) ? (
                <button type="button" className="btn" onClick={() => { onClose(); navigate({ view: "level", index: topic.lv! }); }}>
                  {st === "done" ? "Переиграть" : "Играть"}: уровень {topic.lv + 1}
                </button>
              ) : null}
            </>
          ) : (
            <p>Теория и упражнения по этой теме появятся позже. Пока по ней можно ориентироваться на вопрос выше.</p>
          )}
        </div>
      )}
    </dialog>
  );
}
