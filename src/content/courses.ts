import type { Course, CourseId } from "./course/types";
import { JS } from "./js";
import { PERF } from "./perf";
import { REACT } from "./react";
import { SEC } from "./sec";
import { WEB } from "./web";

/** Все курсы, кроме TypeScript, по id. */
export const COURSES: Record<CourseId, Course> = { web: WEB, perf: PERF, sec: SEC, react: REACT, js: JS };
