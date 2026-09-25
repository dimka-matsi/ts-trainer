import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-bundler";
import { lesson as l2 } from "./02-tree-shaking";
import { lesson as l3 } from "./03-chunks";
import { lesson as l4 } from "./04-vite-vs-webpack";
import { lesson as l5 } from "./05-targets";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
