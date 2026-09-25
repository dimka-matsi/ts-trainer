import type { Lesson } from "../../types";
import { lesson as ct1 } from "./01-network-data";
import { lesson as ct2 } from "./02-schemas";
import { lesson as ct3 } from "./03-catch";
import { lesson as ct4 } from "./04-strict";
import { lesson as ct5 } from "./05-extra-flags";
import { lesson as ct6 } from "./06-branded";
import { lesson as ct7 } from "./07-result";

/** Уроки «Контрактов»: где заканчиваются типы и начинается проверка во время работы программы. */
export const CONTRACTS_LESSONS: Lesson[] = [ct1, ct2, ct3, ct4, ct5, ct6, ct7];
