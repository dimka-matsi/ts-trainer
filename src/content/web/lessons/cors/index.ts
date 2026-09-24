import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-same-origin";
import { lesson as l2 } from "./02-origin-vs-site";
import { lesson as l3 } from "./03-preflight";
import { lesson as l4 } from "./04-headers";
import { lesson as l5 } from "./05-credentials";
import { lesson as l6 } from "./06-not-a-shield";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6];
