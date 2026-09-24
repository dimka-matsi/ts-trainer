import { useMemo, useState, type ReactNode } from "react";
import type { MatchTask, OrderTask, SortTask } from "../../content/web/types";
import { Md } from "../../ui/Code";

/** Перемешивание, одинаковое при каждом открытии: зависит от текста вопроса. Никогда не совпадает с ответом. */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  if (out.every((x, i) => x === items[i])) out.push(out.shift()!);
  return out;
}

function Verdict({ ok, why, bad }: { ok: boolean | null; why: string; bad: ReactNode }) {
  if (ok === null) return null;
  return ok
    ? <p className="ok-t"><b>Верно.</b> <Md text={why} /></p>
    : <p className="bad-t"><b>Пока не так.</b> {bad}</p>;
}

/** «Расставь по порядку»: кликаешь пункты в нужной последовательности, клик по выбранному убирает его. */
export function OrderTaskCard({ task, onSolved }: { task: OrderTask; onSolved(): void }) {
  const pool = useMemo(() => shuffled(task.items, task.q), [task]);
  const [picked, setPicked] = useState<string[]>([]);
  const [ok, setOk] = useState<boolean | null>(null);
  const firstWrong = picked.findIndex((s, i) => s !== task.items[i]);

  const check = () => {
    const right = firstWrong < 0 && picked.length === task.items.length;
    setOk(right);
    if (right) onSolved();
  };

  return (
    <>
      <p className="tq"><Md text={task.q} /></p>
      <ol className="ord-picked" aria-label="Твой порядок">
        {picked.map((s, i) => (
          <li key={s}>
            <button type="button" className={`ord-item${ok === false && i === firstWrong ? " wrong" : ""}${ok ? " right" : ""}`} disabled={!!ok}
              onClick={() => { setPicked(picked.filter((x) => x !== s)); setOk(null); }}>
              <span className="ord-n">{i + 1}</span><Md text={s} />
            </button>
          </li>
        ))}
        {picked.length < task.items.length && <li className="ord-slot">Выбери шаг {picked.length + 1}</li>}
      </ol>
      <div className="ord-pool" aria-label="Шаги">
        {pool.filter((s) => !picked.includes(s)).map((s) => (
          <button key={s} type="button" className="ord-item" onClick={() => { setPicked([...picked, s]); setOk(null); }}><Md text={s} /></button>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="btn" disabled={picked.length !== task.items.length || !!ok} onClick={check}>Проверить</button>
        <button type="button" className="btn ghost" disabled={!picked.length || !!ok} onClick={() => { setPicked([]); setOk(null); }}>Сбросить</button>
      </div>
      <div className="tfb" aria-live="polite">
        <Verdict ok={ok} why={task.why} bad={<>Первая ошибка — на шаге {firstWrong + 1}. Нажми на шаг, чтобы убрать его, и переставь.</>} />
      </div>
    </>
  );
}

/** «Сопоставь пары»: для каждого термина слева выбираешь смысл справа. */
export function MatchTaskCard({ task, onSolved }: { task: MatchTask; onSolved(): void }) {
  const rights = useMemo(() => shuffled(task.pairs.map(([, r]) => r), task.q), [task]);
  const [chosen, setChosen] = useState<(string | null)[]>(() => task.pairs.map(() => null));
  const [checked, setChecked] = useState(false);
  const wrong = task.pairs.filter(([, r], i) => chosen[i] !== r).length;
  const ok = checked ? wrong === 0 : null;

  const check = () => {
    setChecked(true);
    if (wrong === 0) onSolved();
  };

  return (
    <>
      <p className="tq"><Md text={task.q} /></p>
      <div className="match" role="table">
        {task.pairs.map(([left, right], i) => (
          <div key={left} className={`match-row${checked ? (chosen[i] === right ? " right" : " wrong") : ""}`} role="row">
            <span className="match-left" role="cell"><Md text={left} /></span>
            <span className="match-arrow" aria-hidden="true">→</span>
            <span className="match-opts" role="cell">
              {rights.map((r) => (
                <button key={r} type="button" className="chip" aria-pressed={chosen[i] === r} disabled={!!ok}
                  onClick={() => { setChosen(chosen.map((c, j) => (j === i ? r : c === r ? null : c))); setChecked(false); }}>
                  <Md text={r} />
                </button>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="btn" disabled={chosen.some((c) => c === null) || !!ok} onClick={check}>Проверить</button>
      </div>
      <div className="tfb" aria-live="polite">
        <Verdict ok={ok} why={task.why} bad={<>Неверных пар: {wrong}. Они отмечены красным.</>} />
      </div>
    </>
  );
}

/** «Разложи по группам»: у каждого пункта выбираешь группу. */
export function SortTaskCard({ task, onSolved }: { task: SortTask; onSolved(): void }) {
  const items = useMemo(() => shuffled(task.items, task.q), [task]);
  const [chosen, setChosen] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState(false);
  const wrong = items.filter(([s, g]) => chosen[s] !== g).length;
  const ok = checked ? wrong === 0 : null;

  const check = () => {
    setChecked(true);
    if (wrong === 0) onSolved();
  };

  return (
    <>
      <p className="tq"><Md text={task.q} /></p>
      <div className="match">
        {items.map(([s, g]) => (
          <div key={s} className={`match-row two${checked ? (chosen[s] === g ? " right" : " wrong") : ""}`}>
            <span className="match-left"><Md text={s} /></span>
            <span className="match-opts">
              {task.groups.map((name, gi) => (
                <button key={name} type="button" className="chip" aria-pressed={chosen[s] === gi} disabled={!!ok}
                  onClick={() => { setChosen({ ...chosen, [s]: gi }); setChecked(false); }}>
                  {name}
                </button>
              ))}
            </span>
          </div>
        ))}
      </div>
      <div className="actions">
        <button type="button" className="btn" disabled={Object.keys(chosen).length !== items.length || !!ok} onClick={check}>Проверить</button>
      </div>
      <div className="tfb" aria-live="polite">
        <Verdict ok={ok} why={task.why} bad={<>Не на месте: {wrong}. Они отмечены красным.</>} />
      </div>
    </>
  );
}
