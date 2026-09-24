import { useState } from "react";
import type { Flow, HttpMessage, NetRequest } from "../../content/web/types";

/** Фазы запроса в порядке DevTools; индекс задаёт цвет в водопаде. */
const PHASES = ["Очередь", "DNS", "TCP", "TLS", "Ожидание ответа", "Загрузка"];
const phaseClass = (name: string) => `ph-${Math.max(0, PHASES.indexOf(name))}`;
const total = (r: NetRequest) => r.timing.reduce((s, [, ms]) => s + ms, 0);

/** Схема обмена: участники — вертикальные линии, шаги — стрелки. Шаги открываются по одному. */
export function FlowDiagram({ flow }: { flow: Flow }) {
  const [shown, setShown] = useState(1);
  const n = flow.actors.length;
  const center = (i: number) => ((i + 0.5) / n) * 100;
  const all = shown >= flow.steps.length;

  return (
    <div className="flow">
      <div className="flow-actors" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {flow.actors.map((a) => {
          const [name, sub] = a.split("\n");
          return <div key={a} className="flow-actor"><b>{name}</b>{sub && <small>{sub}</small>}</div>;
        })}
      </div>
      <ol className="flow-steps">
        {flow.actors.map((a, i) => <i key={a} className="flow-lane" style={{ left: `${center(i)}%` }} aria-hidden="true" />)}
        {flow.steps.slice(0, shown).map((s, i) => {
          const self = s.from === s.to;
          const left = self ? center(s.from) - 50 / n + 4 : center(Math.min(s.from, s.to));
          const width = self ? 100 / n - 8 : Math.abs(s.to - s.from) * (100 / n);
          return (
            <li key={i} className={`flow-step${i === shown - 1 ? " now" : ""}${s.lost ? " lost" : ""}${self ? " self" : s.to > s.from ? " ltr" : " rtl"}`}>
              <span className="sr-only">{flow.actors[s.from]!.split("\n")[0]} → {flow.actors[s.to]!.split("\n")[0]}: </span>
              <div className="flow-arrow" style={{ marginLeft: `${left}%`, width: `${width}%` }}>
                <span className="flow-label">{s.label}</span>
                <i className="flow-line" aria-hidden="true" />
                {s.note && <span className="flow-note">{s.lost ? "✕ " : ""}{s.note}</span>}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flow-controls">
        <span>Шаг {shown} из {flow.steps.length}</span>
        <button type="button" className="btn ghost small" disabled={shown <= 1} onClick={() => setShown(shown - 1)}>Назад</button>
        <button type="button" className="btn small" disabled={all} onClick={() => setShown(shown + 1)}>Следующий шаг</button>
        <button type="button" className="btn ghost small" disabled={all} onClick={() => setShown(flow.steps.length)}>Показать всё</button>
      </div>
    </div>
  );
}

function Message({ m }: { m: HttpMessage }) {
  return (
    <pre className="net-msg"><b>{m.line}</b>{"\n"}{m.headers.map(([k, v]) => <span key={k + v}><span className="net-h">{k}</span>: {v}{"\n"}</span>)}{m.body ? <>{"\n"}<span className="net-body">{m.body}</span></> : null}</pre>
  );
}

type Detail = "headers" | "response" | "timing";

/** Вкладка «Сеть»: таблица запросов с водопадом, по клику — заголовки, тело ответа и тайминг. */
export function NetworkPanel({ requests }: { requests: NetRequest[] }) {
  const [sel, setSel] = useState(0);
  const [tab, setTab] = useState<Detail>("headers");
  const end = Math.max(...requests.map((r) => r.start + total(r)));
  const r = requests[sel]!;

  return (
    <div className="net">
      <div className="net-table" role="table" aria-label="Запросы">
        <div className="net-row net-head" role="row">
          <span role="columnheader">Имя</span><span role="columnheader">Статус</span><span role="columnheader">Тип</span>
          <span role="columnheader">Время</span><span role="columnheader">Водопад</span>
        </div>
        {requests.map((q, i) => (
          <button key={q.name} type="button" role="row" className={`net-row${i === sel ? " sel" : ""}`} aria-pressed={i === sel} onClick={() => setSel(i)}>
            <span role="cell" className="net-name">{q.name}</span>
            <span role="cell">{q.response.line.split(" ")[1]}</span>
            <span role="cell">{q.type}</span>
            <span role="cell">{total(q)} мс</span>
            <span role="cell" className="net-wf">
              {q.timing.map(([p, ms], j) => {
                const before = q.start + q.timing.slice(0, j).reduce((s, [, x]) => s + x, 0);
                return <i key={p} className={phaseClass(p)} title={`${p}: ${ms} мс`} style={{ left: `${(before / end) * 100}%`, width: `${(ms / end) * 100}%` }} />;
              })}
            </span>
          </button>
        ))}
      </div>
      <div className="net-detail">
        <div className="dt-tabs" role="tablist">
          <span className="dt-tab-static">{r.name}</span>
          {([["headers", "Заголовки"], ["response", "Ответ"], ["timing", "Тайминг"]] as [Detail, string][]).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <div className="net-pane">
          {tab === "headers" && <>
            <p className="net-cap">Запрос</p><Message m={r.request} />
            <p className="net-cap">Ответ</p><Message m={{ ...r.response, body: undefined }} />
          </>}
          {tab === "response" && (r.response.body ? <pre className="net-msg"><span className="net-body">{r.response.body}</span></pre> : <p className="muted">Тело ответа здесь не показано: это файл {r.type}.</p>)}
          {tab === "timing" && (
            <table className="net-timing">
              <tbody>
                {r.timing.map(([p, ms]) => (
                  <tr key={p}><th scope="row">{p}</th><td><i className={phaseClass(p)} style={{ width: `${(ms / total(r)) * 100}%` }} /></td><td>{ms} мс</td></tr>
                ))}
                <tr className="sum"><th scope="row">Всего</th><td /><td>{total(r)} мс</td></tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
