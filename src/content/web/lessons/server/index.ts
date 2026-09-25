import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-ttfb";
import { lesson as l2 } from "./02-server-cache";
import { lesson as l3 } from "./03-database";
import { lesson as l4 } from "./04-streaming";
import { lesson as l5 } from "./05-scaling";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
