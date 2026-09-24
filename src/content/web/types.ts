/** Формат контента раздела «Браузер». Логика та же, что у TypeScript, но задания проверяются запуском в DOM. */
import type { QuizTask } from "../types";

/** «Что выведется»: код запускается, строки console.log склеиваются через ", " и сравниваются с вариантом. */
export interface OutputTask {
  type: "output";
  q: string;
  /** Разметка, в которой выполняется код. */
  html?: string;
  code: string;
  opts: string[];
  a: number;
  why: string;
}

/**
 * Задание на DOM: стартовый код не проходит тесты, эталонное решение проходит.
 * Тесты — JavaScript после кода ученика: доступны assert(cond, msg), logs() и sleep(ms), можно await.
 */
export interface DomTask {
  type: "dom";
  kind: "fix" | "write";
  goal: string;
  html: string;
  code: string;
  tests: string;
  hint: string;
  solution: string;
  /** Фрагменты, которые обязаны остаться в коде. */
  must?: string[];
}

export type WebTask = QuizTask | OutputTask | DomTask;

export interface WebLesson {
  id: string;
  /** Индекс региона в WEB_REGIONS. */
  region: number;
  title: string;
  q: string;
  answer: string;
  theory: {
    p: string[];
    /** Разметка и код примера: открываются в песочнице. */
    html: string;
    example: string;
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
