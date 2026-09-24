import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f2",
  region: 2,
  title: "Необязательные параметры и значения по умолчанию",
  q: "Чем параметр `x?: number` отличается от `x = 0` и от `x: number | undefined`?",
  answer: "`x?` и `x = 0` делают аргумент необязательным для вызывающего. Внутри функции `x?` имеет тип `number | undefined`, а параметр со значением по умолчанию — просто `number`. `x: number | undefined` без `?` передать обязательно, хотя бы явным `undefined`.",
  theory: {
    p: [
      "`?` после имени делает параметр необязательным. Внутри функции его тип `T | undefined`, и перед использованием его нужно проверить.",
      "Значение по умолчанию `x = 10` тоже делает параметр необязательным, но внутри у него тип без `undefined`: TypeScript выводит `number` из значения. Если при вызове явно передать `undefined`, тоже сработает значение по умолчанию.",
      "`x: number | undefined` без `?` — обязательный параметр, который может быть `undefined`. Вызвать функцию без аргумента нельзя. Так пишут, когда вызывающий должен явно решить, что передать.",
      "Необязательные параметры идут после обязательных. В типе колбэка `?` почти никогда не нужен: функция с меньшим числом параметров и так подходит.",
    ],
    example: `function greet(name?: string) {
  return "Привет, " + (name ?? "гость"); // name: string | undefined
}
function repeat(s: string, times = 2) {
  return s.repeat(times);                // times: number
}
function save(data: string, id: number | undefined) {
  return id ?? data.length;
}

greet();
repeat("ab");
repeat("ab", undefined); // сработает значение по умолчанию
save("x");               // ошибка: второй аргумент обязателен`,
    keys: ["`x?` — необязателен, внутри `T | undefined`.", "`x = v` — необязателен, внутри `T`.", "`x: T | undefined` — обязателен, но может быть `undefined`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function f(x = 10) {
  return x;
}
const r = f;`,
      opts: ["(x?: number) => number", "(x: number) => number", "(x?: number) => number | undefined", "(x: number | undefined) => number"],
      a: 0,
      why: "Снаружи параметр со значением по умолчанию необязателен, а внутри у него тип `number`, поэтому и результат `number`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `w`?",
      probe: "w",
      code: `function pad(s: string, width?: number) {
  const w = width;
  return s.padStart(w ?? 0);
}`,
      opts: ["number", "number | undefined", "undefined", "number | null"],
      a: 1,
      why: "Необязательный параметр внутри функции всегда `T | undefined`: его могли не передать.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`formatPrice(10)` не компилируется: второй параметр обязателен. Сделай валюту необязательной со значением `\"₽\"` по умолчанию.",
      code: `function formatPrice(value: number, currency: string | undefined) {
  return \`\${value.toFixed(2)} \${currency ?? "₽"}\`;
}

const a = formatPrice(10);
const b = formatPrice(5, "$");`,
      runtime: [["formatPrice(10)", "\"10.00 ₽\""], ["formatPrice(5, \"$\")", "\"5.00 $\""]],
      forbid: ["any", "as", "ignore"],
      must: ["const a = formatPrice(10);"],
      hint: "Значение по умолчанию пишут прямо в списке параметров: `currency = \"₽\"`.",
      solution: `function formatPrice(value: number, currency = "₽") {
  return \`\${value.toFixed(2)} \${currency}\`;
}

const a = formatPrice(10);
const b = formatPrice(5, "$");`,
    },
  ],
};
