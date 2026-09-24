import type { WebLesson } from "../../types";
import { lesson as l1 } from "./01-polling";
import { lesson as l2 } from "./02-sse";
import { lesson as l3 } from "./03-websocket";
import { lesson as l4 } from "./04-webrtc";

export const lessons: WebLesson[] = [l1, l2, l3, l4];
