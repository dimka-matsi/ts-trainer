/**
 * Проверка порядка тем: конструкция TypeScript не должна встречаться раньше урока, где её проходят.
 * Смотрит теорию, пример, задания (кроме строк `Expect<Equal<...>>` в тестах), уровни сортировщика,
 * вопросы экзаменов и флеш-карточки. Карточки и экзамен проверяются на конец своего региона.
 *
 * Чтобы разрешить конструкцию раньше, её нужно объяснить в том уроке, где она впервые появилась,
 * и перенести сюда поле `at`.
 */
import { EXAM_ONLY_TASKS } from "../src/content/exams";
import { FLASHCARDS } from "../src/content/flashcards";
import { LESSONS } from "../src/content/lessons";
import { REGIONS } from "../src/content/regions";
import { LEVELS } from "../src/content/sorter/levels";

/** Шаги прохождения: регионы по порядку карты, внутри — уроки и уровни в порядке прохождения. */
function buildOrder(): string[] {
  const order: string[] = [];
  REGIONS.forEach((r, ri) => {
    if (r.kind === "sorter") order.push(...LEVELS.map((_, i) => `L${i + 1}`));
    order.push(...LESSONS.filter((l) => l.region === ri).map((l) => l.id));
    order.push(`end${ri}`);
  });
  return order;
}

interface Concept {
  name: string;
  re: RegExp;
  /** Где конструкцию проходят: id урока, `L<n>` — уровень сортировщика, `end<n>` — ещё не сделанный регион. */
  at: string;
}

const CONCEPTS: Concept[] = [
  { name: "declare", re: /\bdeclare (const|function|let|global|module)\b/, at: "b3" },
  { name: "union `|`", re: /[\w\])"'] \| [\w"'([{]/, at: "b5" },
  { name: "type alias", re: /\btype \w+(<[^>]*>)? =/, at: "b4" },
  { name: "as const", re: /\bas const\b/, at: "b8" },
  { name: "readonly", re: /\breadonly\b/, at: "b8" },
  { name: "enum", re: /\benum\b/, at: "b8" },
  { name: "interface", re: /\binterface\b/, at: "b6" },
  { name: "пересечение `&`", re: /[\w}\]] & [\w{(]/, at: "b6" },
  { name: "never", re: /\bnever\b/, at: "b6" },
  { name: "null в типе", re: /\| null\b|: null\b/, at: "b9" },
  { name: "non-null `!`", re: /\w!\.|\w!;/, at: "b9" },
  { name: "unknown", re: /\bunknown\b/, at: "b10" },
  { name: "assertion `as`", re: /\bas (?!const\b)[A-Za-z]/, at: "b7" },
  { name: "branded type", re: /__brand/, at: "b7" },
  { name: "satisfies", re: /\bsatisfies\b/, at: "b11" },
  { name: "сужение `in`", re: /"\w+" in \w/, at: "L3" },
  { name: "instanceof", re: /\binstanceof\b/, at: "L3" },
  { name: "Array.isArray", re: /Array\.isArray/, at: "L5" },
  { name: "type predicate", re: /\): \w+ is \w|`\w+ is \w+`/, at: "n2" },
  { name: "asserts", re: /\basserts\b/, at: "n3" },
  { name: "construct signature", re: /\bnew \(\) =>|\bnew \(\.\.\./, at: "f1" },
  { name: "дженерик-объявление", re: /(function \w+|type \w+|class \w+|interface \w+|=\s*)<[A-Z]\w*( extends|,|>)/, at: "fg" },
  { name: "перегрузки", re: /перегрузк/i, at: "f3" },
  { name: "параметр `this:`", re: /\(this: /, at: "f4" },
  { name: "вариантность", re: /вариант(ность|ен|ны)|контравари/i, at: "f8" },
  { name: "index signature", re: /\[\w+: string\]/, at: "end3" },
  { name: "тип `{}` и `Object`", re: /: \{\} =|: Object =|типа `\{\}`|`Object`, `\{\}`/, at: "end3" },
  { name: "поле типа `T[\"k\"]`", re: /\b[A-Z]\w*\["\w+"\]/, at: "g1" },
  { name: "keyof", re: /\bkeyof\b/, at: "g1" },
  { name: "mapped type", re: /\[\w+ in (keyof )?\w/, at: "u1" },
  { name: "Partial/Required/Readonly", re: /\b(Partial|Required|Readonly)</, at: "u1" },
  { name: "Record", re: /\bRecord</, at: "u2" },
  { name: "conditional type", re: /\bextends [^?;{\n]{1,60}\? /, at: "u4" },
  { name: "Exclude/Extract/NonNullable", re: /\b(Exclude|Extract|NonNullable)</, at: "u4" },
  { name: "Pick/Omit", re: /\b(Pick|Omit)</, at: "u3" },
  { name: "typeof в позиции типа", re: /(:|=|<|\() *\(?typeof \w+\)?(\[|>|;|$)|type \w+ = typeof/m, at: "g3" },
  { name: "infer", re: /\binfer\b/, at: "u5" },
  { name: "ReturnType/Parameters", re: /\b(ReturnType|Parameters|InstanceType|ConstructorParameters)</, at: "u5" },
  { name: "Awaited/NoInfer", re: /\b(Awaited|NoInfer)</, at: "u6" },
  { name: "template literal type", re: /type [^=\n]+=[^\n;]*`[^`\n]*\$\{|\bas `/, at: "u8" },
  { name: "модификаторы класса", re: /\b(private|protected|implements|abstract)\b/, at: "end7" },
];

const EXPECT_LINE = /^.*Expect<Equal<.*$/gm;

export function checkOrder(fail: (msg: string) => void) {
  const order = buildOrder();
  const pos = (id: string) => {
    const i = order.indexOf(id);
    if (i < 0) throw new Error(`verify-order: неизвестный шаг ${id}`);
    return i;
  };
  const scan = (where: string, step: string, text: string) => {
    const p = pos(step);
    for (const c of CONCEPTS) {
      if (pos(c.at) <= p) continue;
      const m = c.re.exec(text);
      if (!m) continue;
      const snippet = text.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, " ");
      fail(`${where}: «${c.name}» встречается раньше урока ${c.at}: …${snippet}…`);
    }
  };

  for (const l of LESSONS) {
    scan(`${l.id} теория`, l.id, [l.q, l.answer, ...l.theory.p, ...l.theory.keys, l.theory.example].join("\n"));
    l.tasks.forEach((t, i) => {
      const text = t.type === "code"
        ? [t.goal, t.code, (t.tests ?? "").replace(EXPECT_LINE, ""), t.hint, t.solution].join("\n")
        : [t.q, ...t.opts, t.why, t.type === "predict" ? t.code : t.example ?? ""].join("\n");
      scan(`${l.id} задание ${i + 1}`, l.id, text);
    });
  }
  LEVELS.forEach((lv, i) => scan(`уровень ${i + 1}`, `L${i + 1}`, JSON.stringify(lv)));
  EXAM_ONLY_TASKS.forEach(({ region, task }, i) =>
    scan(`экзамен региона ${region + 1}, вопрос ${i + 1}`, `end${region}`,
      [task.q, ...task.opts, task.why, task.type === "predict" ? task.code : task.example ?? ""].join("\n")));
  for (const c of FLASHCARDS) {
    scan(`карточка ${c.id}`, `end${c.region}`, [c.q, c.a, (c.code ?? "").replace(EXPECT_LINE, "")].join("\n"));
  }
}
