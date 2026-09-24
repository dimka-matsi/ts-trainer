import type { Lesson } from "../../types";
import { lesson as u1 } from "./01-partial-required-readonly";
import { lesson as u2 } from "./02-record";
import { lesson as u4 } from "./03-exclude-extract";
import { lesson as u3 } from "./04-pick-omit";
import { lesson as u5 } from "./05-return-parameters";
import { lesson as u6 } from "./06-awaited-noinfer";
import { lesson as u7 } from "./07-this-utilities";
import { lesson as u8 } from "./08-string-utilities";

/** `Exclude` идёт раньше `Pick` и `Omit`: `Omit` устроен через `Exclude`. id не меняются, по ним хранится прогресс. */
export const UTILITIES_LESSONS: Lesson[] = [u1, u2, u4, u3, u5, u6, u7, u8];
