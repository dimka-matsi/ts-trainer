import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-pipeline";
import { lesson as l2 } from "./02-hidden-classes";
import { lesson as l3 } from "./03-inline-caching";
import { lesson as l4 } from "./04-inlining";
import { lesson as l5 } from "./05-gc";
import { lesson as l6 } from "./06-memory-leaks";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6];
