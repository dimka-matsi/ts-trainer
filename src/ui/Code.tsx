import { Fragment, type ReactNode } from "react";
import { tokenize } from "./highlight";

/** Строка кода с подсветкой. renderSlot рисует места для условий (§N§). */
export function CodeLine({ line, renderSlot }: { line: string; renderSlot?: (i: number) => ReactNode }) {
  return (
    <span className="ln">
      {tokenize(line).map((tok, i) =>
        tok.kind === "slot" ? (
          <Fragment key={i}>{renderSlot?.(Number(tok.text))}</Fragment>
        ) : tok.kind ? (
          <span key={i} className={tok.kind}>{tok.text}</span>
        ) : (
          <Fragment key={i}>{tok.text}</Fragment>
        ),
      )}
    </span>
  );
}

export function CodeBlock({ code, className = "code ex" }: { code: string; className?: string }) {
  return (
    <pre className={className}>
      {code.split("\n").map((line, i) => <CodeLine key={i} line={line} />)}
    </pre>
  );
}

/** Текст с `кодом` в обратных кавычках. */
export function Md({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return <>{parts.map((p, i) => (i % 2 ? <code key={i}>{p}</code> : <Fragment key={i}>{p}</Fragment>))}</>;
}
