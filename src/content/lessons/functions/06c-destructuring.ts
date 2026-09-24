import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "fd",
  region: 2,
  title: "Деструктуризация параметров",
  q: "Как указать тип параметра, который сразу разбирается на поля: `function f({ a, b })`?",
  answer: "Тип пишут после всего шаблона: `function sum({ a, b }: { a: number; b: number })`. Запись `{ a: number }` внутри самого шаблона — это переименование поля в JavaScript, а не тип. Обычно тип выносят в `type`, а значения по умолчанию ставят в шаблоне: `({ size = 10 }: Options)`.",
  theory: {
    p: [
      "Параметр можно сразу разобрать на поля: `function sum({ a, b })`. Тип такого параметра пишут после всего шаблона через двоеточие: `function sum({ a, b }: { a: number; b: number })`.",
      "Частая ошибка — написать тип внутри шаблона: `function draw({ shape: Shape })`. В JavaScript это значит «взять поле `shape` и положить в переменную `Shape`». Тип при этом не указан, и TypeScript сообщит о неявном `any` (TS7031).",
      "Длинный тип удобно вынести: `type Options = { size?: number; color: string }` и `function draw({ size = 10, color }: Options)`. Значение по умолчанию пишут в шаблоне, и внутри функции у `size` тип `number` без `undefined`.",
      "С массивами и кортежами так же: `function point([x, y]: [number, number])`. Тип всегда стоит после шаблона целиком.",
    ],
    example: `function sum({ a, b }: { a: number; b: number }) {
  return a + b;
}

type Options = { size?: number; color: string };
function draw({ size = 10, color }: Options) {
  return \`\${color}: \${size}px\`;  // size: number
}
draw({ color: "red" });

function point([x, y]: [number, number]) {
  return x + y;
}

function wrong({ shape: Shape }) { // ошибка: это переименование, а не тип
  return Shape;
}`,
    keys: ["Тип пишут после всего шаблона: `({ a }: T)`.", "`{ a: number }` внутри шаблона — переименование, а не тип.", "Значение по умолчанию в шаблоне убирает `undefined` из типа."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `s` внутри функции `draw`?",
      probe: "s",
      code: `type Options = { size?: number; color: string };
function draw({ size = 10, color }: Options) {
  const s = size;
  return color;
}`,
      opts: ["number", "number | undefined", "10", "any"],
      a: 0,
      why: "В `Options` поле `size` необязательное, но в шаблоне у него значение по умолчанию. Если поля нет, подставится `10`, поэтому внутри тип `number`.",
    },
    {
      type: "quiz",
      q: "Что означает `function greet({ name: string })`?",
      opts: [
        "Поле `name` кладётся в переменную с именем `string`, тип не указан",
        "Параметр `name` имеет тип `string`",
        "Функция принимает строку `name`",
        "Это синтаксическая ошибка JavaScript",
      ],
      a: 0,
      why: "Внутри шаблона деструктуризации двоеточие переименовывает поле. Чтобы указать тип, его пишут после шаблона: `({ name }: { name: string })`.",
      example: `function greet({ name: string }) { // ошибка: неявный any у переменной string
  return string;
}
function greetOk({ name }: { name: string }) {
  return name;
}`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "У параметра `greet` нет типа. Укажи его: `name` — обязательная строка, `greeting` — необязательная строка со значением по умолчанию `\"Привет\"`.",
      code: `function greet({ name, greeting }) {
  return \`\${greeting}, \${name}!\`;
}`,
      tests: `greet({ name: "Ann" });
greet({ name: "Ann", greeting: "Здравствуй" });
// @ts-expect-error: имя обязательно
greet({ greeting: "Привет" });`,
      runtime: [["greet({ name: \"Ann\" })", "\"Привет, Ann!\""], ["greet({ name: \"Bob\", greeting: \"Хай\" })", "\"Хай, Bob!\""]],
      forbid: ["any", "as", "ignore"],
      hint: "`function greet({ name, greeting = \"Привет\" }: { name: string; greeting?: string })`.",
      solution: `function greet({ name, greeting = "Привет" }: { name: string; greeting?: string }) {
  return \`\${greeting}, \${name}!\`;
}`,
    },
  ],
};
