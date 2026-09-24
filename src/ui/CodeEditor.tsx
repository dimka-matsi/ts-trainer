import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import type { Completion } from "../engine/engine";
import { useEngine } from "../state/engine";
import { CodeLine } from "./Code";

/** Фрагмент с ошибкой: строка и колонка с 1, длина в символах, текст ошибки для подсказки. */
export interface EditorMark {
  line: number;
  col: number;
  len: number;
  msg?: string;
  code?: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  marks?: EditorMark[];
}

/** Отступы внутри области кода, как в styles.css (.ed-hl, .ed textarea). */
const PAD = 14;

/** Строка слоя ошибок: текст прозрачный, ошибочные фрагменты подчёркнуты волной. */
function MarkLine({ line, marks }: { line: string; marks: EditorMark[] }) {
  const parts: { text: string; bad: boolean }[] = [];
  let pos = 0;
  for (const m of [...marks].sort((a, b) => a.col - b.col)) {
    const start = Math.max(pos, m.col - 1);
    const end = Math.min(line.length, m.col - 1 + m.len);
    if (start >= end) continue;
    if (start > pos) parts.push({ text: line.slice(pos, start), bad: false });
    parts.push({ text: line.slice(start, end), bad: true });
    pos = end;
  }
  parts.push({ text: line.slice(pos), bad: false });
  return <span className="ln">{parts.map((p, i) => (p.bad ? <span key={i} className="sq">{p.text}</span> : p.text))}</span>;
}

interface Tip { x: number; y: number; text: string; error: boolean }
interface Popup { x: number; y: number; items: Completion[]; sel: number; from: number; to: number }

/** Позиция в тексте по строке и колонке (с 0). */
const offsetOf = (lines: string[], line: number, col: number) =>
  lines.slice(0, line).reduce((n, l) => n + l.length + 1, 0) + col;

/**
 * Редактор: прозрачная textarea поверх подсвеченного кода и слоя с подчёркнутыми ошибками.
 * Наведение показывает текст ошибки или тип, ввод — автодополнение от компилятора. Tab вставляет два пробела.
 */
export function CodeEditor({ value, onChange, label = "Редактор кода", marks = [] }: Props) {
  const { engine } = useEngine();
  const layers = useRef<HTMLDivElement>(null);
  const area = useRef<HTMLTextAreaElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const [metrics, setMetrics] = useState({ ch: 7.8, lh: 21.45 });
  const [tip, setTip] = useState<Tip | null>(null);
  const [popup, setPopup] = useState<Popup | null>(null);
  const hoverTimer = useRef<number>(0);
  const lines = value.split("\n");
  const badLines = new Set(marks.map((m) => m.line));

  // Ширина символа и высота строки: нужны, чтобы переводить координаты мыши в позицию в тексте.
  useLayoutEffect(() => {
    const read = () => {
      const el = measure.current;
      if (!el) return;
      setMetrics({ ch: el.getBoundingClientRect().width / 10, lh: parseFloat(getComputedStyle(el).lineHeight) || 21.45 });
    };
    read();
    void document.fonts?.ready.then(read);
  }, []);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const scrollLeft = () => area.current?.scrollLeft ?? 0;
  const pointAt = (line: number, col: number) => ({ x: PAD + col * metrics.ch - scrollLeft(), y: PAD + (line + 1) * metrics.lh });

  const onMouseMove = (e: MouseEvent<HTMLTextAreaElement>) => {
    if (popup) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const line = Math.floor((e.clientY - rect.top - PAD) / metrics.lh);
    const col = Math.floor((e.clientX - rect.left - PAD + scrollLeft()) / metrics.ch);
    window.clearTimeout(hoverTimer.current);
    if (line < 0 || line >= lines.length || col < 0 || col >= (lines[line] ?? "").length) { setTip(null); return; }
    hoverTimer.current = window.setTimeout(() => {
      const mark = marks.find((m) => m.line === line + 1 && col >= m.col - 1 && col < m.col - 1 + m.len);
      const at = pointAt(line, col);
      if (mark?.msg) { setTip({ ...at, text: (mark.code ? `TS${mark.code}: ` : "") + mark.msg, error: true }); return; }
      if (!engine) return;
      engine.set(value);
      const info = engine.quickInfo(offsetOf(lines, line, col));
      setTip(info ? { ...at, text: info, error: false } : null);
    }, 350);
  };

  const suggest = (text: string, caret: number) => {
    if (!engine) return;
    const before = text.slice(0, caret);
    const prefix = /[\w$]*$/.exec(before)![0];
    const afterDot = before.slice(0, caret - prefix.length).endsWith(".");
    if (!prefix && !afterDot) { setPopup(null); return; }
    engine.set(text);
    const low = prefix.toLowerCase();
    const items = engine.completions(caret)
      .filter((c) => c.name.toLowerCase().startsWith(low) && c.name !== prefix)
      .slice(0, 8);
    if (!items.length) { setPopup(null); return; }
    const lineIdx = before.split("\n").length - 1;
    const col = before.length - before.lastIndexOf("\n") - 1 - prefix.length;
    setPopup({ ...pointAt(lineIdx, col), items, sel: 0, from: caret - prefix.length, to: caret });
  };

  const accept = (p: Popup, i: number) => {
    const ta = area.current;
    const item = p.items[i];
    if (!ta || !item) return;
    ta.setRangeText(item.name, p.from, p.to, "end");
    onChange(ta.value);
    setPopup(null);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (popup) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const d = e.key === "ArrowDown" ? 1 : -1;
        setPopup({ ...popup, sel: (popup.sel + d + popup.items.length) % popup.items.length });
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") { e.preventDefault(); accept(popup, popup.sel); return; }
      if (e.key === "Escape") { e.preventDefault(); setPopup(null); return; }
    }
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault();
      suggest(e.currentTarget.value, e.currentTarget.selectionStart);
      return;
    }
    if (e.key !== "Tab" || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const ta = e.currentTarget;
    ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
    onChange(ta.value);
  };

  const onInput = (next: string, caret: number) => {
    onChange(next);
    setTip(null);
    const typed = next.length === value.length + 1 ? next[caret - 1] : undefined;
    if (typed && /[\w$.]/.test(typed)) suggest(next, caret);
    else setPopup(null);
  };

  return (
    <div className="ed">
      <div className="ed-bar" aria-hidden="true">
        <i className="ed-dots" />
        <span>main.ts</span>
        {marks.length > 0 && <span className="ed-count">{marks.length} {plural(marks.length)}</span>}
      </div>
      <div className="ed-main">
        <pre className="gut" aria-hidden="true">
          {lines.map((_, i) => <span key={i} className={badLines.has(i + 1) ? "bad" : undefined}>{i + 1}{"\n"}</span>)}
        </pre>
        <div className="ed-area">
          <span className="ed-measure" ref={measure} aria-hidden="true">0000000000</span>
          <div className="ed-layers" ref={layers} aria-hidden="true">
            <pre className="ed-hl">{lines.map((l, i) => <CodeLine key={i} line={l} renderSlot={(n) => `§${n}§`} />)}</pre>
            <pre className="ed-marks">{lines.map((l, i) => <MarkLine key={i} line={l} marks={marks.filter((m) => m.line === i + 1)} />)}</pre>
          </div>
          <textarea
            ref={area}
            value={value}
            rows={lines.length + 1}
            onChange={(e) => onInput(e.target.value, e.target.selectionStart)}
            onKeyDown={onKeyDown}
            onMouseMove={onMouseMove}
            onMouseLeave={() => { window.clearTimeout(hoverTimer.current); setTip(null); }}
            onBlur={() => setPopup(null)}
            onClick={() => setPopup(null)}
            onScroll={(e) => {
              layers.current?.style.setProperty("--sx", `${-e.currentTarget.scrollLeft}px`);
              setTip(null);
              setPopup(null);
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            aria-label={label}
            aria-autocomplete="list"
          />
          {tip && (
            <div className={`ed-tip${tip.error ? " err" : ""}`} style={{ left: tip.x, top: tip.y }} role="tooltip">{tip.text}</div>
          )}
          {popup && (
            <ul className="ed-pop" style={{ left: popup.x, top: popup.y }} role="listbox" aria-label="Автодополнение">
              {popup.items.map((c, i) => (
                <li key={c.name} role="option" aria-selected={i === popup.sel} className={i === popup.sel ? "sel" : undefined}
                  onMouseDown={(e) => { e.preventDefault(); accept(popup, i); }}>
                  <span className={`ed-kind k-${c.kind}`}>{KIND[c.kind] ?? "·"}</span>{c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Короткие значки вида подсказки. */
const KIND: Record<string, string> = {
  property: "п", method: "м", function: "ф", var: "x", let: "x", const: "c", keyword: "к",
  class: "C", interface: "I", type: "T", parameter: "p", "local var": "x", "local function": "ф", enum: "E", module: "M",
};

function plural(n: number) {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return "ошибка";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "ошибки";
  return "ошибок";
}
