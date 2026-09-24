import { useEffect, useRef } from "react";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { levelUnlocked, useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { topicState, type PlacedTopic } from "../state/topics";
import { Md } from "../ui/Code";
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
  const status = { done: "Изучено", open: "Можно пройти", ahead: "Откроется после предыдущих уровней", soon: `Регион «${region?.name}» в разработке` }[st];
  const level = topic?.lv != null ? LEVELS[topic.lv] : undefined;

  return (
    <dialog ref={ref} aria-labelledby="dlgTitle" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {topic && region && (
        <div className="dlg-in">
          <button type="button" className="x" aria-label="Закрыть" onClick={onClose}>×</button>
          <h2 id="dlgTitle">{topic.t}</h2>
          <p className="dlg-sub">Регион «{region.name}». {status}.</p>
          <div className="qbox"><b>Как спрашивают на собеседовании</b><Md text={topic.q} /></div>
          {level && topic.lv != null ? (
            <>
              <TheoryBlock theory={level.theory} open />
              {levelUnlocked(progress, topic.lv) ? (
                <button type="button" className="btn" onClick={() => { onClose(); navigate({ view: "level", index: topic.lv! }); }}>
                  {st === "done" ? "Переиграть" : "Играть"}: уровень {topic.lv + 1}
                </button>
              ) : (
                <p className="dlg-sub">Уровень {topic.lv + 1} откроется, когда пройдёшь уровень {topic.lv}.</p>
              )}
            </>
          ) : (
            <p>Теория и упражнения по этой теме появятся вместе с регионом. Пока по ней можно ориентироваться на вопрос выше.</p>
          )}
        </div>
      )}
    </dialog>
  );
}
