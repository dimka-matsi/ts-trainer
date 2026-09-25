import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-basics";
import { lesson as l2 } from "./02-httponly-secure";
import { lesson as l3 } from "./03-samesite";
import { lesson as l4 } from "./04-third-party";
import { lesson as l5 } from "./05-session-vs-token";
import { lesson as l6 } from "./06-refresh";
import { lesson as l7 } from "./07-oauth";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6, l7];
