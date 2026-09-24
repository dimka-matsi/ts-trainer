import { useEffect, useMemo, useState } from "react";
import { FLASHCARDS, LEVEL_NAME, type CardLevel, type Flashcard } from "../content/flashcards";
import { REGIONS } from "../content/regions";
import { cardDue, cardKnown, useProgress, type Progress } from "../state/progress";
import { shuffle } from "../state/random";
import { navigate } from "../state/route";
import { CodeBlock, Md } from "../ui/Code";

type Mode = "deck" | "list";
const LEVELS: CardLevel[] = ["junior", "middle", "senior"];
const regionsWithCards = REGIONS.map((r, i) => ({ r, i })).filter(({ i }) => FLASHCARDS.some((c) => c.region === i));

/** Карточка в колоде на сегодня: новая или с подошедшим сроком повтора. */
const forToday = (p: Progress, c: Flashcard) => !p.cards[c.id] || cardDue(p, c.id);

/** Флеш-карточки с интервальным повторением: колода на сегодня и список всех вопросов. */
export function CardsView() {
  const { progress, reviewCard, resetCards } = useProgress();
  const [region, setRegion] = useState<number | null>(null);
  const [level, setLevel] = useState<CardLevel | null>(null);
  const [mode, setMode] = useState<Mode>("deck");
  const [extra, setExtra] = useState(false);

  const filtered = FLASHCARDS.filter((c) => (region == null || c.region === region) && (level == null || c.level === level));
  const known = filtered.filter((c) => cardKnown(progress, c.id)).length;
  const today = filtered.filter((c) => forToday(progress, c));
  const dueCount = filtered.filter((c) => cardDue(progress, c.id)).length;

  return (
    <section className="intro cards">
      <p className="eyebrow">// тренировка перед собеседованием</p>
      <h1>Флеш-карточки</h1>
      <p>Прочитай вопрос, ответь вслух и сверься с образцом. Если знал ответ, карточка вернётся через 1, 3, 7, 16 и 35 дней. Если не знал — ещё раз сегодня.</p>
      <div className="stats">
        <div><b>{filtered.length}</b><span>в подборке</span></div>
        <div><b>{known}</b><span>выучено</span></div>
        <div><b>{dueCount}</b><span>повторить сегодня</span></div>
      </div>

      <div className="filters">
        <div className="frow" role="group" aria-label="Регион">
          <button type="button" className="chip" aria-pressed={region == null} onClick={() => setRegion(null)}>Все темы</button>
          {regionsWithCards.map(({ r, i }) => (
            <button key={i} type="button" className="chip" aria-pressed={region === i} onClick={() => setRegion(i)}>{i + 1}. {r.name}</button>
          ))}
        </div>
        <div className="frow" role="group" aria-label="Уровень">
          <button type="button" className="chip" aria-pressed={level == null} onClick={() => setLevel(null)}>Любой уровень</button>
          {LEVELS.map((l) => (
            <button key={l} type="button" className="chip" aria-pressed={level === l} onClick={() => setLevel(l)}>{LEVEL_NAME[l]}</button>
          ))}
          <span className="fsep" />
          <button type="button" className="chip" aria-pressed={mode === "list"} onClick={() => setMode(mode === "deck" ? "list" : "deck")}>
            {mode === "deck" ? "Показать списком" : "Вернуться к колоде"}
          </button>
          <button type="button" className="chip" onClick={() => navigate({ view: "interview" })}>Пробное собеседование</button>
        </div>
      </div>

      {mode === "deck"
        ? <Deck key={`${region}-${level}-${extra}`} cards={extra ? filtered : today}
            onAnswer={reviewCard} onRepeatAll={() => setExtra(true)} emptyToday={!extra && today.length === 0 && filtered.length > 0} />
        : <CardList cards={filtered} progress={progress} onReset={(id) => resetCards([id])} />}
    </section>
  );
}

interface DeckProps {
  cards: Flashcard[];
  onAnswer(id: string, known: boolean): void;
  onRepeatAll(): void;
  emptyToday: boolean;
}

function Deck({ cards, onAnswer, onRepeatAll, emptyToday }: DeckProps) {
  // Колода замораживается при смене фильтра: «не знал» уходит в конец, «знал» — из колоды.
  const [queue, setQueue] = useState(() => shuffle(cards.map((c) => c.id)));
  const [open, setOpen] = useState(false);
  const [passed, setPassed] = useState(0);
  const byId = useMemo(() => new Map(FLASHCARDS.map((c) => [c.id, c])), []);
  const card = queue[0] ? byId.get(queue[0]) : undefined;

  const answer = (k: boolean) => {
    if (!card) return;
    onAnswer(card.id, k);
    setQueue(k ? queue.slice(1) : [...queue.slice(1), card.id]);
    setPassed(passed + 1);
    setOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select, dialog")) return;
      if (e.key === " " || e.key === "Enter") {
        if (e.target instanceof HTMLButtonElement) return;
        e.preventDefault();
        setOpen(true);
      } else if (open && (e.key === "1" || e.key === "ArrowLeft")) answer(false);
      else if (open && (e.key === "2" || e.key === "ArrowRight")) answer(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!card) {
    return (
      <div className="fc fc-empty">
        <p className="fc-q">{emptyToday || passed > 0 ? "На сегодня всё." : "В подборке нет карточек."}</p>
        {(emptyToday || passed > 0) && (
          <>
            <p className="muted">Выученные карточки вернутся, когда подойдёт срок повтора.</p>
            <div className="actions"><button type="button" className="btn ghost" onClick={onRepeatAll}>Повторить всю подборку сейчас</button></div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="fc-count">Карточка {passed + 1} · в колоде {queue.length}</p>
      <article className={`fc${open ? " open" : ""}`}>
        <CardMeta card={card} />
        <p className="fc-q"><Md text={card.q} /></p>
        {!open ? (
          <div className="actions">
            <button type="button" className="btn" onClick={() => setOpen(true)}>Показать ответ</button>
            <span className="note">Сначала ответь вслух. Пробел — показать ответ.</span>
          </div>
        ) : (
          <div className="fc-a">
            <p><Md text={card.a} /></p>
            {card.code && <CodeBlock code={card.code} />}
            <div className="actions">
              <button type="button" className="btn ghost" onClick={() => answer(false)}>Не знал · 1</button>
              <button type="button" className="btn" onClick={() => answer(true)}>Знал · 2</button>
            </div>
          </div>
        )}
      </article>
    </>
  );
}

function CardMeta({ card, status }: { card: Flashcard; status?: string }) {
  return (
    <p className="fc-meta">
      <span>{card.region + 1}. {REGIONS[card.region]!.name}</span>
      <span className={`lvl ${card.level}`}>{LEVEL_NAME[card.level]}</span>
      {status && <span>{status}</span>}
    </p>
  );
}

/** Статус карточки для списка: новая, повторить сейчас или через сколько дней. */
function statusOf(p: Progress, id: string): string {
  const c = p.cards[id];
  if (!c) return "новая";
  if (c.box === 0 || cardDue(p, id)) return "повторить сегодня";
  const days = Math.ceil((c.due - Date.now()) / (24 * 60 * 60 * 1000));
  return `✓ повтор через ${days} дн.`;
}

function CardList({ cards, progress, onReset }: { cards: Flashcard[]; progress: Progress; onReset(id: string): void }) {
  if (!cards.length) return <p className="muted">В подборке нет карточек.</p>;
  return (
    <div className="fc-list">
      {cards.map((c) => (
        <details key={c.id} className="theory fc-item">
          <summary><Md text={c.q} /></summary>
          <CardMeta card={c} status={statusOf(progress, c.id)} />
          <div className="tbody">
            <p><Md text={c.a} /></p>
            {c.code && <CodeBlock code={c.code} />}
            {progress.cards[c.id] && (
              <button type="button" className="btn ghost" onClick={() => onReset(c.id)}>Сбросить повторение</button>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
