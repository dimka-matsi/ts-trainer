import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

/** Ключ дублируется в скрипте в index.html: он ставит тему до первой отрисовки, чтобы не мигало. */
const KEY = "ts-trainer-theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

function saved(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Текущая тема: выбор пользователя, иначе системная. */
function current(): Theme {
  return saved() ?? (media().matches ? "dark" : "light");
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  const m = media();
  m.addEventListener("change", cb);
  return () => { listeners.delete(cb); m.removeEventListener("change", cb); };
}

/** Выбор запоминается; data-theme на <html> включает нужный набор токенов из styles.css. */
export function setTheme(theme: Theme) {
  try { localStorage.setItem(KEY, theme); } catch { /* приватный режим: тема живёт до перезагрузки */ }
  document.documentElement.dataset.theme = theme;
  emit();
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, current);
}
