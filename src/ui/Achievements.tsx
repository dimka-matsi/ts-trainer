import { ACHIEVEMENTS } from "../content/achievements";
import { useProgress } from "../state/progress";
import { Md } from "./Code";

export function Achievements() {
  const { progress } = useProgress();
  return (
    <details className="ach">
      <summary>Достижения: {progress.ach.length} из {ACHIEVEMENTS.length}</summary>
      <ul>
        {ACHIEVEMENTS.map((a) => (
          <li key={a.id} className={progress.ach.includes(a.id) ? "" : "locked"}>
            <b>{a.t}</b><span><Md text={a.d} /></span>
          </li>
        ))}
      </ul>
    </details>
  );
}
