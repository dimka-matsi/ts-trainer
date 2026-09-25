import { LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import type { Lesson } from "../content/types";
import type { Progress } from "./progress";
import type { Route } from "./route";

/** Шаг обучения: урок или уровень сортировщика. */
export type Step =
  | { kind: "lesson"; lesson: Lesson; region: number; title: string }
  | { kind: "level"; index: number; region: number; title: string };

/**
 * Путь обучения — рекомендуемый порядок шагов: регионы по порядку карты, внутри региона-сортировщика сначала
 * уровни, потом уроки. Проходить темы можно в любом порядке, путь только подсказывает следующую. Регионы «скоро»
 * пропускаются: пройти их пока нельзя.
 */
export const PATH: Step[] = REGIONS.flatMap((r, region): Step[] => {
  if (r.kind === "soon") return [];
  const levels: Step[] = r.kind === "sorter"
    ? LEVELS.map((l, index) => ({ kind: "level", index, region, title: `Уровень ${index + 1}. ${l.title}` }))
    : [];
  const lessons: Step[] = LESSONS.filter((l) => l.region === region).map((lesson) => ({ kind: "lesson", lesson, region, title: lesson.title }));
  return [...levels, ...lessons];
});

export const lessonDone = (p: Progress, lesson: Lesson) => lesson.tasks.every((_, i) => p.lessons[lesson.id]?.[i]);
export const stepDone = (p: Progress, s: Step) => (s.kind === "lesson" ? lessonDone(p, s.lesson) : (p.stars[s.index] ?? 0) > 0);

/** Первый непройденный шаг — рекомендуемая следующая тема. */
export const currentStep = (p: Progress): Step | undefined => PATH.find((s) => !stepDone(p, s));

/** Шаг открыт всегда: темы можно проходить в любом порядке. Прогресс нужен только для подсказок и экзаменов. */
export function stepUnlocked(_p: Progress, s: Step): boolean {
  return PATH.includes(s);
}

/** Какой шаг нужно пройти, чтобы открыть этот: первый непройденный перед ним. */
export function blockerOf(p: Progress, s: Step): Step | undefined {
  const i = PATH.indexOf(s);
  return PATH.slice(0, i).find((x) => !stepDone(p, x));
}

export const lessonStep = (id: string) => PATH.find((s): s is Extract<Step, { kind: "lesson" }> => s.kind === "lesson" && s.lesson.id === id);
export const levelStep = (index: number) => PATH.find((s): s is Extract<Step, { kind: "level" }> => s.kind === "level" && s.index === index);

export function lessonUnlocked(p: Progress, lesson: Lesson): boolean {
  const s = lessonStep(lesson.id);
  return s ? stepUnlocked(p, s) : false;
}

export function levelUnlocked(p: Progress, index: number): boolean {
  const s = levelStep(index);
  return s ? stepUnlocked(p, s) : false;
}

const regionSteps = (region: number) => PATH.filter((s) => s.region === region);

/** Все темы региона пройдены: открывается экзамен и следующий регион. */
export const regionDone = (p: Progress, region: number) => {
  const steps = regionSteps(region);
  return steps.length > 0 && steps.every((s) => stepDone(p, s));
};

/** Регион открыт, если в нём есть темы. */
export const regionUnlocked = (p: Progress, region: number) => {
  const first = regionSteps(region)[0];
  return first ? stepUnlocked(p, first) : false;
};

/** Шаг после данного — для кнопки «Дальше». */
export const stepAfter = (s: Step): Step | undefined => PATH[PATH.indexOf(s) + 1];

export const stepRoute = (s: Step): Route => (s.kind === "lesson" ? { view: "lesson", id: s.lesson.id } : { view: "level", index: s.index });
