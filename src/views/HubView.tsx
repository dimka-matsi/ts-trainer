import { COURSES } from "../content/courses";
import type { Course } from "../content/course/types";
import { FLASHCARDS } from "../content/flashcards";
import { currentStep, PATH, stepDone } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate, type Route } from "../state/route";
import { setTheme, useTheme } from "../state/theme";
import { courseCurrent, courseLessonDone } from "../state/coursePath";
import { HubQuestion } from "./HubQuestion";

interface TrackCard {
  id: string;
  name: string;
  tagline: string;
  about: string;
  route?: Route;
  done?: number;
  total?: number;
  cards?: number;
  /** Следующий урок направления. */
  next?: string;
}

/** Ширина живых карточек в сетке из 12 колонок: главная широкая, дальше «ёлочкой». */
const SPANS = [7, 5, 5, 7];

/** Главный экран: выбор направления. У каждого направления своя карта и свой стиль. */
export function HubView() {
  const { progress } = useProgress();
  const courseStats = (c: Course): Pick<TrackCard, "route" | "done" | "total" | "cards" | "next"> => ({
    route: { view: "course", course: c.id },
    done: c.lessons.filter((l) => courseLessonDone(progress, l)).length,
    total: c.lessons.length,
    cards: c.flashcards.length,
    next: courseCurrent(c, progress)?.title,
  });
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const tracks: TrackCard[] = [
    {
      id: "ts", name: "TypeScript", tagline: "Типы от основ до утилит",
      about: "Уроки по TypeScript Handbook, песочница с настоящим компилятором, задания, которые проверяет tsc.",
      route: { view: "map" }, done: PATH.filter((s) => stepDone(progress, s)).length, total: PATH.length, cards: FLASHCARDS.length,
      next: currentStep(progress)?.title,
    },
    {
      id: "web", name: "Браузер", tagline: "Сеть, HTTP, кэш, отрисовка",
      about: "Как страница попадает на экран: TCP и UDP, DNS, HTTP и TLS, cookies, кэш и CDN, устройство браузера, отрисовка и реальное время.",
      ...courseStats(COURSES.web),
    },
    {
      id: "sec", name: "Безопасность", tagline: "XSS, CSRF, CORS, CSP, токены",
      about: "Как атакуют сайт и как защищаться: флаги cookies, политика одного источника и CORS, XSS и CSRF, заголовки защиты, JWT и OAuth. Лучше после «Браузера».",
      ...courseStats(COURSES.sec),
    },
    {
      id: "perf", name: "Оптимизация", tagline: "Метрики, сборка, сервер, React, JS-движок",
      about: "Как сделать сайт быстрым и доказать это цифрами: Core Web Vitals, webpack и чанки, TTFB, ререндеры React, виртуализация, скрытые классы и разбор задач с собеседований. Лучше после «Браузера».",
      ...courseStats(COURSES.perf),
    },
    { id: "js", name: "JavaScript", tagline: "Замыкания, this, event loop, DOM", about: "Язык и работа со страницей: асинхронность, события DOM, Web API." },
    { id: "react", name: "React", tagline: "Компоненты, хуки, рендеринг", about: "Состояние, эффекты, мемоизация, архитектура компонентов." },
    { id: "node", name: "Node.js", tagline: "Сервер, потоки, модули", about: "Event loop в Node, файлы и потоки, HTTP-сервер, npm." },
    { id: "vue", name: "Vue", tagline: "Реактивность и компоненты", about: "Composition API, реактивность, шаблоны и маршрутизация." },
  ];

  // Первой и крупнее идёт карточка, где пройдено больше всего: к ней обычно и возвращаются.
  const live = tracks.filter((t) => t.route);
  const share = (t: TrackCard) => (t.total ? (t.done ?? 0) / t.total : 0);
  const lead = live.reduce((best, t) => (share(t) > share(best) ? t : best), live[0]!);
  const ordered = [lead, ...live.filter((t) => t !== lead)];
  const soon = tracks.filter((t) => !t.route);

  return (
    <div className="hub">
      <header className="hub-top">
        <span className="hub-logo">Preflight<small>подготовка к фронтенд-собеседованию</small></span>
        <button type="button" className="hub-theme" onClick={() => setTheme(next)} aria-label={next === "light" ? "Светлая тема" : "Тёмная тема"}>
          {next === "light" ? "☀" : "☾"}
        </button>
      </header>
      <HubQuestion />
      <section className="hub-hero">
        <h1>Что готовим к собеседованию?</h1>
        <p>В каждом направлении одно и то же: курс по порядку, задания с проверкой, итоговые экзамены, флеш-карточки с вопросами и тренировка ответа вслух.</p>
      </section>
      <div className="hub-grid">
        {ordered.map((t, i) => {
          const pct = t.total ? Math.round(((t.done ?? 0) / t.total) * 100) : 0;
          return (
            <button key={t.id} type="button" className={`hub-card hc-${t.id}`} data-span={SPANS[i] ?? 6}
              onClick={() => t.route && navigate(t.route)}>
              <span className="hc-art" aria-hidden="true" />
              <span className="hc-name">{t.name}</span>
              <span className="hc-tag">{t.tagline}</span>
              <span className="hc-about">{t.about}</span>
              <span className="hc-meta">
                <span className="hc-next">{t.next ? <>{t.done ? "Дальше" : "Начать"}: <b>{t.next}</b></> : "Всё пройдено"}</span>
                <span className="hc-bar"><i style={{ width: `${pct}%` }} /></span>
                <span>{t.done} из {t.total} тем · {t.cards} карточек</span>
              </span>
            </button>
          );
        })}
        {soon.map((t) => (
          <div key={t.id} className={`hub-card soon hc-${t.id}`}>
            <span className="hc-name">{t.name}</span>
            <span className="hc-tag">{t.tagline}</span>
            <span className="hc-meta hc-soon">Скоро</span>
          </div>
        ))}
      </div>
    </div>
  );
}
