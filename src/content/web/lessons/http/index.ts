import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-messages";
import { lesson as l2 } from "./02-methods";
import { lesson as l3 } from "./03-status";
import { lesson as l4 } from "./04-headers";
import { lesson as l5 } from "./05-connections";
import { lesson as l6 } from "./06-api-styles";
import { lesson as l7 } from "./07-versions";
import { lesson as cookies } from "./08-cookies";
import { lesson as l9 } from "./09-uploads-ranges";

export const lessons: WebLesson[] = [l1, l2, l3, l4, cookies, l5, l6, l7, l9];
