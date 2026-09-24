import type { Lesson } from "../../types";
import { lesson as g1 } from "./01-keyof-indexed";
import { lesson as g2 } from "./02-key-param";
import { lesson as g3 } from "./03-typeof-type";
import { lesson as g4 } from "./04-defaults";
import { lesson as g5 } from "./05-generic-classes";
import { lesson as g6 } from "./06-const-type-params";
import { lesson as g7 } from "./07-class-types-variance";

/** Уроки «Кузницы дженериков». Основы (`<T>`, вывод, `extends`) — в уроке «Дженерик-функции» региона «Функции». */
export const GENERICS_LESSONS: Lesson[] = [g1, g2, g3, g4, g5, g6, g7];
