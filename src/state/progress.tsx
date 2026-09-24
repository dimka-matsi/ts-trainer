import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ACHIEVEMENTS, type AchievementId } from "../content/achievements";
import { EXAM_PASS } from "../content/exams";
import { LESSON_BY_ID, LESSONS } from "../content/lessons";
import { lessonDone } from "./path";
import { useToast } from "./toast";

export interface CardState {
  /** 0 — не знал, дальше растёт с каждым «знал». */
  box: number;
  /** Когда показать снова, мс. */
  due: number;
}

const DAY = 24 * 60 * 60 * 1000;
/** Через сколько дней повторить карточку на уровне box. */
const INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];

/** Карточка выучена, если на неё хоть раз ответили «знал» и с тех пор не ошиблись. */
export const cardKnown = (p: Progress, id: string) => (p.cards[id]?.box ?? 0) > 0;
/** Карточку пора повторить: она уже встречалась и срок подошёл. */
export const cardDue = (p: Progress, id: string, now = Date.now()) => {
  const c = p.cards[id];
  return c != null && c.due <= now;
};

export interface Progress {
  /** Лучшие звёзды по уровням сортировщика. */
  stars: Record<number, number>;
  ach: string[];
  /** Выполненные упражнения: lessonId → индекс задачи → true. */
  lessons: Record<string, Record<number, boolean>>;
  /** Лучший результат итогового экзамена по региону, в процентах. */
  exams: Record<number, number>;
  /** Интервальное повторение карточек: id → уровень и когда показать снова. Нет записи — карточка новая. */
  cards: Record<string, CardState>;
  /** Вводная на карте уже показана и закрыта. */
  seenIntro: boolean;
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
    cards: normalizeCards(p.cards),
    seenIntro: p.seenIntro === true,
    updatedAt: typeof p.updatedAt === "number" ? p.updatedAt : 0,
  };
}

/** Раньше карточки хранились списком выученных id: переносим их на первый уровень с повтором завтра. */
function normalizeCards(x: unknown): Record<string, CardState> {
  if (Array.isArray(x)) {
    const due = Date.now() + DAY;
    return Object.fromEntries(x.filter((v): v is string => typeof v === "string").map((id) => [id, { box: 1, due }]));
  }
  if (!isObj(x)) return {};
  const out: Record<string, CardState> = {};
  for (const [id, v] of Object.entries(x)) {
    if (isObj(v) && typeof v.box === "number" && typeof v.due === "number") out[id] = { box: v.box, due: v.due };
  }
  return out;
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
  /** Ответ на карточку: «знал» отодвигает следующий повтор, «не знал» возвращает её на сегодня. */
  reviewCard(id: string, known: boolean): void;
  /** Забыть историю карточек: они снова станут новыми. */
  resetCards(ids: string[]): void;
  markIntroSeen(): void;
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

  const reviewCard = useCallback((id: string, known: boolean) => {
    const prev = ref.current.cards[id]?.box ?? 0;
    const box = known ? Math.min(prev + 1, INTERVAL_DAYS.length - 1) : 0;
    const due = Date.now() + INTERVAL_DAYS[box]! * DAY;
    const next = { ...ref.current, cards: { ...ref.current.cards, [id]: { box, due } } };
    commit(next);
    if (Object.values(next.cards).filter((c) => c.box > 0).length >= 50) unlock("cards50");
  }, [unlock, commit]);

  const resetCards = useCallback((ids: string[]) => {
    const cards = { ...ref.current.cards };
    for (const id of ids) delete cards[id];
    commit({ ...ref.current, cards });
  }, [commit]);

  const markIntroSeen = useCallback(() => commit({ ...ref.current, seenIntro: true }), [commit]);

  const api = useMemo(
    () => ({ progress, setStars, markTask, unlock, setExam, reviewCard, resetCards, markIntroSeen }),
    [progress, setStars, markTask, unlock, setExam, reviewCard, resetCards, markIntroSeen],
  );
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const api = useContext(ProgressContext);
  if (!api) throw new Error("useProgress вне ProgressProvider");
  return api;
}
