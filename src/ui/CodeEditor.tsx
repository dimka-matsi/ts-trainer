import { useRef, type KeyboardEvent } from "react";
import { CodeLine } from "./Code";

/** Фрагмент с ошибкой: строка и колонка с 1, длина в символах. */
export interface EditorMark {
  line: number;
  col: number;
  len: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  marks?: EditorMark[];
}

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

/**
 * Редактор: прозрачная textarea поверх подсвеченного кода и слоя с подчёркнутыми ошибками.
 * Tab вставляет два пробела.
 */
export function CodeEditor({ value, onChange, label = "Редактор кода", marks = [] }: Props) {
  const layers = useRef<HTMLDivElement>(null);
  const lines = value.split("\n");
  const badLines = new Set(marks.map((m) => m.line));

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const ta = e.currentTarget;
    ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
    onChange(ta.value);
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
          <div className="ed-layers" ref={layers} aria-hidden="true">
            <pre className="ed-hl">{lines.map((l, i) => <CodeLine key={i} line={l.replace(/§/g, "§​")} />)}</pre>
            <pre className="ed-marks">{lines.map((l, i) => <MarkLine key={i} line={l} marks={marks.filter((m) => m.line === i + 1)} />)}</pre>
          </div>
          <textarea
            value={value}
            rows={lines.length + 1}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onScroll={(e) => { if (layers.current) layers.current.style.transform = `translateX(${-e.currentTarget.scrollLeft}px)`; }}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            aria-label={label}
          />
        </div>
      </div>
    </div>
  );
}

function plural(n: number) {
  const d = n % 10, dd = n % 100;
  if (d === 1 && dd !== 11) return "ошибка";
  if (d >= 2 && d <= 4 && (dd < 12 || dd > 14)) return "ошибки";
  return "ошибок";
}
