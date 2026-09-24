import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-critical-path";
import { lesson as l2 } from "./02-blocking";
import { lesson as l3 } from "./03-layout-paint-composite";
import { lesson as l4 } from "./04-fonts";
import { lesson as l5 } from "./05-csr-ssr";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
