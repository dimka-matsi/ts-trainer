/**
 * Формат курсов без кода — «Браузер», «Оптимизация» и «Безопасность». Задания — вопросы, порядок шагов, пары и группы,
 * разбор — схема обмена и вкладка «Сеть».
 */
import type { Flashcard } from "../flashcards";
import type { QuizTask } from "../types";

/** Расставить шаги по порядку. `items` записаны в правильном порядке, интерфейс их перемешивает. */
export interface OrderTask {
  type: "order";
  q: string;
  items: string[];
  why: string;
}

/** Сопоставить пары: слева термин, справа смысл. Правые части не повторяются. */
export interface MatchTask {
  type: "match";
  q: string;
  pairs: [string, string][];
  why: string;
}

/** Разложить по группам: у каждого пункта индекс группы из `groups`. */
export interface SortTask {
  type: "sort";
  q: string;
  groups: string[];
  items: [string, number][];
  why: string;
}

export type WebTask = QuizTask | OrderTask | MatchTask | SortTask;

/** Схема обмена: участники и стрелки между ними, по шагам. */
export interface Flow {
  actors: string[];
  steps: { from: number; to: number; label: string; note?: string; lost?: boolean }[];
}

/** HTTP-сообщение: стартовая строка, заголовки, тело. */
export interface HttpMessage {
  line: string;
  headers: [string, string][];
  body?: string;
}

/** Запрос для вкладки «Сеть»: как строка в DevTools, с заголовками и таймингом. */
export interface NetRequest {
  name: string;
  type: string;
  request: HttpMessage;
  response: HttpMessage;
  /** Фазы и их длительность в миллисекундах, в порядке выполнения. */
  timing: [string, number][];
  /** С какой миллисекунды начался запрос. */
  start: number;
}

export interface WebLesson {
  id: string;
  /** Индекс региона в WEB_REGIONS. */
  region: number;
  title: string;
  q: string;
  answer: string;
  theory: {
    p: string[];
    flow?: Flow;
    requests?: NetRequest[];
    /** Пример кода к теории. Только в курсах с кодом (`withCode`), verify проверяет синтаксис. */
    code?: string;
    keys: string[];
  };
  tasks: WebTask[];
}

export interface WebRegion {
  name: string;
  kind: "lessons" | "soon";
  desc: string;
  /** Темы региона «скоро»; у региона с уроками темы берутся из уроков. */
  topics?: { t: string; q: string }[];
}

/** Направления с уроками этого формата. id совпадает с началом адреса: `#/web`, `#/perf`. */
export type CourseId = "web" | "perf" | "sec" | "react";

/** Курс: регионы, уроки по порядку прохождения, карточки и база ключей экзаменов в общем прогрессе. */
export interface Course {
  id: CourseId;
  name: string;
  regions: WebRegion[];
  lessons: WebLesson[];
  byId: Record<string, WebLesson>;
  flashcards: Flashcard[];
  /** Ключ экзамена региона: examBase + индекс региона. У TypeScript ключи 0…10. */
  examBase: number;
  /** В курсе можно показывать код: в теории и в вопросах. В остальных курсах кода нет совсем. */
  withCode: boolean;
}

/** Собирает курс: уроки идут регион за регионом, индекс массива — индекс региона. */
export function makeCourse(id: CourseId, name: string, regions: WebRegion[], byRegion: WebLesson[][], extraCards: Flashcard[], cardPrefix: string, examBase: number, opts: { withCode?: boolean } = {}): Course {
  const lessons = byRegion.flat();
  return {
    id,
    name,
    regions,
    lessons,
    byId: Object.fromEntries(lessons.map((l) => [l.id, l])),
    flashcards: [
      ...lessons.map((l): Flashcard => ({ id: `${cardPrefix}-lesson-${l.id}`, region: l.region, level: "junior", q: l.q, a: l.answer })),
      ...extraCards,
    ],
    examBase,
    withCode: opts.withCode ?? false,
  };
}
