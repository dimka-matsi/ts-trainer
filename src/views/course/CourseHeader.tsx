import { useEffect, useMemo, useState } from "react";
import type { Course } from "../../content/course/types";
import { courseLessonUnlocked } from "../../state/coursePath";
import { cardDue, useProgress } from "../../state/progress";
import { navigate, type Route } from "../../state/route";
import { setTheme, useTheme } from "../../state/theme";
import { SearchDialog, type SearchSource } from "../../ui/SearchDialog";

/** Шапка курса без кода. Вид задаёт стиль направления: у «Браузера» — вкладки DevTools, у «Оптимизации» — отчёт Lighthouse. */
export function CourseHeader({ course, route }: { course: Course; route: Route }) {
  const { progress } = useProgress();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const due = course.flashcards.filter((c) => cardDue(progress, c.id)).length;
  const lesson = route.view === "course-lesson" ? course.byId[route.id] : undefined;
  const where = lesson ? course.regions[lesson.region]!.name
    : route.view === "course-cards" ? "Карточки"
    : route.view === "course-exam" ? "Экзамен"
    : route.view === "course-progress" ? "Прогресс"
    : route.view === "course-interview" ? "Пробное собеседование"
    : "Карта";
  const [search, setSearch] = useState(false);
  const source = useMemo<SearchSource>(() => ({
    lessons: course.lessons,
    regionNames: course.regions.map((r) => r.name),
    topics: [],
    cards: course.flashcards,
    unlocked: (p, id) => { const l = course.byId[id]; return !!l && courseLessonUnlocked(course, p, l); },
    go: (id) => navigate({ view: "course-lesson", course: course.id, id }),
    placeholder: course.id === "web" ? "Например: DNS, keep-alive, ETag" : course.id === "sec" ? "Например: XSS, SameSite, CSP" : "Например: LCP, чанки, React.memo",
  }), [course]);

  // «/» открывает поиск, если фокус не в поле ввода.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select")) return;
      e.preventDefault();
      setSearch(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tab = (view: Route, label: string, active: boolean, extra?: number) => (
    <button type="button" className="dt-htab" aria-current={active || undefined} onClick={() => navigate(view)}>
      {label}{extra ? <span className="badge">{extra}</span> : null}
    </button>
  );

  return (
    <header className="dt-toolbar">
      <div className="dt-toolbar-in">
        <button type="button" className="dt-back" onClick={() => navigate({ view: "hub" })} title="Все направления" aria-label="Все направления"><span aria-hidden="true">‹</span><span className="dt-back-long"> Все направления</span><span className="dt-back-short"> Хаб</span></button>
        <span className="dt-brand"><i className="dt-brand-icon" aria-hidden="true" />{course.name}<small>{where}</small></span>
        <nav className="dt-htabs" aria-label="Разделы">
          {tab({ view: "course", course: course.id }, "Карта", route.view === "course" || route.view === "course-lesson")}
          {tab({ view: "course-cards", course: course.id }, "Карточки", route.view === "course-cards" || route.view === "course-interview", due)}
          {tab({ view: "course-progress", course: course.id }, "Прогресс", route.view === "course-progress")}
        </nav>
        <button type="button" className="dt-theme" onClick={() => setSearch(true)} aria-label="Поиск" title="Поиск (/)">⌕</button>
        <button type="button" className="dt-theme" onClick={() => setTheme(next)} aria-label={next === "light" ? "Светлая тема" : "Тёмная тема"}
          title={next === "light" ? "Светлая тема" : "Тёмная тема"}>{next === "light" ? "☀" : "☾"}</button>
      </div>
      <SearchDialog open={search} onClose={() => setSearch(false)} source={source} />
    </header>
  );
}
