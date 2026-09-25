import { useEffect, useMemo, useState } from "react";
import type { Course } from "../../content/course/types";
import { courseLessonUnlocked } from "../../state/coursePath";
import { cardDue, useProgress } from "../../state/progress";
import { navigate, type Route } from "../../state/route";
import { setTheme, useTheme } from "../../state/theme";
import { Atom } from "../../ui/Atom";
import { HubButton } from "../../ui/HubButton";
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
    placeholder: course.id === "web" ? "Например: DNS, keep-alive, ETag" : course.id === "sec" ? "Например: XSS, SameSite, CSP" : course.id === "react" ? "Например: Context, useSelector, staleTime" : "Например: LCP, чанки, React.memo",
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
        <HubButton current={course.id} />
        <span className="dt-brand">{course.id === "react" ? <Atom className="dt-brand-atom" /> : <i className="dt-brand-icon" aria-hidden="true" />}{course.name}<small>{where}</small></span>
        <nav className="dt-htabs" aria-label="Разделы">
          {tab({ view: "course", course: course.id }, "Карта", route.view === "course" || route.view === "course-lesson")}
          {tab({ view: "course-cards", course: course.id }, "Карточки", route.view === "course-cards" || route.view === "course-interview", due)}
          {tab({ view: "course-progress", course: course.id }, "Прогресс", route.view === "course-progress")}
        </nav>
        <button type="button" className="dt-theme dt-search" onClick={() => setSearch(true)} aria-label="Поиск" title="Поиск (/)">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.5 15.5 21 21" />
          </svg>
        </button>
        <button type="button" className="dt-theme dt-search" onClick={() => setTheme(next)} aria-label={next === "light" ? "Светлая тема" : "Тёмная тема"}
          title={next === "light" ? "Светлая тема" : "Тёмная тема"}>
          {next === "light" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
              <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z" />
            </svg>
          )}
        </button>
      </div>
      <SearchDialog open={search} onClose={() => setSearch(false)} source={source} />
    </header>
  );
}
