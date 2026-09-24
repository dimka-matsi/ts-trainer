import type { KeyboardEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

/** Textarea с номерами строк; Tab вставляет два пробела. */
export function CodeEditor({ value, onChange, label = "Редактор кода" }: Props) {
  const lines = value.split("\n").length;
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab" || e.shiftKey || e.altKey || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const ta = e.currentTarget;
    ta.setRangeText("  ", ta.selectionStart, ta.selectionEnd, "end");
    onChange(ta.value);
  };
  return (
    <div className="ed">
      <pre className="gut" aria-hidden="true">{Array.from({ length: lines }, (_, i) => i + 1).join("\n")}</pre>
      <textarea
        value={value}
        rows={lines + 1}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        wrap="off"
        aria-label={label}
      />
    </div>
  );
}
