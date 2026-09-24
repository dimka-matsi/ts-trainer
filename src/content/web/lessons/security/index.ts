import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-xss-kinds";
import { lesson as l2 } from "./02-xss-defense";
import { lesson as l3 } from "./03-csrf";
import { lesson as l4 } from "./04-csp";
import { lesson as l5 } from "./05-clickjacking-redirect";
import { lesson as l6 } from "./06-sri-supply-chain";
import { lesson as l7 } from "./07-headers";
import { lesson as l8 } from "./08-isolation";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6, l7, l8];
