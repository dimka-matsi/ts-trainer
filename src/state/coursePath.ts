import type { Course, WebLesson } from "../content/course/types";
import type { Flashcard } from "../content/flashcards";
import type { Progress } from "./progress";

/** Путь обучения курсов на общем движке: рекомендуемый порядок уроков. Открыты все уроки, порядок только подсказывает следующий. */
export const courseLessonDone = (p: Progress, l: WebLesson) => l.tasks.every((_, i) => p.lessons[l.id]?.[i]);

/** Урок открыт всегда: разделы можно проходить в любом порядке. */
export function courseLessonUnlocked(c: Course, _p: Progress, l: WebLesson): boolean {
  return c.byId[l.id] === l;
}

export const courseCurrent = (c: Course, p: Progress) => c.lessons.find((l) => !courseLessonDone(p, l));

export const courseRegionLessons = (c: Course, region: number) => c.lessons.filter((l) => l.region === region);

export function courseRegionDone(c: Course, p: Progress, region: number): boolean {
  const ls = courseRegionLessons(c, region);
  return ls.length > 0 && ls.every((l) => courseLessonDone(p, l));
}

export const courseLessonAfter = (c: Course, l: WebLesson) => c.lessons[c.lessons.indexOf(l) + 1];

/** Вопросы для пробного собеседования: карточки пройденных уроков и карточки пройденных регионов. */
export function courseInterviewPool(c: Course, p: Progress): Flashcard[] {
  return c.flashcards.filter((card) => {
    const lessonId = /-lesson-(.+)$/.exec(card.id)?.[1];
    const lesson = lessonId ? c.byId[lessonId] : undefined;
    return lesson ? courseLessonDone(p, lesson) : courseRegionDone(c, p, card.region);
  });
}
