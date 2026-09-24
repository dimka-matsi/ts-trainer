import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ACHIEVEMENTS, type AchievementId } from "../content/achievements";
import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import type { Lesson } from "../content/types";
import { useToast } from "./toast";

export interface Progress {
  /** Лучшие звёзды по уровням сортировщика. */
  stars: Record<number, number>;
  ach: string[];
  /** Выполненные упражнения: lessonId → индекс задачи → true. */
  lessons: Record<string, Record<number, boolean>>;
}

const KEY = "ts-trainer-v1";

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    const p: Partial<Progress> = raw ? JSON.parse(raw) : {};
    return { stars: p.stars ?? {}, ach: Array.isArray(p.ach) ? p.ach : [], lessons: p.lessons ?? {} };
  } catch {
    return { stars: {}, ach: [], lessons: {} };
  }
}

export const levelUnlocked = (p: Progress, i: number) => i === 0 || (p.stars[i - 1] ?? 0) > 0;
export const lessonDone = (p: Progress, lesson: Lesson) => lesson.tasks.every((_, i) => p.lessons[lesson.id]?.[i]);

interface ProgressApi {
  progress: Progress;
  setStars(level: number, stars: number): void;
  markTask(lessonId: string, task: number): void;
  unlock(id: AchievementId): void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load);
  const ref = useRef(progress);
  ref.current = progress;
  const toast = useToast();

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* приватный режим */ }
  }, [progress]);

  const unlock = useCallback((id: AchievementId) => {
    if (ref.current.ach.includes(id)) return;
    const next = { ...ref.current, ach: [...ref.current.ach, id] };
    ref.current = next;
    setProgress(next);
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a) toast(`Достижение: ${a.t}`);
  }, [toast]);

  const setStars = useCallback((level: number, stars: number) => {
    const best = Math.max(stars, ref.current.stars[level] ?? 0);
    const next = { ...ref.current, stars: { ...ref.current.stars, [level]: best } };
    ref.current = next;
    setProgress(next);
  }, []);

  const markTask = useCallback((lessonId: string, task: number) => {
    if (ref.current.lessons[lessonId]?.[task]) return;
    const next: Progress = {
      ...ref.current,
      lessons: { ...ref.current.lessons, [lessonId]: { ...ref.current.lessons[lessonId], [task]: true } },
    };
    ref.current = next;
    setProgress(next);
    const lesson = LESSON_BY_ID[lessonId];
    if (lesson && lessonDone(next, lesson)) {
      toast(`Урок пройден: ${lesson.title}`);
      const regionDone = LESSONS.filter((l) => l.region === lesson.region).every((l) => lessonDone(next, l));
      if (regionDone) unlock(lesson.region === 0 ? "basics" : "utils");
    }
  }, [toast, unlock]);

  const api = useMemo(() => ({ progress, setStars, markTask, unlock }), [progress, setStars, markTask, unlock]);
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const api = useContext(ProgressContext);
  if (!api) throw new Error("useProgress вне ProgressProvider");
  return api;
}
