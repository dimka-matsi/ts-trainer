/**
 * Формат курсов без кода — «Браузер», «Оптимизация» и «Безопасность». Задания — вопросы, порядок шагов, пары и группы,
 * разбор — схема обмена и вкладка «Сеть».
 */
import type { CardLevel, Flashcard } from "../flashcards";
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

/**
 * Написать код на JavaScript: он выполняется в воркере, каждая проверка — выражение и ожидаемый результат в JSON.
 * Стартовый код обязан проваливать хотя бы одну проверку, эталон `solution` — проходить все.
 */
export interface RunTask {
  type: "run";
  goal: string;
  code: string;
  /** Пары [выражение, ожидаемый JSON]. В выражении можно `await`. */
  tests: [string, string][];
  solution: string;
  hint: string;
  /** Запрещённые приёмы: например, встроенный `Promise.all` в задаче «напиши Promise.all». */
  forbid?: { re: string; msg: string }[];
}

export type WebTask = QuizTask | OrderTask | MatchTask | SortTask | RunTask;

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

/** Уточняющий вопрос собеседования к уроку: так углубляются, когда базовый ответ уже прозвучал. */
export interface FollowUp {
  level: CardLevel;
  q: string;
  /** Ответ вслух на 2–4 предложения. */
  a: string;
}

export interface WebLesson {
  id: string;
  /** Индекс региона в WEB_REGIONS. */
  region: number;
  /** Уровень главного вопроса урока: junior — основы, middle — механизмы и приёмы, senior — устройство и архитектура. */
  level: CardLevel;
  /** Уточняющие вопросы уровня middle и senior. Задаются в `interview.ts` курса. */
  followUps?: FollowUp[];
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
export type CourseId = "web" | "perf" | "sec" | "react" | "js";

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
  /** Код курса можно запустить: у примера теории есть кнопка «Запустить», вывод показывает консоль. */
  runnable: boolean;
}

/** Собирает курс: уроки идут регион за регионом, индекс массива — индекс региона. */
export function makeCourse(id: CourseId, name: string, regions: WebRegion[], byRegion: WebLesson[][], extraCards: Flashcard[], cardPrefix: string, examBase: number, opts: { withCode?: boolean; runnable?: boolean; followUps?: Record<string, FollowUp[]> } = {}): Course {
  const lessons = byRegion.flat().map((l) => ({ ...l, followUps: opts.followUps?.[l.id] ?? l.followUps ?? [] }));
  return {
    id,
    name,
    regions,
    lessons,
    byId: Object.fromEntries(lessons.map((l) => [l.id, l])),
    flashcards: [
      ...lessons.flatMap((l): Flashcard[] => [
        { id: `${cardPrefix}-lesson-${l.id}`, region: l.region, level: l.level, q: l.q, a: l.answer },
        ...(l.followUps ?? []).map((f, i): Flashcard => ({ id: `${cardPrefix}-lesson-${l.id}-${i + 1}`, region: l.region, level: f.level, q: f.q, a: f.a })),
      ]),
      ...extraCards,
    ],
    examBase,
    withCode: opts.withCode ?? false,
    runnable: opts.runnable ?? false,
  };
}
