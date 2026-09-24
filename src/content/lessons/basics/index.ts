import type { Lesson } from "../../types";
import { lesson as b1 } from "./01-static-checking";
import { lesson as b2 } from "./02-primitives-any";
import { lesson as b3 } from "./03-annotations-inference";
import { lesson as b5 } from "./04-unions";
import { lesson as b4 } from "./05-object-types";
import { lesson as b8 } from "./06-literals-as-const";
import { lesson as b6 } from "./07-type-vs-interface";
import { lesson as b9 } from "./08-null-strict";
import { lesson as b10 } from "./09-compatibility";
import { lesson as b7 } from "./10-assertions";
import { lesson as b11 } from "./11-satisfies";

/**
 * Порядок уроков — порядок прохождения: каждый урок опирается только на предыдущие.
 * id уроков не меняются при перестановке, по ним хранится прогресс.
 */
export const BASICS_LESSONS: Lesson[] = [b1, b2, b3, b5, b4, b8, b6, b9, b10, b7, b11];
