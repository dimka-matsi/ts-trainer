import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-why-https";
import { lesson as l2 } from "./02-crypto";
import { lesson as l3 } from "./03-certificates";
import { lesson as l4 } from "./04-handshake";
import { lesson as l5 } from "./05-hsts";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5];
