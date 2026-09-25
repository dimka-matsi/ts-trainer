import type { WebLesson } from "../../../course/types";
import { lesson as l1 } from "./01-session-vs-token";
import { lesson as l2 } from "./02-refresh";
import { lesson as l3 } from "./03-oauth";
import { lesson as l4 } from "./04-passwords";
import { lesson as l5 } from "./05-passkeys-mfa";
import { lesson as l6 } from "./06-access-control";

export const lessons: WebLesson[] = [l1, l2, l3, l4, l5, l6];
