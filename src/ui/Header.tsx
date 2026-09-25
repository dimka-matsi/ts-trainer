import { useEffect, useRef, useState } from "react";
import { FLASHCARDS } from "../content/flashcards";
import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { lessonDone, lessonUnlocked, levelUnlocked } from "../state/path";
import { cardDue, useProgress } from "../state/progress";
import { navigate, type Route } from "../state/route";
import { setTheme, useTheme } from "../state/theme";
import { HubButton } from "./HubButton";
import { SearchDialog, type SearchSource } from "./SearchDialog";

/** Поиск TypeScript: уроки, темы «скоро» и карточки. */
const TS_SEARCH: SearchSource = {
  lessons: LESSONS,
  regionNames: REGIONS.map((r) => r.name),
  topics: REGIONS.flatMap((r, ri) => (r.kind === "soon" ? (r.topics ?? []).map((t) => ({ ...t, ri })) : [])),
  cards: FLASHCARDS,
  unlocked: (p, id) => { const l = LESSON_BY_ID[id]; return !!l && lessonUnlocked(p, l); },
  go: (id) => navigate({ view: "lesson", id }),
  placeholder: "Например: satisfies, keyof, never",
};

export const starStr = (n: number) => "★".repeat(n) + "☆".repeat(3 - n);

interface Item { key: string; label: string; title: string; mark: string; current: boolean; disabled: boolean; go(): void }

export function Header({ route }: { route: Route }) {
  const { progress } = useProgress();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const [search, setSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Высота закреплённой шапки → --header-h: прокрутка к разделам останавливается под шапкой, а не за ней.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => {
      const sticky = getComputedStyle(el).position === "sticky";
      document.documentElement.style.setProperty("--header-h", `${sticky ? el.offsetHeight : 0}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, []);
  const lesson = route.view === "lesson" ? LESSON_BY_ID[route.id] : undefined;
  const due = FLASHCARDS.filter((c) => cardDue(progress, c.id)).length;
  const sub = route.view === "level" ? `Регион 2: ${REGIONS[1]!.name}`
    : lesson ? `Регион ${lesson.region + 1}: ${REGIONS[lesson.region]!.name}`
    : route.view === "exam" ? `Экзамен: ${REGIONS[route.region]?.name ?? ""}`
    : route.view === "cards" ? "Вопросы с собеседований"
    : route.view === "interview" ? "Пробное собеседование"
    : route.view === "progress" ? "Прогресс"
    : "Подготовка к собеседованию";

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

  // Номера уровней или уроков текущего региона: кнопками на широком экране, списком на узком.
  const items: Item[] = route.view === "level"
    ? LEVELS.map((l, i) => {
        const st = progress.stars[i] ?? 0;
        return {
          key: `l${i}`, label: String(i + 1), title: l.title, mark: st ? starStr(st) : " ",
          current: i === route.index, disabled: !levelUnlocked(progress, i), go: () => navigate({ view: "level", index: i }),
        };
      })
    : lesson
      ? LESSONS.filter((l) => l.region === lesson.region).map((l, i) => ({
          key: l.id, label: String(i + 1), title: l.title, mark: lessonDone(progress, l) ? "✓" : " ",
          current: l.id === lesson.id, disabled: !lessonUnlocked(progress, l), go: () => navigate({ view: "lesson", id: l.id }),
        }))
      : [];
  const currentIdx = items.findIndex((it) => it.current);

  return (
    <header className="top" ref={headerRef}>
      <div className="top-in">
        <div className="top-start">
          <HubButton current="ts" />
          <button type="button" className="brand" onClick={() => navigate({ view: "map" })} title="Карта TypeScript">
            <span className="logo" aria-hidden="true">TS</span>
            <span className="brand-t"><b>Тренажёр TypeScript</b><span>{sub}</span></span>
          </button>
        </div>
        <nav className="levels" aria-label="Навигация">
          <button type="button" className="lv viewbtn" aria-current={route.view === "map" || undefined} onClick={() => navigate({ view: "map" })}>Карта</button>
          <button type="button" className="lv viewbtn" aria-current={route.view === "cards" || undefined} onClick={() => navigate({ view: "cards" })}>
            Карточки{due > 0 && <span className="badge" aria-label={`повторить ${due}`}>{due}</span>}
          </button>
          <button type="button" className="lv viewbtn" aria-current={route.view === "progress" || undefined} onClick={() => navigate({ view: "progress" })}>Прогресс</button>
          <button type="button" className="lv iconbtn" onClick={() => setSearch(true)} aria-label="Поиск" title="Поиск (/)">
            <i className="px-icon search" aria-hidden="true" />
          </button>
          <button type="button" className="lv iconbtn" onClick={() => setTheme(next)}
            aria-label={next === "light" ? "Включить светлую тему" : "Включить тёмную тему"} title={next === "light" ? "Светлая тема" : "Тёмная тема"}>
            <i className={`px-icon ${next === "light" ? "sun" : "moon"}`} aria-hidden="true" />
          </button>
        </nav>
        {items.length > 0 && (
          <>
            <nav className="levels steps-wide" aria-label={route.view === "level" ? "Уровни" : "Уроки региона"}>
              {items.map((it) => (
                <button key={it.key} type="button" className="lv" title={it.title} disabled={it.disabled}
                  aria-current={it.current || undefined} onClick={it.go}>
                  <b>{it.label}</b><small>{it.mark}</small>
                </button>
              ))}
            </nav>
            <label className="steps-narrow">
              <span className="sr-only">{route.view === "level" ? "Уровень" : "Урок"}</span>
              <select value={currentIdx} onChange={(e) => items[Number(e.target.value)]?.go()}>
                {items.map((it, i) => (
                  <option key={it.key} value={i} disabled={it.disabled}>
                    {route.view === "level" ? "Уровень" : "Урок"} {it.label} из {items.length}: {it.title}{it.disabled ? " (закрыто)" : it.mark.trim() ? ` ${it.mark}` : ""}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>
      <SearchDialog open={search} onClose={() => setSearch(false)} source={TS_SEARCH} />
    </header>
  );
}
