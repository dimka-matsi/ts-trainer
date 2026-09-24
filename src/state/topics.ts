import { LESSON_BY_ID } from "../content/lessons";
import { REGIONS, regionTopics, type RegionKind, type Topic } from "../content/regions";
import { lessonDone, lessonUnlocked, levelUnlocked } from "./path";
import type { Progress } from "./progress";

export type TopicState = "done" | "open" | "ahead" | "soon";
export const ICON: Record<TopicState, string> = { done: "✓", open: "●", ahead: "○", soon: "○" };

export interface PlacedTopic extends Topic { ri: number; ti: number; kind: RegionKind }

export const allTopics = (): PlacedTopic[] =>
  REGIONS.flatMap((r, ri) => regionTopics(ri).map((t, ti) => ({ ...t, ri, ti, kind: r.kind })));

export function topicState(p: Progress, t: PlacedTopic): TopicState {
  if (t.kind === "soon") return "soon";
  if (t.lesson) {
    const l = LESSON_BY_ID[t.lesson];
    if (!l) return "soon";
    return lessonDone(p, l) ? "done" : lessonUnlocked(p, l) ? "open" : "ahead";
  }
  if (t.lv == null) return "soon";
  if ((p.stars[t.lv] ?? 0) > 0) return "done";
  return levelUnlocked(p, t.lv) ? "open" : "ahead";
}
