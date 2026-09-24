import { REGIONS } from "../content/regions";
import { currentStep, stepRoute } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate } from "../state/route";

/** Экран для закрытого урока, уровня или экзамена: что пройти сначала и кнопка туда. */
export function LockedView({ what }: { what: string }) {
  const { progress } = useProgress();
  const step = currentStep(progress);
  return (
    <section className="intro locked">
      <p className="crumb">Пока закрыто</p>
      <h1>{what}</h1>
      {step ? (
        <>
          <p>Темы открываются по порядку: каждая опирается на предыдущие. Сейчас на очереди «{step.title}» в регионе «{REGIONS[step.region]!.name}».</p>
          <div className="actions">
            <button type="button" className="btn" onClick={() => navigate(stepRoute(step))}>Перейти к «{step.title}»</button>
            <button type="button" className="btn ghost" onClick={() => navigate({ view: "map" })}>К карте</button>
          </div>
        </>
      ) : (
        <div className="actions"><button type="button" className="btn ghost" onClick={() => navigate({ view: "map" })}>К карте</button></div>
      )}
    </section>
  );
}
