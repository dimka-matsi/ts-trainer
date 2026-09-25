import type { Lesson } from "../../types";
import { lesson as tc1 } from "./01-conditional";
import { lesson as tc2 } from "./02-distributive";
import { lesson as tc3 } from "./03-infer";
import { lesson as tc4 } from "./04-mapped";
import { lesson as tc5 } from "./05-template-literal";
import { lesson as tc6 } from "./06-recursive";
import { lesson as tc7 } from "./07-live-coding";

/** Уроки «Башни условий»: Type Manipulation из Handbook глубже, чем в «Мастерской утилит». */
export const CONDITIONAL_LESSONS: Lesson[] = [tc1, tc2, tc3, tc4, tc5, tc6, tc7];
