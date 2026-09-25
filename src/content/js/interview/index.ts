import type { FollowUp } from "../../course/types";
import { ADVANCED } from "./advanced";
import { BASICS } from "./basics";

/** Уточняющие вопросы middle и senior к каждому уроку JavaScript. */
export const FOLLOW_UPS: Record<string, FollowUp[]> = { ...BASICS, ...ADVANCED };
