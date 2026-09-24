import type { Lesson } from "../types";
import { BASICS_LESSONS } from "./basics";
import { UTILITIES_LESSONS } from "./utilities";

export const LESSONS: Lesson[] = [...BASICS_LESSONS, ...UTILITIES_LESSONS];
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
