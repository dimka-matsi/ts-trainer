import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-how-cdn-works";
import { lesson as l2 } from "./02-edge-cache";
import { lesson as l3 } from "./03-proxies";
import { lesson as l4 } from "./04-load-balancing";

export const lessons: WebLesson[] = [l1, l2, l3, l4];
