import type { Flashcard } from "../flashcards";
import { makeCourse, type WebLesson, type WebRegion } from "../course/types";
import { lessons as bundle } from "./lessons/bundle";
import { lessons as cases } from "./lessons/cases";
import { lessons as engine } from "./lessons/engine";
import { lessons as metrics } from "./lessons/metrics";
import { lessons as network } from "./lessons/network";
import { lessons as react } from "./lessons/react";
import { lessons as server } from "./lessons/server";
import { lessons as ui } from "./lessons/ui";

/**
 * «Оптимизация»: как сделать быстрее и как это измерить. Опирается на «Браузер» (HTTP, кэш, отрисовка),
 * поэтому механизмы там, а здесь приёмы. Порядок: сначала измерение, потом уровни от сети до JS-движка,
 * в конце — разбор типовых задач собеседования, где всё собирается вместе.
 */
const REGION_LESSONS: WebLesson[][] = [metrics, network, bundle, server, ui, react, engine, cases];

const REGIONS: WebRegion[] = [
  { name: "Измерение", kind: "lessons", desc: "Что считать быстрым и как это проверить: Core Web Vitals, профилирование, бюджеты производительности." },
  { name: "Сеть и загрузка", kind: "lessons", desc: "Меньше байтов и кругов туда-обратно: сжатие, подсказки браузеру, картинки, ленивая загрузка, сторонние скрипты." },
  { name: "Сборка и бандл", kind: "lessons", desc: "Как webpack и Vite собирают приложение: граф модулей, лоадеры, чанки и splitChunks, tree shaking, минификация." },
  { name: "Сервер", kind: "lessons", desc: "Как сократить время ответа: TTFB и Server-Timing, кэш на сервере, запросы к базе, потоковая отдача, масштабирование." },
  { name: "Рендеринг и интерфейс", kind: "lessons", desc: "Отзывчивая страница: главный поток и длинные задачи, Web Workers, debounce и throttle, размер DOM, виртуальный скролл." },
  { name: "React", kind: "lessons", desc: "Производительность React: ререндеры, React.memo, useMemo и useCallback, состояние и контекст, React.lazy и Suspense, useTransition." },
  { name: "JS-движок", kind: "lessons", desc: "Что внутри V8 и как писать предсказуемый код: JIT, скрытые классы, inline caching, встраивание, сборщик мусора, утечки памяти." },
  { name: "Разбор задач", kind: "lessons", desc: "Типовые задачи собеседования: «сайт тормозит», лента с картинками как в Instagram, медленная первая загрузка SPA, тяжёлая таблица." },
];

/** Дополнительные карточки: частые вопросы собеседований, которые не стали отдельным уроком. id начинаются с `opt-`. */
const EXTRA_CARDS: Flashcard[] = [
  {
    id: "opt-where-start", region: 0, level: "middle",
    q: "Сайт тормозит. С чего начнёшь оптимизацию?",
    a: "С замера, а не с догадок. Смотрю данные реальных пользователей: какая метрика плохая и на каких страницах и устройствах. Потом воспроизвожу в DevTools с замедлением процессора и сети и ищу самое большое узкое место: медленный сервер, тяжёлую картинку, длинную задачу. Исправляю его и замеряю снова.",
  },
  {
    id: "opt-memo", region: 5, level: "middle",
    q: "Что такое мемоизация и когда она вредит?",
    a: "Мемоизация — запомнить результат дорогого вычисления для тех же входных данных и не считать заново. Она помогает, когда вычисление действительно дорогое и входы повторяются. Вредит, когда вычисление дешёвое: сравнение входов и хранение кэша стоят больше, чем сам расчёт, а кэш без ограничения растёт и держит память.",
  },
  {
    id: "opt-critical-css", region: 1, level: "senior",
    q: "Что такое критический CSS и когда его стоит встраивать в HTML?",
    a: "Критический CSS — стили, нужные только для первого экрана. Их встраивают прямо в `<style>` в HTML, чтобы первый кадр не ждал отдельного запроса за CSS, а остальные стили грузят без блокировки отрисовки. Это оправдано, когда первый визит важнее всего, например на лендингах. Минус — встроенные стили не кэшируются отдельно и повторяются в каждой странице.",
  },
];

/** Курс «Оптимизация». Карточки уроков — `opt-lesson-<id>`, экзамены — 200 + регион. */
export const PERF = makeCourse("perf", "Оптимизация", REGIONS, REGION_LESSONS, EXTRA_CARDS, "opt", 200);
