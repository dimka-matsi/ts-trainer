import { useEffect, useMemo, useRef, useState } from "react";
import { FLASHCARDS } from "../content/flashcards";
import { LESSONS } from "../content/lessons";
import { REGIONS } from "../content/regions";
import { lessonUnlocked } from "../state/path";
import { useProgress } from "../state/progress";
import { navigate } from "../state/route";
import { CodeBlock, Md } from "./Code";

const norm = (s: string) => s.toLowerCase().replace(/`/g, "").replace(/ё/g, "е");
const LIMIT = 8;

/** Поиск по урокам, темам и карточкам. Открывается кнопкой в шапке и клавишей «/». */
export function SearchDialog({ open, onClose }: { open: boolean; onClose(): void }) {
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
    const lessons = LESSONS.filter((l) => hit(l.title, l.q, l.answer)).slice(0, LIMIT);
    const topics = REGIONS.flatMap((r, ri) => (r.kind === "soon" ? (r.topics ?? []).map((t) => ({ ...t, ri })) : []))
      .filter((t) => hit(t.t, t.q)).slice(0, LIMIT);
    const cards = FLASHCARDS.filter((c) => hit(c.q, c.a)).slice(0, LIMIT);
    return { lessons, topics, cards };
  }, [q]);

  const go = (id: string) => { onClose(); navigate({ view: "lesson", id }); };
  const empty = results && !results.lessons.length && !results.topics.length && !results.cards.length;

  return (
    <dialog ref={ref} className="search" aria-label="Поиск" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="dlg-in">
        <button type="button" className="x" aria-label="Закрыть" onClick={onClose}>×</button>
        <input ref={input} className="search-input" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Например: satisfies, keyof, never" aria-label="Что найти" />
        {!results && <p className="muted">Введите хотя бы две буквы. Ищу по урокам, темам и карточкам с вопросами.</p>}
        {empty && <p className="muted">Ничего не нашлось.</p>}
        {results && results.lessons.length > 0 && (
          <div className="search-group">
            <h3>Уроки</h3>
            <ul>
              {results.lessons.map((l) => {
                const open = lessonUnlocked(progress, l);
                return (
                  <li key={l.id}>
                    <button type="button" className="search-hit" onClick={() => go(l.id)}>
                      <b>{!open && <i className="lock" aria-label="закрыто" />}{l.title}</b>
                      <span>{REGIONS[l.region]!.name} · <Md text={l.q} /></span>
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
                <li key={`${t.ri}-${t.t}`} className="search-static"><b>{t.t}</b><span>{REGIONS[t.ri]!.name} · <Md text={t.q} /></span></li>
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
