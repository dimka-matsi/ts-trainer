import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ACHIEVEMENTS, type AchievementId } from "../content/achievements";
import { EXAM_PASS } from "../content/exams";
import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { lessonDone } from "./path";
import { useToast } from "./toast";

export interface Progress {
  /** Лучшие звёзды по уровням сортировщика. */
  stars: Record<number, number>;
  ach: string[];
  /** Выполненные упражнения: lessonId → индекс задачи → true. */
  lessons: Record<string, Record<number, boolean>>;
  /** Лучший результат итогового экзамена по региону, в процентах. */
  exams: Record<number, number>;
  /** id выученных флеш-карточек. */
  cards: string[];
  /** Время последнего изменения: при синхронизации с файлом побеждает более новая копия. */
  updatedAt: number;
}

const KEY = "ts-trainer-v1";

/** Достижение за все уроки региона. */
const REGION_ACHIEVEMENT: Partial<Record<number, AchievementId>> = { 0: "basics", 1: "narrow", 2: "funcs", 4: "generics", 5: "utils" };

/** Файл прогресса в проекте (.local/progress.json), его отдаёт dev-сервер: см. scripts/progress-file.ts. */
const FILE_URL = "/__progress";

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

/** Приводит сохранённые данные (localStorage или файл) к Progress, отбрасывая мусор. */
function normalize(raw: unknown): Progress {
  const p = isObj(raw) ? raw : {};
  const strings = (x: unknown) => (Array.isArray(x) ? x.filter((v): v is string => typeof v === "string") : []);
  return {
    stars: isObj(p.stars) ? (p.stars as Progress["stars"]) : {},
    ach: strings(p.ach),
    lessons: isObj(p.lessons) ? (p.lessons as Progress["lessons"]) : {},
    exams: isObj(p.exams) ? (p.exams as Progress["exams"]) : {},
    cards: strings(p.cards),
    updatedAt: typeof p.updatedAt === "number" ? p.updatedAt : 0,
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return normalize(raw ? JSON.parse(raw) : null);
  } catch {
    return normalize(null);
  }
}

function saveToFile(p: Progress, keepalive = false) {
  return fetch(FILE_URL, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p), keepalive })
    .catch(() => { /* сервер остановлен: копия останется в localStorage */ });
}

// Доступ к шагам решает путь обучения, здесь реэкспорт для старых импортов.
export { lessonDone, levelUnlocked } from "./path";

interface ProgressApi {
  progress: Progress;
  setStars(level: number, stars: number): void;
  markTask(lessonId: string, task: number): void;
  unlock(id: AchievementId): void;
  setExam(region: number, percent: number): void;
  /** Отметить карточки выученными или вернуть в повторение. */
  setCards(ids: string[], known: boolean): void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(load);
  const ref = useRef(progress);
  ref.current = progress;
  const toast = useToast();
  /** true, когда dev-сервер умеет хранить файл; до ответа файл не трогаем, чтобы не затереть его пустым прогрессом. */
  const [fileReady, setFileReady] = useState(false);

  const commit = useCallback((next: Progress) => {
    const stamped = { ...next, updatedAt: Date.now() };
    ref.current = stamped;
    setProgress(stamped);
  }, []);

  // При старте берём прогресс из файла, если он новее браузерной копии.
  useEffect(() => {
    let cancelled = false;
    fetch(FILE_URL, { cache: "no-store" })
      .then(async (r) => {
        if (cancelled || (r.status !== 200 && r.status !== 204)) return;
        if (r.status === 200) {
          const fromFile = normalize(await r.json());
          if (cancelled) return;
          if (fromFile.updatedAt > ref.current.updatedAt) {
            ref.current = fromFile;
            setProgress(fromFile);
          }
        }
        setFileReady(true);
      })
      .catch(() => { /* статическая сборка без сервера: остаёмся на localStorage */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* приватный режим */ }
    if (!fileReady) return;
    const t = setTimeout(() => void saveToFile(progress), 300);
    return () => clearTimeout(t);
  }, [progress, fileReady]);

  // Закрыли вкладку раньше, чем сработал таймер: дописываем с keepalive.
  useEffect(() => {
    if (!fileReady) return;
    const flush = () => void saveToFile(ref.current, true);
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [fileReady]);

  const unlock = useCallback((id: AchievementId) => {
    if (ref.current.ach.includes(id)) return;
    const next = { ...ref.current, ach: [...ref.current.ach, id] };
    commit(next);
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (a) toast(`Достижение: ${a.t}`);
  }, [toast, commit]);

  const setStars = useCallback((level: number, stars: number) => {
    const best = Math.max(stars, ref.current.stars[level] ?? 0);
    const next = { ...ref.current, stars: { ...ref.current.stars, [level]: best } };
    commit(next);
  }, [commit]);

  const markTask = useCallback((lessonId: string, task: number) => {
    if (ref.current.lessons[lessonId]?.[task]) return;
    const next: Progress = {
      ...ref.current,
      lessons: { ...ref.current.lessons, [lessonId]: { ...ref.current.lessons[lessonId], [task]: true } },
    };
    commit(next);
    const lesson = LESSON_BY_ID[lessonId];
    if (lesson && lessonDone(next, lesson)) {
      toast(`Урок пройден: ${lesson.title}`);
      const regionDone = LESSONS.filter((l) => l.region === lesson.region).every((l) => lessonDone(next, l));
      const ach = REGION_ACHIEVEMENT[lesson.region];
      if (regionDone && ach) unlock(ach);
    }
  }, [toast, unlock, commit]);

  const setExam = useCallback((region: number, percent: number) => {
    const best = Math.max(percent, ref.current.exams[region] ?? 0);
    const next = { ...ref.current, exams: { ...ref.current.exams, [region]: best } };
    commit(next);
    if (percent >= EXAM_PASS) unlock("exam");
  }, [unlock, commit]);

  const setCards = useCallback((ids: string[], known: boolean) => {
    const set = new Set(ref.current.cards);
    for (const id of ids) {
      if (known) set.add(id);
      else set.delete(id);
    }
    const next = { ...ref.current, cards: [...set] };
    commit(next);
    if (set.size >= 50) unlock("cards50");
  }, [unlock, commit]);

  const api = useMemo(
    () => ({ progress, setStars, markTask, unlock, setExam, setCards }),
    [progress, setStars, markTask, unlock, setExam, setCards],
  );
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const api = useContext(ProgressContext);
  if (!api) throw new Error("useProgress вне ProgressProvider");
  return api;
}
