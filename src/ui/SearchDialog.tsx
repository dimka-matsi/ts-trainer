import { useEffect, useMemo, useRef, useState } from "react";
import type { Flashcard } from "../content/flashcards";
import { useProgress, type Progress } from "../state/progress";
import { CodeBlock, Md } from "./Code";

/** Что искать: уроки, темы «скоро» и карточки направления. */
export interface SearchSource {
  lessons: { id: string; title: string; q: string; answer: string; region: number }[];
  regionNames: string[];
  /** Темы регионов, где уроков ещё нет. */
  topics: { t: string; q: string; ri: number }[];
  cards: Flashcard[];
  unlocked(p: Progress, id: string): boolean;
  go(id: string): void;
  placeholder: string;
}

const norm = (s: string) => s.toLowerCase().replace(/`/g, "").replace(/ё/g, "е");
const LIMIT = 8;

/** Поиск по урокам, темам и карточкам. Открывается кнопкой в шапке и клавишей «/». */
export function SearchDialog({ open, onClose, source }: { open: boolean; onClose(): void; source: SearchSource }) {
  const { progress } = useProgress();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); setQuery(""); window.setTimeout(() => input.current?.focus(), 0); }
    if (!open && d.open) d.close();
  }, [open]);

  const q = norm(query.trim());
  const results = useMemo(() => {
    if (q.length < 2) return null;
    const hit = (...texts: string[]) => texts.some((t) => norm(t).includes(q));
    const lessons = source.lessons.filter((l) => hit(l.title, l.q, l.answer)).slice(0, LIMIT);
    const topics = source.topics.filter((t) => hit(t.t, t.q)).slice(0, LIMIT);
    const cards = source.cards.filter((c) => hit(c.q, c.a)).slice(0, LIMIT);
    return { lessons, topics, cards };
  }, [q, source]);

  const go = (id: string) => { onClose(); source.go(id); };
  const empty = results && !results.lessons.length && !results.topics.length && !results.cards.length;

  return (
    <dialog ref={ref} className="search" aria-label="Поиск" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dlg-in">
        <button type="button" className="x" aria-label="Закрыть" onClick={onClose}>×</button>
        <input ref={input} className="search-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder={source.placeholder} aria-label="Что найти" />
        {!results && <p className="muted">Введите хотя бы две буквы. Ищу по урокам, темам и карточкам с вопросами.</p>}
        {empty && <p className="muted">Ничего не нашлось.</p>}
        {results && results.lessons.length > 0 && (
          <div className="search-group">
            <h3>Уроки</h3>
            <ul>
              {results.lessons.map((l) => {
                const open = source.unlocked(progress, l.id);
                return (
                  <li key={l.id}>
                    <button type="button" className="search-hit" onClick={() => go(l.id)}>
                      <b>{!open && <i className="lock" aria-label="закрыто" />}{l.title}</b>
                      <span>{source.regionNames[l.region]} · <Md text={l.q} /></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        {results && results.topics.length > 0 && (
          <div className="search-group">
            <h3>Темы в разработке</h3>
            <ul>
              {results.topics.map((t) => (
                <li key={`${t.ri}-${t.t}`} className="search-static"><b>{t.t}</b><span>{source.regionNames[t.ri]} · <Md text={t.q} /></span></li>
              ))}
            </ul>
          </div>
        )}
        {results && results.cards.length > 0 && (
          <div className="search-group">
            <h3>Карточки</h3>
            {results.cards.map((c) => (
              <details key={c.id} className="theory fc-item">
                <summary><Md text={c.q} /></summary>
                <div className="tbody"><p><Md text={c.a} /></p>{c.code && <CodeBlock code={c.code} />}</div>
              </details>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}
