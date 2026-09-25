import type { Lesson } from "../types";
import { BASICS_LESSONS } from "./basics";
import { CLASSES_LESSONS } from "./classes";
import { CONDITIONAL_LESSONS } from "./conditional";
import { CONTRACTS_LESSONS } from "./contracts";
import { FUNCTIONS_LESSONS } from "./functions";
import { GENERICS_LESSONS } from "./generics";
import { NARROWING_LESSONS } from "./narrowing";
import { OBJECTS_LESSONS } from "./objects";
import { PROJECT_LESSONS } from "./project";
import { REACT_LESSONS } from "./react";
import { UTILITIES_LESSONS } from "./utilities";

export const LESSONS: Lesson[] = [...BASICS_LESSONS, ...NARROWING_LESSONS, ...FUNCTIONS_LESSONS, ...OBJECTS_LESSONS, ...GENERICS_LESSONS, ...UTILITIES_LESSONS, ...CONDITIONAL_LESSONS, ...CLASSES_LESSONS, ...CONTRACTS_LESSONS, ...REACT_LESSONS, ...PROJECT_LESSONS];
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(LESSONS.map((l) => [l.id, l]));
