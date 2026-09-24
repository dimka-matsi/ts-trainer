import type { Lesson } from "../../types";
import { lesson as n1 } from "./01-equality";
import { lesson as n2 } from "./02-type-predicates";
import { lesson as n3 } from "./03-assertion-functions";
import { lesson as n4 } from "./04-request-state";

/** Уроки «Болота союзов»: темы сужения, которые не ложатся на сортировщик. */
export const NARROWING_LESSONS: Lesson[] = [n1, n2, n3, n4];
