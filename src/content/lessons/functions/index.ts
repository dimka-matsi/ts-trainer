import type { Lesson } from "../../types";
import { lesson as f1 } from "./01-signatures";
import { lesson as f2 } from "./02-optional-default";
import { lesson as fg } from "./03-generic-functions";
import { lesson as f3 } from "./04-overloads";
import { lesson as f4 } from "./05-this";
import { lesson as f5 } from "./06-void-never";
import { lesson as fo } from "./06b-object-function";
import { lesson as fd } from "./06c-destructuring";
import { lesson as f6 } from "./07-async";
import { lesson as f7 } from "./08-rest-tuples";
import { lesson as f8 } from "./09-variance";

/** Порядок — порядок прохождения. Дженерик-функции стоят до уроков, где встречается `<T>`. */
export const FUNCTIONS_LESSONS: Lesson[] = [f1, f2, fg, f3, f4, f5, fo, fd, f6, f7, f8];
