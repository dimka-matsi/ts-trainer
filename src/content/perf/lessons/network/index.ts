import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-compression";
import { lesson as l2 } from "./02-resource-hints";
import { lesson as l3 } from "./03-images";
import { lesson as l4 } from "./04-lazy-loading";
import { lesson as l5 } from "./05-bundle";
import { lesson as l6 } from "./06-third-party";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6];
