import type { Lesson } from "../types";
import { BASICS_LESSONS } from "./basics";
import { FUNCTIONS_LESSONS } from "./functions";
import { NARROWING_LESSONS } from "./narrowing";
import { UTILITIES_LESSONS } from "./utilities";

export const LESSONS: Lesson[] = [...BASICS_LESSONS, ...NARROWING_LESSONS, ...FUNCTIONS_LESSONS, ...UTILITIES_LESSONS];
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
