import type { Course, CourseId } from "./course/types";
import { PERF } from "./perf";
import { SEC } from "./sec";
import { WEB } from "./web";

/** Все курсы без кода по id. */
export const COURSES: Record<CourseId, Course> = { web: WEB, perf: PERF, sec: SEC };
