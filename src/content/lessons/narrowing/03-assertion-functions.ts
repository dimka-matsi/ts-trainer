import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "n3",
  region: 1,
  title: "Assertion functions",
  q: "Чем assertion function отличается от type guard?",
  answer: "Type guard возвращает `boolean` и сужает тип только внутри `if`. Assertion function с типом `asserts x is T` ничего не возвращает: если проверка не прошла, она бросает ошибку, а после вызова тип сужен до конца блока. Её удобно ставить на входе функции, чтобы дальше код шёл без вложенных `if`.",
  theory: {
    p: [
      "Assertion function объявляется с возвращаемым типом `asserts value is T`. Если значение не подходит, она обязана бросить исключение.",
      "После вызова TypeScript считает, что проверка прошла: тип сужен до конца текущего блока. Вложенный `if` не нужен.",
      "Короткая форма `asserts value` значит «после вызова значение truthy». Так пишут свой `assert(cond, msg)`, который сужает любое условие.",
      "Тело такой функции TypeScript тоже не проверяет. И есть ещё правило: вызывать её нужно через имя, у которого тип объявлен явно. Если записать стрелочную функцию в `const` без типа переменной, сужение не сработает, и компилятор выдаст ошибку TS2775.",
    ],
    example: `function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertIsString(x: unknown): asserts x is string {
  if (typeof x !== "string") throw new Error("Ожидалась строка");
}

function greet(name: unknown, user: { email?: string }) {
  assertIsString(name);
  name.toUpperCase();   // name: string до конца функции

  assert(user.email, "Нет email");
  user.email.length;    // email: string
}

const check = (x: unknown): asserts x is number => {
  if (typeof x !== "number") throw new Error();
};
check(1); // ошибка TS2775: у check нет явного типа`,
    keys: ["`asserts x is T` сужает тип после вызова.", "Проверка не прошла — функция бросает ошибку.", "Вызывать можно только через имя с явным типом."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `r` после вызова `assertNumber(input)`?",
      probe: "r",
      code: `function assertNumber(x: unknown): asserts x is number {
  if (typeof x !== "number") throw new Error("not a number");
}
function f(input: unknown) {
  assertNumber(input);
  const r = input;
}`,
      opts: ["unknown", "number", "never", "boolean"],
      a: 1,
      why: "После вызова assertion function TypeScript считает проверку пройденной и сужает `input` до `number` до конца блока.",
    },
    {
      type: "quiz",
      q: "Что вернёт вызов `assertNumber(5)` во время работы программы?",
      opts: ["`true`", "`undefined`", "`5`", "Тип `number`"],
      a: 1,
      why: "У assertion function результат `void`: она либо молча завершается, либо бросает ошибку. Сужение существует только для компилятора.",
      example: `function assertNumber(x: unknown): asserts x is number {
  if (typeof x !== "number") throw new Error("not a number");
}
const result = assertNumber(5); // тип void, значение undefined`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`withTax` не компилируется: после `assertHasTotal(o)` TypeScript всё ещё считает, что `total` может отсутствовать. Сделай `assertHasTotal` assertion-функцией.",
      code: `type Order = { id: string; total?: number };

function assertHasTotal(o: Order) {
  if (o.total === undefined) throw new Error("Нет суммы");
}

function withTax(o: Order): number {
  assertHasTotal(o);
  return o.total * 1.2;
}`,
      runtime: [["withTax({ id: \"1\", total: 100 })", "120"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      must: ["assertHasTotal(o);", "return o.total * 1.2;"],
      hint: "Возвращаемый тип `asserts o is Order & { total: number }`: после проверки у заказа точно есть сумма.",
      solution: `type Order = { id: string; total?: number };

function assertHasTotal(o: Order): asserts o is Order & { total: number } {
  if (o.total === undefined) throw new Error("Нет суммы");
}

function withTax(o: Order): number {
  assertHasTotal(o);
  return o.total * 1.2;
}`,
    },
  ],
};
