import { WEB_LESSONS } from "../content/web";
import type { WebLesson } from "../content/web/types";
import type { Progress } from "./progress";

/** Путь обучения «Браузера»: уроки открываются по порядку, как в TypeScript. */
export const webLessonDone = (p: Progress, l: WebLesson) => l.tasks.every((_, i) => p.lessons[l.id]?.[i]);

export function webLessonUnlocked(p: Progress, l: WebLesson): boolean {
  if (webLessonDone(p, l)) return true;
  const i = WEB_LESSONS.indexOf(l);
  return WEB_LESSONS.slice(0, i).every((x) => webLessonDone(p, x));
}

export const webCurrent = (p: Progress) => WEB_LESSONS.find((l) => !webLessonDone(p, l));

export const webRegionLessons = (region: number) => WEB_LESSONS.filter((l) => l.region === region);

export function webRegionDone(p: Progress, region: number): boolean {
  const ls = webRegionLessons(region);
  return ls.length > 0 && ls.every((l) => webLessonDone(p, l));
}

export const webLessonAfter = (l: WebLesson) => WEB_LESSONS[WEB_LESSONS.indexOf(l) + 1];
