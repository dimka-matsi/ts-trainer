import type { Analysis, BossState, Exit, ExitResult, Level, Simulation, TsError } from "./types";

function label(set: ReadonlySet<string>, level: Level): string {
  const arr = level.members.filter((n) => set.has(n));
  return arr.length ? arr.join(" | ") : "never";
}

function checkExit(exit: Exit, set: ReadonlySet<string>, level: Level): ExitResult {
  const t = label(set, level);
  let error: TsError | null = null;
  if (exit.accepts === "never") {
    if (set.size) error = { code: 2345, msg: `Argument of type '${t}' is not assignable to parameter of type 'never'.` };
  } else {
    const accepts = exit.accepts ?? [];
    const ok = [...set].every((n) => accepts.includes(n));
    if (exit.kind === "method") {
      if (!ok || set.size === 0) error = { code: 2339, msg: `Property '${exit.method}' does not exist on type '${t}'.` };
    } else if (!ok) {
      error = { code: 2345, msg: `Argument of type '${t}' is not assignable to parameter of type '${exit.param}'.` };
    }
  }
  return { type: t, error };
}

// ---- уровень-босс: сужение unknown ----
export function accessError(base: BossState["base"]): TsError {
  if (base === "unknown") return { code: 18046, msg: "'input' is of type 'unknown'." };
  if (base === "object | null") return { code: 18047, msg: "'input' is possibly 'null'." };
  return { code: 2339, msg: `Property 'id' does not exist on type '${base}'.` };
}

export function inError(base: BossState["base"]): TsError {
  if (base === "unknown") return { code: 18046, msg: "'input' is of type 'unknown'." };
  if (base === "object | null") return { code: 18047, msg: "'input' is possibly 'null'." };
  return { code: 2638, msg: "Type '{}' may represent a primitive value, which is not permitted as the right operand of the 'in' operator." };
}

const bossLabel = (st: BossState) =>
  st.base === "hasId" ? 'object & Record<"id", unknown>' + (st.id ? `, input.id: ${st.id}` : "") : st.base;

function bossFinal(st: BossState): ExitResult {
  if (st.base === "any[]") return { type: "any", error: null };
  if (st.base !== "hasId") return { type: "", error: accessError(st.base) };
  if (st.id === "string" || st.id === "never") return { type: st.id, error: null };
  const t = st.id ?? "unknown";
  return { type: t, error: { code: 2345, msg: `Argument of type '${t}' is not assignable to parameter of type 'string'.` } };
}

function analyzeBoss(level: Level, slots: (number | null)[]): Analysis {
  const res: Analysis = { gates: [], exits: [], final: null, blocked: false, anyPath: false };
  let st: BossState = { base: "unknown", id: null };
  for (let i = 0; i < level.slots; i++) {
    const ci = slots[i];
    const tx = ci == null ? undefined : level.checks[ci]?.tx;
    if (ci == null || !tx) { res.blocked = true; break; }
    const out = tx(st);
    if ("error" in out) { res.gates[i] = { error: out.error }; res.blocked = true; break; }
    st = out.st;
    res.gates[i] = { after: bossLabel(st) };
    res.exits[i] = { type: "", error: null };
  }
  if (!res.blocked) res.final = bossFinal(st);
  res.anyPath = st.base === "any[]";
  return res;
}

/** Что компилятор скажет про код с выбранными условиями. */
export function analyze(level: Level, slots: (number | null)[]): Analysis {
  if (level.boss) return analyzeBoss(level, slots);
  const res: Analysis = { gates: [], exits: [], final: null, blocked: false, anyPath: false };
  let cur = new Set(level.members);
  for (let i = 0; i < level.slots; i++) {
    const ci = slots[i];
    const check = ci == null ? undefined : level.checks[ci];
    if (!check) { res.blocked = true; break; }
    const err = check.error ? check.error(cur) : null;
    if (err) { res.gates[i] = { error: err }; res.blocked = true; break; }
    const yes = new Set<string>(), no = new Set<string>();
    for (const n of cur) {
      const r = check.n?.[n] ?? "no";
      if (r !== "no") yes.add(n);
      if (r !== "yes") no.add(n);
    }
    res.exits[i] = checkExit(level.exits[i]!, yes, level);
    cur = no;
    res.gates[i] = { after: label(cur, level) };
  }
  if (!res.blocked) res.final = checkExit(level.final, cur, level);
  return res;
}

/** Куда реально покатится каждое значение. */
export function simulate(level: Level, slots: number[]): Simulation[] {
  return level.balls.map((ball, idx) => {
    const gates: number[] = [];
    for (let i = 0; i < level.slots; i++) {
      let r = false;
      try { r = level.checks[slots[i]!]!.run(ball.v); } catch { r = false; }
      gates.push(i);
      if (level.mode === "branch" ? r : !r) return { ball, idx, gates, dest: i };
    }
    return { ball, idx, gates, dest: "final" as const };
  });
}

/** Строки кода уровня; §N§ — место для условия N. */
export function codeLines(level: Level): string[] {
  const out = [...level.decls, "", `function ${level.fn}(${level.param}: ${level.paramType}) {`];
  if (level.mode === "branch") {
    for (let i = 0; i < level.slots; i++) {
      out.push(`  ${i === 0 ? "if" : "} else if"} (§${i}§) {`, `    ${level.exits[i]!.code};`);
    }
    out.push("  } else {", `    ${level.final.code};`, "  }");
  } else {
    for (let i = 0; i < level.slots; i++) out.push(`  if (!(§${i}§)) return ${level.exits[i]!.code};`);
    out.push(`  ${level.final.code};`);
  }
  out.push("}");
  return out;
}
