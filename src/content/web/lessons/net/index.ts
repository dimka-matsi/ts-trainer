import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-ip-ports";
import { lesson as l2 } from "./02-layers";
import { lesson as l3 } from "./03-tcp";
import { lesson as l4 } from "./04-udp";
import { lesson as l5 } from "./05-url-journey";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
