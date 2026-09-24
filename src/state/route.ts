import { useSyncExternalStore } from "react";

/** Направления продукта: у каждого своя карта и свой стиль. */
export type Track = "ts" | "web";

export type Route =
  | { view: "hub" }
  | { view: "map" }
  | { view: "level"; index: number }
  | { view: "lesson"; id: string }
  | { view: "exam"; region: number }
  | { view: "cards" }
  | { view: "interview" }
  | { view: "progress" }
  | { view: "web" }
  | { view: "web-lesson"; id: string }
  | { view: "web-exam"; region: number }
  | { view: "web-cards" };

function parse(hash: string): Route {
  if (hash === "" || hash === "#" || hash === "#/") return { view: "hub" };
  if (hash === "#/ts") return { view: "map" };
  if (hash === "#/web") return { view: "web" };
  if (hash === "#/web/cards") return { view: "web-cards" };
  const webLesson = /^#\/web\/lesson\/([\w-]+)$/.exec(hash);
  if (webLesson) return { view: "web-lesson", id: webLesson[1]! };
  const webExam = /^#\/web\/exam\/(\d+)$/.exec(hash);
  if (webExam) return { view: "web-exam", region: Number(webExam[1]) - 1 };
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
  route.view === "hub" ? "hub" : route.view.startsWith("web") ? "web" : "ts";

export function routeHref(route: Route): string {
  if (route.view === "level") return `#/level/${route.index + 1}`;
  if (route.view === "lesson") return `#/lesson/${route.id}`;
  if (route.view === "exam") return `#/exam/${route.region + 1}`;
  if (route.view === "cards") return "#/cards";
  if (route.view === "interview") return "#/interview";
  if (route.view === "progress") return "#/progress";
  if (route.view === "map") return "#/ts";
  if (route.view === "web") return "#/web";
  if (route.view === "web-lesson") return `#/web/lesson/${route.id}`;
  if (route.view === "web-exam") return `#/web/exam/${route.region + 1}`;
  if (route.view === "web-cards") return "#/web/cards";
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
