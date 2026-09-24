import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { lessonDone, levelUnlocked, useProgress } from "../state/progress";
import { navigate, type Route } from "../state/route";

export const starStr = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

export function Header({ route }: { route: Route }) {
  const { progress } = useProgress();
  const lesson = route.view === "lesson" ? LESSON_BY_ID[route.id] : undefined;
  const sub = route.view === "level" ? "Регион 2: Болото союзов"
    : lesson ? `Регион ${lesson.region + 1}: ${REGIONS[lesson.region]!.name}`
    : "Подготовка к собеседованию по TypeScript";

  return (
    <header className="top">
      <div className="brand"><b>Тренажёр TypeScript</b><span>{sub}</span></div>
      <nav className="levels" aria-label="Навигация">
        <button type="button" className="lv viewbtn" aria-current={route.view === "map" || undefined} onClick={() => navigate({ view: "map" })}>Карта</button>
        {route.view === "level" && LEVELS.map((l, i) => {
          const st = progress.stars[i] ?? 0;
          return (
            <button key={i} type="button" className="lv" title={l.title} disabled={!levelUnlocked(progress, i)}
              aria-current={i === route.index || undefined} onClick={() => navigate({ view: "level", index: i })}>
              <b>{i + 1}</b><small>{st ? starStr(st) : "\u00a0"}</small>
            </button>
          );
        })}
        {lesson && LESSONS.filter((l) => l.region === lesson.region).map((l, i) => (
          <button key={l.id} type="button" className="lv" title={l.title} aria-current={l.id === lesson.id || undefined}
            onClick={() => navigate({ view: "lesson", id: l.id })}>
            <b>{i + 1}</b><small>{lessonDone(progress, l) ? "✓" : "\u00a0"}</small>
          </button>
        ))}
      </nav>
    </header>
  );
}
