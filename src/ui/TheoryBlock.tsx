import type { Theory } from "../content/types";
import { CodeBlock, Md } from "./Code";

export function TheoryBlock({ theory, open }: { theory: Theory; open: boolean }) {
  return (
    <details className="theory" open={open}>
      <summary>Теория</summary>
      <div className="tbody">
        {theory.p.map((p, i) => <p key={i}><Md text={p} /></p>)}
        <CodeBlock code={theory.example} />
        <div className="keys">
          <b>Главное</b>
          <ul>{theory.keys.map((k, i) => <li key={i}><Md text={k} /></li>)}</ul>
        </div>
      </div>
    </details>
  );
}
