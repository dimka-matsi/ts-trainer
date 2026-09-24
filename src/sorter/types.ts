import type { Theory } from "../content/types";

export type Narrow = "yes" | "no" | "both";

export interface TsError {
  code: number;
  msg: string;
}

/** Состояние типа input на уровне-боссе (unknown → проверенный объект). */
export interface BossState {
  base: "unknown" | "{}" | "object | null" | "object" | "hasId" | "any[]";
  id: "string" | "number" | "never" | null;
}

export type BossTransition = { st: BossState } | { error: TsError };

export interface Check {
  /** Текст условия, как он появится в коде. */
  c: string;
  /** Что условие вернёт для значения в рантайме. */
  run: (v: unknown) => boolean;
  /** Как условие сужает каждый член union (обычные уровни). */
  n?: Partial<Record<string, Narrow>>;
  /** Ошибка компиляции для текущего набора членов union. */
  error?: (current: ReadonlySet<string>) => TsError | null;
  /** Переход состояния на уровне-боссе. */
  tx?: (st: BossState) => BossTransition;
  /** Метка для достижений. */
  tag?: "falsy" | "typeofnull" | "any";
}

export interface Exit {
  code: string;
  need: string;
  must: boolean;
  kind?: "call" | "method";
  param?: string;
  method?: string;
  accepts?: string[] | "never";
}

export interface Ball {
  /** Подпись на шарике. */
  l: string;
  /** Реальное значение, которое проверяется условиями. */
  v: unknown;
  /** Член union (или цветовая группа на боссе). */
  m: string;
}

export interface Level {
  title: string;
  fn: string;
  param: string;
  paramType: string;
  /** branch: true уходит в выход; guard: false уходит в отбраковку. */
  mode: "branch" | "guard";
  slots: number;
  boss?: boolean;
  members: string[];
  task: string;
  debrief: string;
  theory: Theory;
  decls: string[];
  balls: Ball[];
  exits: Exit[];
  final: Exit;
  checks: Check[];
}

export interface ExitResult {
  type: string;
  error: TsError | null;
}

export interface Analysis {
  gates: ({ error: TsError } | { after: string } | undefined)[];
  exits: (ExitResult | undefined)[];
  final: ExitResult | null;
  blocked: boolean;
  anyPath: boolean;
}

export interface Simulation {
  ball: Ball;
  idx: number;
  gates: number[];
  dest: number | "final";
}
