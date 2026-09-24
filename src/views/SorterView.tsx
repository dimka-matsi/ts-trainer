import { useMemo, useRef, useState, type ReactNode } from "react";
import { REGIONS } from "../content/regions";
import { LEVELS } from "../content/sorter/levels";
import { analyze, codeLines, simulate } from "../sorter/logic";
import type { Ball, Exit, Level, Simulation, TsError } from "../sorter/types";
import { useProgress } from "../state/progress";
import { levelStep, stepAfter, stepRoute } from "../state/path";
import { navigate } from "../state/route";
import { CodeLine, Md } from "../ui/Code";
import { DiagnosticItem } from "../ui/Diagnostic";
import { starStr } from "../ui/Header";
import { TheoryBlock } from "../ui/TheoryBlock";

/** Цвет шарика по члену union. */
const MARBLE: Record<string, string> = {
  string: "amber", number: "blue", null: "grey", Cat: "pink", Dog: "tan", Fish: "teal", Circle: "amber",
  Square: "blue", Triangle: "pink", "string[]": "green", Date: "violet", arr: "green", obj: "violet", idn: "pink", ids: "teal",
};

type ExitKey = number | "final";
const keyOf = (k: ExitKey) => String(k);

function Marble({ ball, hidden, innerRef }: { ball: Ball; hidden?: boolean; innerRef?: (el: HTMLSpanElement | null) => void }) {
  return (
    <span ref={innerRef} className={`marble${hidden ? " gone" : ""}`} style={{ ["--mc" as string]: `var(--m-${MARBLE[ball.m]})` }}>
      {ball.l}
    </span>
  );
}

interface ErrorLine extends TsError { where: string; got?: Simulation[] }

function ErrorList({ list }: { list: ErrorLine[] }) {
  return (
    <>
      {list.map((e, i) => (
        <DiagnosticItem key={i} code={e.code} msg={e.msg} where={
          <>
            {e.where}
            {e.got && <><br />В рантайме сюда попали: {e.got.length ? e.got.map((g) => g.ball.l).join(", ") : "ничего"}</>}
          </>
        } />
      ))}
    </>
  );
}

export function SorterView({ index }: { index: number }) {
  const level: Level = LEVELS[index]!;
  const { progress, setStars, unlock } = useProgress();

  const [slots, setSlots] = useState<(number | null)[]>(() => Array(level.slots).fill(null));
  const [sel, setSel] = useState(0);
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const [gone, setGone] = useState(false);
  const [landed, setLanded] = useState<Record<string, number[]>>({});
  const [marks, setMarks] = useState<Record<string, "good" | "bad">>({});
  const [gateError, setGateError] = useState<number | null>(null);
  const [output, setOutput] = useState<ReactNode>(<p>Собери условия и нажми «Запустить».</p>);

  const machineRef = useRef<HTMLDivElement>(null);
  const ballRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const gateRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const exitRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const trayRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const analysis = useMemo(() => analyze(level, slots), [level, slots]);
  const showTypes = hint || ran;
  const topics = REGIONS[1]!.topics!.filter((t) => t.lv === index);
  const won = (progress.stars[index] ?? 0) > 0;

  const resetRun = () => {
    setRan(false); setGone(false); setLanded({}); setMarks({}); setGateError(null);
    machineRef.current?.querySelectorAll(".marble.fly").forEach((f) => f.remove());
  };

  const changeSlots = (next: (number | null)[], nextSel: number) => {
    setSlots(next); setSel(nextSel); resetRun();
    setOutput(<p>Собери условия и нажми «Запустить».</p>);
  };

  const selectSlot = (i: number) => {
    if (running) return;
    if (sel === i && slots[i] != null) changeSlots(slots.map((s, j) => (j === i ? null : s)), i);
    else setSel(i);
  };

  const pickCheck = (ci: number) => {
    if (running) return;
    const next = slots.map((s, j) => (j === sel ? ci : s));
    let nextSel = sel;
    for (let k = 1; k <= level.slots; k++) {
      const j = (sel + k) % level.slots;
      if (next[j] == null) { nextSel = j; break; }
    }
    changeSlots(next, nextSel);
  };

  /** Шарики катятся по трубам: от воронки через условия к выходу. */
  const animate = (sims: Simulation[]) => {
    const host = machineRef.current;
    if (!host) return Promise.resolve();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hr = host.getBoundingClientRect();
    const center = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - hr.left + r.width / 2, y: r.top - hr.top + r.height / 2, top: r.top - hr.top };
    };
    const land = (s: Simulation) => setLanded((prev) => {
      const k = keyOf(s.dest);
      return { ...prev, [k]: [...(prev[k] ?? []), s.idx] };
    });
    const starts = sims.map((s) => center(ballRefs.current[s.idx]!));
    setGone(true);
    return Promise.all(sims.map((s, n) => {
      const tray = trayRefs.current[keyOf(s.dest)];
      const src = ballRefs.current[s.idx];
      if (reduce || !tray || !src || !host.animate) { land(s); return Promise.resolve(); }
      const pts = [{ ...starts[n]!, hold: 0 }];
      for (const g of s.gates) pts.push({ ...center(gateRefs.current[g]!), hold: 150 });
      if (s.dest === "final") {
        const f = center(exitRefs.current.final!);
        pts.push({ x: pts[pts.length - 1]!.x, y: f.top + 12, top: 0, hold: 0 });
      }
      pts.push({ ...center(tray), hold: 0 });

      const fly = src.cloneNode(true) as HTMLSpanElement;
      fly.classList.remove("gone");
      fly.classList.add("fly");
      host.appendChild(fly);
      const w = fly.offsetWidth, h = fly.offsetHeight;
      let time = 0;
      const stamps: { t: number; x: number; y: number }[] = [];
      pts.forEach((p, k) => {
        if (k > 0) time += Math.hypot(p.x - pts[k - 1]!.x, p.y - pts[k - 1]!.y) / 0.55;
        stamps.push({ t: time, x: p.x, y: p.y });
        if (p.hold) { time += p.hold; stamps.push({ t: time, x: p.x, y: p.y }); }
      });
      const total = Math.max(time, 1);
      const frames = stamps.map((st) => ({ transform: `translate(${st.x - w / 2}px, ${st.y - h / 2}px)`, offset: Math.min(1, st.t / total) }));
      frames[0]!.offset = 0;
      frames[frames.length - 1]!.offset = 1;
      const anim = fly.animate(frames, { duration: total, delay: s.idx * 230, fill: "both", easing: "linear" });
      return anim.finished.then(() => { fly.remove(); land(s); }, () => fly.remove());
    }));
  };

  const run = async () => {
    if (running) return;
    const missing = slots.filter((s) => s == null).length;
    if (missing) {
      setOutput(<p>Заполни все условия: осталось {missing}. Нажми на пустое место в коде или в сортировщике, потом выбери проверку.</p>);
      return;
    }
    const chosen = slots as number[];
    resetRun();
    setRunning(true);
    const a = analyze(level, chosen);
    if (chosen.some((i) => level.checks[i]!.tag === "falsy")) unlock("falsy");

    const gerr = a.gates.findIndex((g) => g && "error" in g);
    if (gerr >= 0) {
      const g = a.gates[gerr] as { error: TsError };
      setFails((f) => f + 1);
      setGateError(gerr);
      setOutput(
        <>
          <h3 className="bad-t">Компилятор остановился на условии</h3>
          <ErrorList list={[{ ...g.error, where: `в условии ${gerr + 1}: ${level.checks[chosen[gerr]!]!.c}` }]} />
          <p>Значения даже не поехали: код с ошибкой не компилируется. Поправь условие и запусти снова.</p>
        </>,
      );
      setRunning(false);
      return;
    }
    if (level.boss && a.anyPath) unlock("any");

    // Дать React сбросить трей и воронку перед измерением позиций.
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const sims = simulate(level, chosen);
    await animate(sims);
    setRan(true);

    const errs: ErrorLine[] = [];
    const issues: ReactNode[] = [];
    const nextMarks: Record<string, "good" | "bad"> = {};
    const judge = (exit: Exit, result: { error: TsError | null } | null | undefined, dest: ExitKey) => {
      const got = sims.filter((s) => s.dest === dest);
      if (result?.error) { errs.push({ ...result.error, where: `в ${exit.code}`, got }); nextMarks[keyOf(dest)] = "bad"; }
      else if (exit.must && !got.length) {
        issues.push(<>До <code>{exit.code}</code> не дошло ни одного значения: эта ветка мертва.</>);
        nextMarks[keyOf(dest)] = "bad";
      } else if (got.length && exit.need !== "отбраковка") nextMarks[keyOf(dest)] = "good";
    };
    level.exits.forEach((exit, i) => judge(exit, a.exits[i], i));
    judge(level.final, a.final, "final");
    setMarks(nextMarks);

    if (errs.length) {
      setFails((f) => f + 1);
      setOutput(
        <>
          <h3 className="bad-t">Компилятор не пропустит этот код</h3>
          <ErrorList list={errs} />
          <p>Шарики показывают, что случилось бы в рантайме. Поправь условия и запусти снова.</p>
        </>,
      );
    } else if (issues.length) {
      setFails((f) => f + 1);
      setOutput(
        <>
          <h3 className="bad-t">Код компилируется, но работает не так</h3>
          {issues.map((x, i) => <p key={i}>{x}</p>)}
          {level.boss && a.anyPath && (
            <p><code>Array.isArray</code> превратил <code>input</code> в <code>any[]</code>, и дальше компилятор ничего не проверял. Поэтому код скомпилировался, хотя пользователь так и не сохранился.</p>
          )}
        </>,
      );
    } else {
      win(chosen);
    }
    setRunning(false);
  };

  const win = (chosen: number[]) => {
    let stars = Math.max(1, 3 - fails);
    if (hintUsed) stars = Math.min(stars, 2);
    setStars(index, stars);
    if (stars === 3) unlock("clean");
    if (index === 1 && chosen.some((i) => level.checks[i]!.tag === "typeofnull")) unlock("typeofnull");
    if (index === 3) unlock("exhaustive");
    if (index === 5) unlock("guard");
    const allDone = LEVELS.every((_, i) => i === index || (progress.stars[i] ?? 0) > 0);
    if (allDone) unlock("all");
    const last = index === LEVELS.length - 1;
    const cur = levelStep(index);
    const nextStep = cur ? stepAfter(cur) : undefined;
    setOutput(
      <>
        <h3 className="ok-t">Скомпилировалось, все значения на своих местах</h3>
        <div className="stars" aria-label={`${stars} из 3 звёзд`}>{starStr(stars)}</div>
        <p><Md text={level.debrief} /></p>
        <p><b>На карте отмечено как изученное:</b> {topics.map((t) => t.t).join(", ")}.</p>
        {last && <p>Уровни пройдены. Дальше в этом регионе — уроки о сужении, которые не ложатся на сортировщик.</p>}
        <div className="actions">
          {nextStep && <button type="button" className="btn" onClick={() => navigate(stepRoute(nextStep))}>Дальше: {nextStep.title}</button>}
          <button type="button" className="btn ghost" onClick={() => navigate({ view: "map" })}>Открыть карту</button>
        </div>
      </>,
    );
  };

  const toggleHint = () => {
    if (running) return;
    setHint((h) => !h);
    setHintUsed(true);
  };

  const flowTag = (i: number) => {
    const g = analysis.gates[i];
    return showTypes && g && "after" in g ? `TS дальше: ${g.after}` : "";
  };
  const exitTag = (k: ExitKey) => {
    if (!showTypes) return "";
    if (k === "final") {
      if (!analysis.final) return "";
      if (level.boss) return analysis.final.type ? `TS: input.id: ${analysis.final.type}` : "";
      return `TS: ${level.param}: ${analysis.final.type}`;
    }
    const e = analysis.exits[k];
    return !level.boss && e ? `TS: ${level.param}: ${e.type}` : "";
  };

  const exitBox = (exit: Exit, k: ExitKey) => (
    <div className={`exit${marks[keyOf(k)] ? ` ${marks[keyOf(k)]}` : ""}`} ref={(el) => { exitRefs.current[keyOf(k)] = el; }}>
      <div className="exit-code">{exit.code}</div>
      <div className="exit-need">{exit.need}</div>
      <div className="tray" ref={(el) => { trayRefs.current[keyOf(k)] = el; }}>
        {(landed[keyOf(k)] ?? []).map((bi, n) => <Marble key={n} ball={level.balls[bi]!} />)}
      </div>
      <div className={`tag${exitTag(k) ? " show" : ""}`}>{exitTag(k)}</div>
    </div>
  );

  const slotButton = (i: number) => {
    const ci = slots[i];
    return (
      <button type="button" key={`slot${i}`} className={`slot${ci != null ? " filled" : ""}${sel === i ? " sel" : ""}${gateError === i ? " err" : ""}`}
        aria-label={`Условие ${i + 1}`} onClick={() => selectSlot(i)}>
        {ci == null ? "\u00a0?\u00a0" : <CodeLine line={level.checks[ci]!.c} />}
      </button>
    );
  };

  return (
    <section>
      <section className="intro">
        <h1>{index + 1}. {level.title}</h1>
        <div className="lvtopics">
          {topics.map((t) => <span key={t.t} className={`topic static ${won ? "done" : "open"}`}><span className="ic" aria-hidden="true">{won ? "✓" : "●"}</span>{t.t}</span>)}
        </div>
        <TheoryBlock theory={level.theory} open={!won} />
        <p className="assignment"><Md text={level.task} /></p>
        <p className="how">Выбери место в коде или в сортировщике, потом нажми на проверку. «Запустить» — и значения покатятся по трубам.</p>
      </section>

      <div className="board">
        <div>
          <pre className="code">
            {codeLines(level).map((line, i) => <CodeLine key={i} line={line} renderSlot={slotButton} />)}
          </pre>
          <div className="pick">Проверки для выбранного условия</div>
          <div className="chips">
            {level.checks.map((c, i) => <button key={i} type="button" className="chip" onClick={() => pickCheck(i)}>{c.c}</button>)}
          </div>
          <div className="actions">
            <button className="btn" type="button" disabled={running} onClick={run}>Запустить</button>
            <button className="btn ghost" type="button" aria-pressed={hint} onClick={toggleHint}>Показать типы</button>
            <button className="btn ghost" type="button" onClick={() => { if (!running) changeSlots(Array(level.slots).fill(null), 0); }}>Очистить</button>
            <span className="note">С подсказкой типов максимум две звезды</span>
          </div>
        </div>

        <div className="machine" ref={machineRef} aria-label="Сортировщик">
          <div className="hopper">
            <div className="hopper-t">{level.param}: {level.paramType}</div>
            <div className="balls">
              {level.balls.map((b, i) => <Marble key={i} ball={b} hidden={gone} innerRef={(el) => { ballRefs.current[i] = el; }} />)}
            </div>
          </div>
          <div className="mrow pipe-row"><div className="pipe" /></div>
          {level.exits.map((exit, i) => {
            const ci = slots[i];
            return (
              <div key={i}>
                <div className="mrow">
                  <button type="button" ref={(el) => { gateRefs.current[i] = el; }}
                    className={`gate${ci == null ? " empty" : ""}${sel === i ? " sel" : ""}${gateError === i ? " err" : ""}`}
                    aria-label={`Условие ${i + 1}: ${ci == null ? "пусто" : level.checks[ci]!.c}`} onClick={() => selectSlot(i)}>
                    {ci == null ? "?" : level.checks[ci]!.c}
                  </button>
                  <div className="conn"><span>{level.mode === "branch" ? "да" : "нет"}</span></div>
                  {exitBox(exit, i)}
                </div>
                <div className="mrow pipe-row"><div className="pipe" /><div className={`tag${flowTag(i) ? " show" : ""}`}>{flowTag(i)}</div></div>
              </div>
            );
          })}
          <div className="mrow final-row">{exitBox(level.final, "final")}</div>
        </div>
      </div>

      <section className="console" aria-live="polite">{output}</section>
    </section>
  );
}
