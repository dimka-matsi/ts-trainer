import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { REGIONS, regionTopics, type RegionKind, type Topic } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { lessonDone, levelUnlocked, type Progress } from "./progress";

export type TopicState = "done" | "open" | "ahead" | "soon";
export const ICON: Record<TopicState, string> = { done: "✓", open: "●", ahead: "○", soon: "○" };

export interface PlacedTopic extends Topic { ri: number; ti: number; kind: RegionKind }

export const allTopics = (): PlacedTopic[] =>
  REGIONS.flatMap((r, ri) => regionTopics(ri).map((t, ti) => ({ ...t, ri, ti, kind: r.kind })));

export function topicState(p: Progress, t: PlacedTopic): TopicState {
  if (t.kind === "soon") return "soon";
  if (t.lesson) { const l = LESSON_BY_ID[t.lesson]; return l && lessonDone(p, l) ? "done" : "open"; }
  if (t.lv == null) return "soon";
  if ((p.stars[t.lv] ?? 0) > 0) return "done";
  return levelUnlocked(p, t.lv) ? "open" : "ahead";
}

export function nextLevel(p: Progress): number {
  return LEVELS.findIndex((_, i) => levelUnlocked(p, i) && !(p.stars[i] ?? 0));
}

export function nextLesson(p: Progress, region: number) {
  const ls = LESSONS.filter((l) => l.region === region);
  const idx = ls.findIndex((l) => !lessonDone(p, l));
  return { lesson: ls[idx >= 0 ? idx : 0]!, index: idx, total: ls.length };
}
