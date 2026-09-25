import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-main-thread";
import { lesson as l2 } from "./02-workers";
import { lesson as l3 } from "./03-debounce-throttle";
import { lesson as l4 } from "./04-dom-size";
import { lesson as l5 } from "./05-virtual-scroll";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
