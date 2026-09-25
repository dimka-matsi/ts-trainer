import type { Lesson } from "../../types";
import { lesson as pj1 } from "./01-compile";
import { lesson as pj2 } from "./02-type-stripping";
import { lesson as pj3 } from "./03-target-lib";
import { lesson as pj4 } from "./04-modules-interop";
import { lesson as pj5 } from "./05-library";
import { lesson as pj6 } from "./06-jsdoc";
import { lesson as pj7 } from "./07-paths-references";
import { lesson as pj8 } from "./08-tsconfig";

/** Уроки региона «Компилятор и проект»: tsconfig, сборка, запуск в Node, библиотеки и миграция. */
export const PROJECT_LESSONS: Lesson[] = [pj1, pj2, pj3, pj4, pj5, pj6, pj7, pj8];
