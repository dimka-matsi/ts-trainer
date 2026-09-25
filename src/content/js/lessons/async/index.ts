import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-event-loop";
import { lesson as l2 } from "./02-promises";
import { lesson as l3 } from "./03-microtasks";
import { lesson as l4 } from "./04-async-await";
import { lesson as l5 } from "./05-combinators";
import { lesson as l6 } from "./06-order-puzzles";
import { lesson as l7 } from "./07-async-iterators";
import { lesson as l8 } from "./08-callbacks";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6, l7, l8];
