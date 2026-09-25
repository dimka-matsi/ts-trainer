import type { FollowUp } from "../../course/types";
import { CORE } from "./core";
import { STATE } from "./state";

/** Уточняющие вопросы middle и senior к каждому уроку React. */
export const FOLLOW_UPS: Record<string, FollowUp[]> = { ...CORE, ...STATE };
