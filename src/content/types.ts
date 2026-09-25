/** Формат учебного контента. Подробности — в CLAUDE.md. */

export type ForbidPreset = "any" | "as" | "nonnull" | "ignore";
export type ForbidRule = ForbidPreset | { re: string; msg: string };

export interface QuizTask {
  type: "quiz";
  q: string;
  opts: string[];
  /** Индекс правильного варианта. */
  a: number;
  why: string;
  /** Код к вопросу, показывается перед ним. Только в курсах с кодом. */
  code?: string;
  /** Код к объяснению, показывается после ответа. Строки с ошибкой помечаются `// ошибка`, verify это проверяет. */
  example?: string;
}

export interface PredictTask {
  type: "predict";
  q: string;
  code: string;
  /** Имя объявления, тип которого проверяется компилятором. */
  probe: string;
  /** Варианты в том виде, как их печатает компилятор (однострочно). */
  opts: string[];
  a: number;
  why: string;
}

export interface CodeTask {
  type: "code";
  /** fix — починить код, write — написать тип или утилиту. */
  kind: "fix" | "write";
  goal: string;
  code: string;
  /** Скрытые тесты на типы, дописываются после кода ученика. */
  tests?: string;
  /** Проверки при запуске: [выражение, ожидаемый JSON]. */
  runtime?: [expr: string, expected: string][];
  forbid?: ForbidRule[];
  /** Фрагменты, которые обязаны остаться в коде. */
  must?: string[];
  hint: string;
  solution: string;
}

export type Task = QuizTask | PredictTask | CodeTask;

export interface Theory {
  p: string[];
  example: string;
  keys: string[];
}

export interface Lesson {
  id: string;
  /** Индекс региона в REGIONS. */
  region: number;
  title: string;
  /** Вопрос, как его задают на собеседовании. */
  q: string;
  /** Образец ответа вслух. */
  answer: string;
  theory: Theory;
  tasks: Task[];
}
