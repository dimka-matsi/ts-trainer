import type { Course, CourseId } from "./course/types";
import { PERF } from "./perf";
import { WEB } from "./web";

/** Все курсы без кода по id: «Браузер» и «Оптимизация». */
export const COURSES: Record<CourseId, Course> = { web: WEB, perf: PERF };
