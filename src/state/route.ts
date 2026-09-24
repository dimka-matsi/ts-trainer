import { useSyncExternalStore } from "react";

export type Route =
  | { view: "map" }
  | { view: "level"; index: number }
  | { view: "lesson"; id: string };

function parse(hash: string): Route {
  const level = /^#\/level\/(\d+)$/.exec(hash);
  if (level) return { view: "level", index: Number(level[1]) - 1 };
  const lesson = /^#\/lesson\/([\w-]+)$/.exec(hash);
  if (lesson) return { view: "lesson", id: lesson[1]! };
  return { view: "map" };
}

export function routeHref(route: Route): string {
  if (route.view === "level") return `#/level/${route.index + 1}`;
  if (route.view === "lesson") return `#/lesson/${route.id}`;
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
