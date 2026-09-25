import { useSyncExternalStore } from "react";
import type { CourseId } from "../content/course/types";

/** Направления продукта: у каждого своя карта и свой стиль. */
export type Track = "ts" | CourseId;

const COURSE_IDS: CourseId[] = ["web", "perf", "sec", "react"];

export type Route =
  | { view: "hub" }
  | { view: "map" }
  | { view: "level"; index: number }
  | { view: "lesson"; id: string }
  | { view: "exam"; region: number }
  | { view: "cards" }
  | { view: "interview" }
  | { view: "progress" }
  | { view: "course"; course: CourseId }
  | { view: "course-lesson"; course: CourseId; id: string }
  | { view: "course-exam"; course: CourseId; region: number }
  | { view: "course-cards"; course: CourseId }
  | { view: "course-progress"; course: CourseId }
  | { view: "course-interview"; course: CourseId };

function parse(hash: string): Route {
  if (hash === "" || hash === "#" || hash === "#/") return { view: "hub" };
  if (hash === "#/ts") return { view: "map" };
  const c = /^#\/(\w+)(?:\/(lesson|exam|cards|progress|interview)(?:\/([\w-]+))?)?$/.exec(hash);
  const course = COURSE_IDS.find((id) => id === c?.[1]);
  if (c && course) {
    if (!c[2]) return { view: "course", course };
    if (c[2] === "cards") return { view: "course-cards", course };
    if (c[2] === "progress") return { view: "course-progress", course };
    if (c[2] === "interview") return { view: "course-interview", course };
    if (c[2] === "lesson" && c[3]) return { view: "course-lesson", course, id: c[3] };
    if (c[2] === "exam" && /^\d+$/.test(c[3] ?? "")) return { view: "course-exam", course, region: Number(c[3]) - 1 };
  }
  const level = /^#\/level\/(\d+)$/.exec(hash);
  if (level) return { view: "level", index: Number(level[1]) - 1 };
  const lesson = /^#\/lesson\/([\w-]+)$/.exec(hash);
  if (lesson) return { view: "lesson", id: lesson[1]! };
  const exam = /^#\/exam\/(\d+)$/.exec(hash);
  if (exam) return { view: "exam", region: Number(exam[1]) - 1 };
  if (hash === "#/cards") return { view: "cards" };
  if (hash === "#/interview") return { view: "interview" };
  if (hash === "#/progress") return { view: "progress" };
  return { view: "hub" };
}

/** К какому направлению относится экран: от этого зависит стиль (data-track на <html>). */
export const trackOf = (route: Route): Track | "hub" =>
  route.view === "hub" ? "hub" : "course" in route ? route.course : "ts";

export function routeHref(route: Route): string {
  if (route.view === "level") return `#/level/${route.index + 1}`;
  if (route.view === "lesson") return `#/lesson/${route.id}`;
  if (route.view === "exam") return `#/exam/${route.region + 1}`;
  if (route.view === "cards") return "#/cards";
  if (route.view === "interview") return "#/interview";
  if (route.view === "progress") return "#/progress";
  if (route.view === "map") return "#/ts";
  if (route.view === "course") return `#/${route.course}`;
  if (route.view === "course-lesson") return `#/${route.course}/lesson/${route.id}`;
  if (route.view === "course-exam") return `#/${route.course}/exam/${route.region + 1}`;
  if (route.view === "course-cards") return `#/${route.course}/cards`;
  if (route.view === "course-progress") return `#/${route.course}/progress`;
  if (route.view === "course-interview") return `#/${route.course}/interview`;
  return "#/";
}

export function navigate(route: Route) {
  window.location.hash = routeHref(route);
  window.scrollTo({ top: 0 });
}

const subscribe = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

let cachedHash: string | null = null;
let cachedRoute: Route = { view: "hub" };
const snapshot = () => {
  if (window.location.hash !== cachedHash) {
    cachedHash = window.location.hash;
    cachedRoute = parse(cachedHash);
  }
  return cachedRoute;
};

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, snapshot);
}
