import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-httponly-secure";
import { lesson as l2 } from "./02-samesite";
import { lesson as l3 } from "./03-third-party";

export const lessons: WebLesson[] = [l1, l2, l3];
