import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b5",
  region: 0,
  title: "Union-типы",
  q: "Почему у union доступны только общие свойства?",
  answer: "Union — объединение множеств значений, поэтому без проверки можно использовать только то, что есть у всех членов. Чтобы вызвать специфичный метод, тип сужают через `typeof`, `in`, `Array.isArray` или дискриминант.",
  theory: {
    p: [
      "Union `A | B` описывает значение, которое может быть любым из членов. Передать такое значение легко: подходит любой член.",
      "Использовать сложнее: TS разрешает только операции, допустимые для каждого члена. У `string | number` нельзя вызвать `toUpperCase`, пока не сузишь тип.",
      "Union типов даёт «пересечение» их свойств. Это не случайность: union — объединение множеств значений, и про всех сразу известно только общее. Если общее свойство есть у всех членов, как `slice` у строк и массивов, его можно вызвать без проверки.",
      "Сужение — обычный JS-код: `typeof`, `Array.isArray`, сравнения. Подробно оно разобрано в регионе «Болото союзов».",
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
    keys: ["Передать union легко, использовать — только общее.", "Сужение открывает специфичные методы.", "Общие для всех членов свойства доступны сразу."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `r`?",
      probe: "r",
      code: `function firstThree(x: number[] | string) {
  return x.slice(0, 3);
}
const r = firstThree("hello");`,
      opts: ["string", "string | number[]", "number[]", "any"],
      a: 1,
      why: "Тип результата выводится из сигнатуры функции, а не из конкретного аргумента. `slice` у массива возвращает `number[]`, у строки — `string`, итог — их union.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Строки переведи в верхний регистр, а числа дополни нулями до 5 знаков через `padStart`. Без `as` и `any`.",
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
