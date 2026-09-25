import { WEB_FLASHCARDS, WEB_LESSONS } from "../content/web";
import { FLASHCARDS } from "../content/flashcards";
import { PATH, stepDone } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate, type Route } from "../state/route";
import { setTheme, useTheme } from "../state/theme";
import { webLessonDone } from "../state/webPath";

interface TrackCard {
  id: string;
  name: string;
  tagline: string;
  about: string;
  route?: Route;
  done?: number;
  total?: number;
  cards?: number;
}

/** Главный экран: выбор направления. У каждого направления своя карта и свой стиль. */
export function HubView() {
  const { progress } = useProgress();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  const tracks: TrackCard[] = [
    {
      id: "ts", name: "TypeScript", tagline: "Типы от основ до утилит",
      about: "Уроки по TypeScript Handbook, песочница с настоящим компилятором, задания, которые проверяет tsc.",
      route: { view: "map" }, done: PATH.filter((s) => stepDone(progress, s)).length, total: PATH.length, cards: FLASHCARDS.length,
    },
    {
      id: "web", name: "Браузер", tagline: "Сеть, HTTP, безопасность, оптимизация",
      about: "Как страница попадает на экран: TCP и UDP, DNS, HTTP и TLS, cookies, кэш и CDN, CORS, атаки, отрисовка и оптимизация от сети до JS-движка.",
      route: { view: "web" }, done: WEB_LESSONS.filter((l) => webLessonDone(progress, l)).length, total: WEB_LESSONS.length, cards: WEB_FLASHCARDS.length,
    },
    { id: "js", name: "JavaScript", tagline: "Замыкания, this, event loop, DOM", about: "Язык и работа со страницей: асинхронность, события DOM, Web API." },
    { id: "react", name: "React", tagline: "Компоненты, хуки, рендеринг", about: "Состояние, эффекты, мемоизация, архитектура компонентов." },
    { id: "node", name: "Node.js", tagline: "Сервер, потоки, модули", about: "Event loop в Node, файлы и потоки, HTTP-сервер, npm." },
    { id: "vue", name: "Vue", tagline: "Реактивность и компоненты", about: "Composition API, реактивность, шаблоны и маршрутизация." },
  ];

  return (
    <div className="hub">
      <header className="hub-top">
        <span className="hub-logo">Тренажёр<small>подготовка к собеседованию</small></span>
        <button type="button" className="hub-theme" onClick={() => setTheme(next)} aria-label={next === "light" ? "Светлая тема" : "Тёмная тема"}>
          {next === "light" ? "☀" : "☾"}
        </button>
      </header>
      <section className="hub-hero">
        <h1>Что готовим к собеседованию?</h1>
        <p>В каждом направлении одно и то же: курс по порядку, задания с проверкой, итоговые экзамены, флеш-карточки с вопросами и тренировка ответа вслух.</p>
      </section>
      <div className="hub-grid">
        {tracks.map((t) => {
          const live = !!t.route;
          const pct = live && t.total ? Math.round(((t.done ?? 0) / t.total) * 100) : 0;
          return (
            <button key={t.id} type="button" className={`hub-card hc-${t.id}${live ? "" : " soon"}`} disabled={!live}
              onClick={() => t.route && navigate(t.route)}>
              <span className="hc-art" aria-hidden="true" />
              <span className="hc-name">{t.name}</span>
              <span className="hc-tag">{t.tagline}</span>
              <span className="hc-about">{t.about}</span>
              {live ? (
                <span className="hc-meta">
                  <span className="hc-bar"><i style={{ width: `${pct}%` }} /></span>
                  <span>{t.done} из {t.total} тем · {t.cards} карточек</span>
                </span>
              ) : <span className="hc-meta hc-soon">Скоро</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
