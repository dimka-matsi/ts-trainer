import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-ttfb";
import { lesson as l2 } from "./02-server-cache";
import { lesson as l3 } from "./03-database";
import { lesson as l4 } from "./04-streaming";
import { lesson as l5 } from "./05-scaling";
import { lesson as l6 } from "./06-edge";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6];
