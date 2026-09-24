import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { lessonDone, lessonUnlocked, levelUnlocked } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate, type Route } from "../state/route";
import { setTheme, useTheme } from "../state/theme";

export const starStr = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

export function Header({ route }: { route: Route }) {
  const { progress } = useProgress();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const lesson = route.view === "lesson" ? LESSON_BY_ID[route.id] : undefined;
  const sub = route.view === "level" ? "Регион 2: Болото союзов"
    : lesson ? `Регион ${lesson.region + 1}: ${REGIONS[lesson.region]!.name}`
    : route.view === "exam" ? `Экзамен: ${REGIONS[route.region]?.name ?? ""}`
    : route.view === "cards" ? "Вопросы с собеседований"
    : "Подготовка к собеседованию";

  return (
    <header className="top">
      <div className="top-in">
        <div className="brand">
          <span className="logo" aria-hidden="true">TS</span>
          <span className="brand-t"><b>Тренажёр TypeScript</b><span>{sub}</span></span>
        </div>
        <nav className="levels" aria-label="Навигация">
          <button type="button" className="lv viewbtn" aria-current={route.view === "map" || undefined} onClick={() => navigate({ view: "map" })}>Карта</button>
          <button type="button" className="lv viewbtn" aria-current={route.view === "cards" || undefined} onClick={() => navigate({ view: "cards" })}>Карточки</button>
          <button type="button" className="lv themebtn" onClick={() => setTheme(next)}
            aria-label={next === "light" ? "Включить светлую тему" : "Включить тёмную тему"} title={next === "light" ? "Светлая тема" : "Тёмная тема"}>
            <i className={`px-icon ${next === "light" ? "sun" : "moon"}`} aria-hidden="true" />
          </button>
          {route.view === "level" && LEVELS.map((l, i) => {
            const st = progress.stars[i] ?? 0;
            return (
              <button key={i} type="button" className="lv" title={l.title} disabled={!levelUnlocked(progress, i)}
                aria-current={i === route.index || undefined} onClick={() => navigate({ view: "level", index: i })}>
                <b>{i + 1}</b><small>{st ? starStr(st) : " "}</small>
              </button>
            );
          })}
          {lesson && LESSONS.filter((l) => l.region === lesson.region).map((l, i) => (
            <button key={l.id} type="button" className="lv" title={l.title} aria-current={l.id === lesson.id || undefined}
              disabled={!lessonUnlocked(progress, l)}
              onClick={() => navigate({ view: "lesson", id: l.id })}>
              <b>{i + 1}</b><small>{lessonDone(progress, l) ? "✓" : " "}</small>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
