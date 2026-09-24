import { useSyncExternalStore } from "react";

export type Route =
  | { view: "map" }
  | { view: "level"; index: number }
  | { view: "lesson"; id: string }
  | { view: "exam"; region: number }
  | { view: "cards" };

function parse(hash: string): Route {
  const level = /^#\/level\/(\d+)$/.exec(hash);
  if (level) return { view: "level", index: Number(level[1]) - 1 };
  const lesson = /^#\/lesson\/([\w-]+)$/.exec(hash);
  if (lesson) return { view: "lesson", id: lesson[1]! };
  const exam = /^#\/exam\/(\d+)$/.exec(hash);
  if (exam) return { view: "exam", region: Number(exam[1]) - 1 };
  if (hash === "#/cards") return { view: "cards" };
  return { view: "map" };
}

export function routeHref(route: Route): string {
  if (route.view === "level") return `#/level/${route.index + 1}`;
  if (route.view === "lesson") return `#/lesson/${route.id}`;
  if (route.view === "exam") return `#/exam/${route.region + 1}`;
  if (route.view === "cards") return "#/cards";
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
let cachedRoute: Route = { view: "map" };
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
