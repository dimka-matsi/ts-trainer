import { WEB_FLASHCARDS, WEB_LESSON_BY_ID, WEB_REGIONS } from "../../content/web";
import { cardDue, useProgress } from "../../state/progress";
import { navigate, type Route } from "../../state/route";
import { setTheme, useTheme } from "../../state/theme";

/** Шапка «Браузера»: панель вкладок как у DevTools. */
export function WebHeader({ route }: { route: Route }) {
  const { progress } = useProgress();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const due = WEB_FLASHCARDS.filter((c) => cardDue(progress, c.id)).length;
  const lesson = route.view === "web-lesson" ? WEB_LESSON_BY_ID[route.id] : undefined;
  const where = lesson ? WEB_REGIONS[lesson.region]!.name : route.view === "web-cards" ? "Карточки" : route.view === "web-exam" ? "Экзамен" : "Карта";

  const tab = (view: Route, label: string, active: boolean, extra?: number) => (
    <button type="button" className="dt-htab" aria-current={active || undefined} onClick={() => navigate(view)}>
      {label}{extra ? <span className="badge">{extra}</span> : null}
    </button>
  );

  return (
    <header className="dt-toolbar">
      <div className="dt-toolbar-in">
        <button type="button" className="dt-back" onClick={() => navigate({ view: "hub" })} title="Все направления" aria-label="Все направления"><span aria-hidden="true">‹</span><span className="dt-back-long"> Все направления</span><span className="dt-back-short"> Хаб</span></button>
        <span className="dt-brand"><i className="dt-brand-icon" aria-hidden="true" />Браузер<small>{where}</small></span>
        <nav className="dt-htabs" aria-label="Разделы">
          {tab({ view: "web" }, "Карта", route.view === "web" || route.view === "web-lesson")}
          {tab({ view: "web-cards" }, "Карточки", route.view === "web-cards", due)}
        </nav>
        <button type="button" className="dt-theme" onClick={() => setTheme(next)} aria-label={next === "light" ? "Светлая тема" : "Тёмная тема"}
          title={next === "light" ? "Светлая тема" : "Тёмная тема"}>{next === "light" ? "☀" : "☾"}</button>
      </div>
    </header>
  );
}
