/**
 * Формат контента раздела «Браузер»: сеть, протоколы и то, как браузер загружает страницу.
 * Кода на JavaScript здесь нет: задания — вопросы, порядок шагов, пары и группы.
 */
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
