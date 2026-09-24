import { useEffect, useMemo, useState } from "react";
import { FLASHCARDS, LEVEL_NAME, type CardLevel, type Flashcard } from "../content/flashcards";
import { REGIONS } from "../content/regions";
import { useProgress } from "../state/progress";
import { shuffle } from "../state/random";
import { CodeBlock, Md } from "../ui/Code";

type Mode = "deck" | "list";
const LEVELS: CardLevel[] = ["junior", "middle", "senior"];
const regionsWithCards = REGIONS.map((r, i) => ({ r, i })).filter(({ i }) => FLASHCARDS.some((c) => c.region === i));

/** Флеш-карточки: все вопросы с собеседований с ответами, режим колоды и режим списка. */
export function CardsView() {
  const { progress, setCards } = useProgress();
  const [region, setRegion] = useState<number | null>(null);
  const [level, setLevel] = useState<CardLevel | null>(null);
  const [hideKnown, setHideKnown] = useState(true);
  const [mode, setMode] = useState<Mode>("deck");
  const known = useMemo(() => new Set(progress.cards), [progress.cards]);

  const filtered = FLASHCARDS.filter((c) => (region == null || c.region === region) && (level == null || c.level === level));
  const knownInFilter = filtered.filter((c) => known.has(c.id)).length;

  return (
    <section className="intro cards">
      <p className="eyebrow">// тренировка перед собеседованием</p>
      <h1>Флеш-карточки</h1>
      <p>Вопрос — ответ вслух — сверка с образцом. Честно отмечай, знал ли ответ: выученные карточки уходят из колоды, остальные возвращаются.</p>
      <div className="stats">
        <div><b>{FLASHCARDS.length}</b><span>вопросов</span></div>
        <div><b>{progress.cards.length}</b><span>выучено</span></div>
        <div><b>{filtered.length - knownInFilter}</b><span>осталось в подборке</span></div>
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
          <button type="button" className="chip" aria-pressed={hideKnown} onClick={() => setHideKnown(!hideKnown)}>Скрыть выученные</button>
          <button type="button" className="chip" aria-pressed={mode === "list"} onClick={() => setMode(mode === "deck" ? "list" : "deck")}>
            {mode === "deck" ? "Показать списком" : "Вернуться к колоде"}
          </button>
        </div>
      </div>

      {mode === "deck"
        ? <Deck key={`${region}-${level}-${hideKnown}`} cards={hideKnown ? filtered.filter((c) => !known.has(c.id)) : filtered}
            known={known} onMark={(id, k) => setCards([id], k)}
            onResetFilter={() => setCards(filtered.map((c) => c.id), false)} emptyBecauseKnown={hideKnown && filtered.length > 0} />
        : <CardList cards={hideKnown ? filtered.filter((c) => !known.has(c.id)) : filtered} known={known} onMark={(id, k) => setCards([id], k)} />}
    </section>
  );
}

interface DeckProps {
  cards: Flashcard[];
  known: Set<string>;
  onMark(id: string, known: boolean): void;
  onResetFilter(): void;
  emptyBecauseKnown: boolean;
}

function Deck({ cards, known, onMark, onResetFilter, emptyBecauseKnown }: DeckProps) {
  // Колода замораживается при смене фильтра: карточка «не знаю» уходит в конец, «знаю» — из колоды.
  const [queue, setQueue] = useState(() => shuffle(cards.map((c) => c.id)));
  const [open, setOpen] = useState(false);
  const [passed, setPassed] = useState(0);
  const byId = useMemo(() => new Map(FLASHCARDS.map((c) => [c.id, c])), []);
  const card = queue[0] ? byId.get(queue[0]) : undefined;

  const answer = (k: boolean) => {
    if (!card) return;
    onMark(card.id, k);
    setQueue(k ? queue.slice(1) : [...queue.slice(1), card.id]);
    setPassed(passed + 1);
    setOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, select")) return;
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
        <p className="fc-q">{emptyBecauseKnown ? "Все карточки в этой подборке выучены." : "В подборке нет карточек."}</p>
        {emptyBecauseKnown && (
          <div className="actions">
            <button type="button" className="btn ghost" onClick={onResetFilter}>Вернуть подборку в повторение</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <p className="fc-count">Карточка {passed + 1} · в колоде {queue.length}</p>
      <article className={`fc${open ? " open" : ""}`}>
        <CardMeta card={card} known={known.has(card.id)} />
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

function CardMeta({ card, known }: { card: Flashcard; known: boolean }) {
  return (
    <p className="fc-meta">
      <span>{card.region + 1}. {REGIONS[card.region]!.name}</span>
      <span className={`lvl ${card.level}`}>{LEVEL_NAME[card.level]}</span>
      {known && <span className="okline">✓ выучено</span>}
    </p>
  );
}

function CardList({ cards, known, onMark }: { cards: Flashcard[]; known: Set<string>; onMark(id: string, known: boolean): void }) {
  if (!cards.length) return <p className="muted">В подборке нет карточек.</p>;
  return (
    <div className="fc-list">
      {cards.map((c) => (
        <details key={c.id} className="theory fc-item">
          <summary><Md text={c.q} /></summary>
          <CardMeta card={c} known={known.has(c.id)} />
          <div className="tbody">
            <p><Md text={c.a} /></p>
            {c.code && <CodeBlock code={c.code} />}
            <button type="button" className="btn ghost" onClick={() => onMark(c.id, !known.has(c.id))}>
              {known.has(c.id) ? "Вернуть в повторение" : "Отметить выученной"}
            </button>
          </div>
        </details>
      ))}
    </div>
  );
}
