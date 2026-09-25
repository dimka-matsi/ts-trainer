import type { Lesson } from "../../types";
import { lesson as tr1 } from "./01-jsx";
import { lesson as tr2 } from "./02-props";
import { lesson as tr3 } from "./03-events";
import { lesson as tr4 } from "./04-state-reducer";
import { lesson as tr5 } from "./05-use-ref";
import { lesson as tr6 } from "./06-context";
import { lesson as tr7 } from "./07-exclusive-props";
import { lesson as tr8 } from "./08-generic-components";
import { lesson as tr9 } from "./09-component-props";
import { lesson as tr10 } from "./10-polymorphic";

/** Уроки «TS и React». Код проверяется настоящими типами @types/react 19. */
export const REACT_LESSONS: Lesson[] = [tr1, tr2, tr3, tr4, tr5, tr6, tr7, tr8, tr9, tr10];
