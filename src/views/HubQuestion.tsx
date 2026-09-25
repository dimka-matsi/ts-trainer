import { useEffect, useMemo, useState } from "react";
import { COURSES } from "../content/courses";
import type { CourseId } from "../content/course/types";
import { FLASHCARDS, type Flashcard } from "../content/flashcards";
import { navigate, type Route } from "../state/route";
import { Md } from "../ui/Code";

type TrackId = "ts" | CourseId;

const TRACK_NAME: Record<TrackId, string> = { ts: "TypeScript", web: "Браузер", sec: "Безопасность", perf: "Оптимизация", react: "React" };
const LEVEL_NAME = { junior: "junior", middle: "middle", senior: "senior" } as const;

interface Item { card: Flashcard; track: TrackId }
/** Кусок вопроса: обычный текст или `код`. Печатаем посимвольно, но код сразу рисуем как код. */
interface Seg { text: string; code: boolean }

const segments = (q: string): Seg[] => q.split(/`([^`]+)`/).map((text, i) => ({ text, code: i % 2 === 1 })).filter((s) => s.text);

function shuffle<T>(xs: T[]): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Верх хаба: настоящий вопрос с собеседования из любого направления печатается, держится и стирается. */
export function HubQuestion() {
  const items = useMemo<Item[]>(() => shuffle([
    ...FLASHCARDS.map((card) => ({ card, track: "ts" as const })),
    ...(Object.keys(COURSES) as CourseId[]).flatMap((id) => COURSES[id].flashcards.map((card) => ({ card, track: id }))),
  ]), []);
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<"type" | "hold" | "erase">("type");
  const [answer, setAnswer] = useState(false);
  const [hover, setHover] = useState(false);
  const still = useMemo(reducedMotion, []);

  const item = items[idx % items.length]!;
  const segs = useMemo(() => segments(item.card.q), [item]);
  const total = segs.reduce((n, s) => n + s.text.length, 0);
  const paused = answer || hover;

  useEffect(() => {
    if (still && phase === "type") { setShown(total); setPhase("hold"); return; }
    let t: number;
    if (phase === "type") {
      t = window.setTimeout(() => {
        if (shown >= total) setPhase("hold");
        else setShown(Math.min(total, shown + (total > 70 ? 2 : 1)));
      }, 32);
    } else if (phase === "hold") {
      if (paused) return;
      t = window.setTimeout(() => (still ? next() : setPhase("erase")), still ? 9000 : 5200);
    } else {
      if (paused) { setPhase("type"); setShown(total); return; }
      t = window.setTimeout(() => {
        if (shown <= 0) next();
        else setShown(Math.max(0, shown - 3));
      }, 12);
    }
    return () => window.clearTimeout(t);
  });

  function next() {
    setIdx((i) => i + 1);
    setShown(0);
    setPhase("type");
    setAnswer(false);
  }

  // Видимая часть вопроса: первые `shown` символов по всем кускам.
  let left = shown;
  const visible = segs.map((s, i) => {
    const part = s.text.slice(0, Math.max(0, left));
    left -= s.text.length;
    if (!part) return null;
    return s.code ? <code key={i}>{part}</code> : <span key={i}>{part}</span>;
  });

  const cardsRoute: Route = item.track === "ts" ? { view: "cards" } : { view: "course-cards", course: item.track };

  return (
    <section className={`hq hq-${item.track}`} aria-label="Вопрос с собеседования"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHover(false); }}>
      <div className="hq-in">
        <p className="hq-meta">
          <span className="hq-rec" aria-hidden="true" />
          <span>Вопрос с собеседования</span>
          <span className="hq-chip">{TRACK_NAME[item.track]}</span>
          <span className="hq-level">{LEVEL_NAME[item.card.level]}</span>
        </p>
        <p className="sr-only">{item.card.q.replace(/`/g, "")}</p>
        <p className="hq-q" aria-hidden="true">
          {visible}<i className="hq-caret" data-typing={phase !== "hold" || undefined} />
        </p>
        {answer && (
          <div className="hq-answer">
            <p><Md text={item.card.a} /></p>
            <button type="button" className="hq-link" onClick={() => navigate(cardsRoute)}>
              Все карточки: {TRACK_NAME[item.track]} →
            </button>
          </div>
        )}
        <div className="hq-actions">
          {!answer && (
            <button type="button" className="hq-btn primary" onClick={() => { setShown(total); setPhase("hold"); setAnswer(true); }}>
              Показать ответ
            </button>
          )}
          <button type="button" className="hq-btn" onClick={next}>Другой вопрос</button>
        </div>
      </div>
    </section>
  );
}
