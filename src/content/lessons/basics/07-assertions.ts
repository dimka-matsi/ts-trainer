import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b7",
  region: 0,
  title: "Type assertions",
  q: "Когда оправдан `as` и что такое `as unknown as T`?",
  answer: "`as` оправдан, когда я знаю больше компилятора: DOM-элементы или данные после runtime-валидации. Это не приведение, в рантайме ничего не проверяется. `as unknown as T` обходит проверку совместимости и почти всегда означает, что типы спроектированы неправильно.",
  theory: {
    p: [
      "`as T` сообщает компилятору то, чего он знать не может: например, что `getElementById` вернёт именно `HTMLCanvasElement`. Это не приведение: в рантайме ничего не проверяется и не меняется.",
      "TS разрешает assertion только к более конкретному или более общему типу. `\"hello\" as number` — ошибка, потому что типы не пересекаются. Двойной `as unknown as T` обходит правило, на ревью это красный флаг.",
      "Postfix `!` — assertion «здесь не `null` и не `undefined`». Он тоже ничего не проверяет: если значение всё-таки `null`, код упадёт.",
      "Правило: сначала сужение проверкой, `as` — только когда ты действительно знаешь больше компилятора.",
    ],
    example: `const canvas = document.getElementById("main") as HTMLCanvasElement;

const x = "hello" as number;            // ошибка: типы не пересекаются
const y = "hello" as unknown as number; // компилируется, но это ложь

function len(s?: string | null) {
  return s!.length;                     // упадёт, если s не передали
}`,
    keys: ["`as` не проверяет и не преобразует данные.", "Несовместимые типы нельзя привести одним `as`.", "`!` скрывает реальный `null`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `el`?",
      probe: "el",
      code: `const el = document.getElementById("app");`,
      opts: ["HTMLElement", "HTMLElement | null", "Element", "HTMLElement | undefined"],
      a: 1,
      why: "Элемента с таким id может не быть, поэтому DOM-метод честно возвращает `HTMLElement | null`.",
    },
    {
      type: "quiz",
      q: "`const n = JSON.parse(text) as number`, а в `text` лежит `\"\\\"abc\\\"\"`. Что будет в рантайме?",
      opts: ["Ничего: `n` окажется строкой", "Бросится TypeError", "`n` станет NaN", "TS добавит проверку типа"],
      a: 0,
      why: "Assertion стирается при компиляции. `n` будет строкой, хотя TS считает её числом, и ошибка проявится позже, в неожиданном месте.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Убери `as` и `!`: `nameLength` должна вернуть длину имени или 0, `parseAge` — число или 0.",
      code: `type User = { name?: string | null };

function nameLength(u: User): number {
  return u.name!.length;
}

function parseAge(input: unknown): number {
  return input as number;
}`,
      runtime: [["nameLength({})", "0"], ["nameLength({ name: \"Ann\" })", "3"], ["parseAge(\"5\")", "0"], ["parseAge(7)", "7"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "`?.` и `??` для имени, `typeof input === \"number\"` для возраста.",
      solution: `type User = { name?: string | null };

function nameLength(u: User): number {
  return u.name?.length ?? 0;
}

function parseAge(input: unknown): number {
  return typeof input === "number" ? input : 0;
}`,
    },
  ],
};
