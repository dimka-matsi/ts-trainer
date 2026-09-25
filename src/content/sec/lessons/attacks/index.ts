import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-xss-kinds";
import { lesson as l2 } from "./02-xss-defense";
import { lesson as l3 } from "./03-csrf";
import { lesson as l4 } from "./04-clickjacking-redirect";
import { lesson as l5 } from "./05-ssrf-injection";
import { lesson as l6 } from "./06-prototype-pollution";
import { lesson as l7 } from "./07-postmessage-sandbox";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6, l7];
