import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "n4",
  region: 1,
  title: "Состояния loading / success / error",
  q: "Как описать состояние запроса, чтобы не было «данных без успеха»?",
  answer: "Вместо набора флагов `isLoading`, `data`, `error` я описываю discriminated union по полю `status`, и у каждого состояния только свои поля. Тогда комбинацию «ошибка и данные одновременно» нельзя даже записать, а проверка `status` открывает нужные поля. Если добавить новое состояние, `never` в `default` покажет все места, где его забыли.",
  theory: {
    p: [
      "Часто состояние запроса описывают набором полей: `{ isLoading: boolean; data?: string[]; error?: Error }`. Такой тип допускает 8 комбинаций, и половина из них бессмысленна: загрузка вместе с ошибкой, данные вместе с ошибкой.",
      "Discriminated union описывает только возможные состояния: `idle`, `loading`, `success` с `data`, `error` с `error`. Поле `status` — метка, по которой TypeScript сужает тип.",
      "Код, который читает `data` без проверки `status`, не скомпилируется. Лишнее поле в литерале тоже: TypeScript проверяет его по варианту с той же меткой.",
      "Если добавить состояние, например `refreshing`, `switch` без него перестанет компилироваться там, где стоит проверка через `never`. Так же устроены reducer в React и машины состояний.",
    ],
    example: `// Плохо: можно записать loading вместе с error
type Loose = { isLoading: boolean; data?: string[]; error?: Error };

// Хорошо: только возможные состояния
type RequestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; error: Error };

function render(s: RequestState): string {
  switch (s.status) {
    case "idle": return "Нажми «Загрузить»";
    case "loading": return "Загрузка…";
    case "success": return s.data.join(", ");
    case "error": return s.error.message;
  }
}

const bad: RequestState = { status: "loading", data: [] }; // ошибка: у loading нет data`,
    keys: ["Метка `status` и свои поля у каждого состояния.", "Невозможные комбинации не записать.", "`never` в `default` ловит новое состояние."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри ветки `if (s.status !== \"loading\")`?",
      probe: "r",
      code: `type RequestState =
  | { status: "loading" }
  | { status: "success"; data: number }
  | { status: "error"; error: Error };

function f(s: RequestState) {
  if (s.status !== "loading") {
    const r = s;
  }
}`,
      opts: [
        "RequestState",
        "{ status: \"success\"; data: number; } | { status: \"error\"; error: Error; }",
        "{ status: \"success\"; data: number; }",
        "never",
      ],
      a: 1,
      why: "Проверка метки вычитает вариант `loading`, остаются два других члена union.",
    },
    {
      type: "quiz",
      q: "Сколько комбинаций допускает `{ isLoading: boolean; data?: string[]; error?: Error }`, если считать только «поле есть или нет»?",
      opts: ["3", "4", "8", "2"],
      a: 2,
      why: "Два значения `isLoading` × есть или нет `data` × есть или нет `error` = 8. Осмысленных из них три-четыре.",
      example: `type Loose = { isLoading: boolean; data?: string[]; error?: Error };
const odd1: Loose = { isLoading: true, error: new Error("x") };             // загрузка с ошибкой
const odd2: Loose = { isLoading: false, data: [], error: new Error("x") }; // данные и ошибка сразу`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Перепиши `FormState` в discriminated union: `editing` и `submitting` с полем `values: string`, `done` с `id: number`, `failed` с `message: string` и `values: string`.",
      code: `type FormState = {
  status: "editing" | "submitting" | "done" | "failed";
  values?: string;
  id?: number;
  message?: string;
};`,
      tests: `const ok1: FormState = { status: "failed", message: "Сеть", values: "" };
const ok2: FormState = { status: "done", id: 1 };
const ok3: FormState = { status: "editing", values: "" };
// @ts-expect-error: у editing нет id
const bad0: FormState = { status: "editing", values: "", id: 1 };
// @ts-expect-error: у done нет values
const bad1: FormState = { status: "done", id: 1, values: "x" };
// @ts-expect-error: у submitting обязательны values
const bad2: FormState = { status: "submitting" };`,
      forbid: ["any", "as", "ignore"],
      hint: "Четыре объектных типа через `|`, в каждом литеральный `status` и только свои поля.",
      solution: `type FormState =
  | { status: "editing"; values: string }
  | { status: "submitting"; values: string }
  | { status: "done"; id: number }
  | { status: "failed"; message: string; values: string };`,
    },
  ],
};
