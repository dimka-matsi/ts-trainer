import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b5",
  region: 0,
  title: "Union-типы",
  q: "Почему у значения с union-типом можно пользоваться только общими свойствами?",
  answer: "Union `A | B` значит, что значение может быть любым из вариантов, и заранее неизвестно каким. Поэтому без проверки разрешено только то, что есть у всех вариантов. Чтобы вызвать метод одного варианта, сначала проверяют, какой он, например через `typeof`, и внутри проверки TypeScript уточняет тип.",
  theory: {
    p: [
      "Union-тип записывают через вертикальную черту: `string | number` значит «строка или число». Варианты называют членами union. В параметр такого типа можно передать любой из вариантов.",
      "Внутри функции неизвестно, какой вариант пришёл. Поэтому TypeScript разрешает только то, что работает для каждого варианта. У `string | number` нельзя вызвать `toUpperCase`: у числа такого метода нет.",
      "Если метод есть у всех вариантов, его можно вызвать сразу. Например, `slice` есть и у строк, и у массивов, поэтому для `string | number[]` вызов `x.slice(0, 3)` компилируется без проверок.",
      "Чтобы вызвать метод одного варианта, пишут обычную проверку JavaScript, например `typeof id === \"string\"`. Внутри такой проверки TypeScript знает, что `id` — строка. Это называется сужением типа.",
    ],
    example: `function printId(id: number | string) {
  console.log(id.toUpperCase());    // ошибка: у number нет toUpperCase
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // id: string
  }
}

function firstThree(x: number[] | string) {
  return x.slice(0, 3);             // slice есть у обоих
}`,
    keys: ["`A | B` — значение одного из вариантов.", "Без проверки доступно только общее для всех вариантов.", "Проверка `typeof` сужает тип до одного варианта."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function firstThree(x: number[] | string) {
  return x.slice(0, 3);
}
const r = firstThree("hello");`,
      opts: ["string", "string | number[]", "number[]", "any"],
      a: 1,
      why: "Тип результата зависит от описания функции, а не от того, что передали при вызове. `slice` у массива возвращает `number[]`, у строки `string`, поэтому результат — union из двух вариантов.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`formatId` принимает строку или число. Строку переведи в верхний регистр, а число дополни нулями слева до 5 знаков через `padStart`. Без `as` и `any`.",
      code: `function formatId(id: string | number): string {
  return id.toUpperCase();
}`,
      runtime: [["formatId(\"ab\")", "\"AB\""], ["formatId(42)", "\"00042\""]],
      forbid: ["any", "as", "ignore"],
      hint: "Проверь `typeof id === \"string\"`, а число преврати в строку через `String(id)`.",
      solution: `function formatId(id: string | number): string {
  if (typeof id === "string") return id.toUpperCase();
  return String(id).padStart(5, "0");
}`,
    },
  ],
};
