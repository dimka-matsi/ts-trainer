import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-esm-cjs";
import { lesson as l2 } from "./02-strict";
import { lesson as l3 } from "./03-errors";
import { lesson as l4 } from "./04-modern";
import { lesson as l5 } from "./05-dates";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
