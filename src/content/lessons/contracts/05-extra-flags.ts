import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct5",
  region: 8,
  title: "Флаги сверх strict",
  q: "Какие полезные проверки не входят в `strict`? Что делают `noUncheckedIndexedAccess` и `exactOptionalPropertyTypes`?",
  answer: "Часть строгих проверок сознательно оставлена вне `strict`, потому что меняет много кода. `noUncheckedIndexedAccess` добавляет `| undefined` к чтению по индексу и по index signature: `arr[0]` становится `number | undefined`, и компилятор заставляет проверить, что элемент есть. `exactOptionalPropertyTypes` различает «поля нет» и «поле есть, но `undefined`»: в `nick?: string` нельзя явно записать `undefined`. Ещё полезны `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns` и `noFallthroughCasesInSwitch`.",
  theory: {
    p: [
      "`noUncheckedIndexedAccess` (TypeScript 4.1). Без него `arr[10]` имеет тип элемента, хотя там может быть `undefined`, как и `scores[\"oleg\"]` у index signature. С флагом чтение по индексу даёт `T | undefined`, и компилятор требует проверку. Это ловит частые ошибки «прочитали несуществующий элемент». Минус — больше проверок в коде, поэтому флаг вне `strict`.",
      "`exactOptionalPropertyTypes` (4.4). По умолчанию `nick?: string` принимает и отсутствие поля, и явное `nick: undefined`. Иногда это разные вещи: при обновлении записи «поле не передали» и «поле сбросили» должны различаться. С флагом явный `undefined` в необязательное поле не записать, если его нет в типе.",
      "Ещё флаги. `noImplicitOverride` требует писать `override` при переопределении метода — защита от опечатки в имени. `noPropertyAccessFromIndexSignature` заставляет читать поля сигнатуры через скобки `env[\"HOME\"]`, чтобы было видно, что поле может отсутствовать. `noImplicitReturns` ругается, если не все ветки возвращают значение, `noFallthroughCasesInSwitch` — на проваливание в `switch`.",
      "На собеседовании хороший ответ — не список флагов, а понимание: `strict` — минимум, а для кода, где часто читают массивы и словари, стоит включить `noUncheckedIndexedAccess`. В примерах этого урока флаги включены первой строкой `// @flags:`.",
    ],
    example: `// @flags: noUncheckedIndexedAccess, exactOptionalPropertyTypes
const list: string[] = ["a"];
const first = list[0];
first.toUpperCase();                 // ошибка: first может быть undefined
if (first) first.toUpperCase();      // так можно

type User = { nick?: string };
const a: User = {};
const b: User = { nick: undefined }; // ошибка: явный undefined запрещён`,
    keys: ["`noUncheckedIndexedAccess` — чтение по индексу даёт `T | undefined`, нужна проверка.", "`exactOptionalPropertyTypes` различает «поля нет» и «поле равно `undefined`».", "Полезны и `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `x` с флагом `noUncheckedIndexedAccess`?",
      probe: "x",
      code: `// @flags: noUncheckedIndexedAccess
const arr: number[] = [1];
const x = arr[0];`,
      opts: ["number | undefined", "number", "1", "undefined"],
      a: 0,
      why: "С флагом компилятор честно учитывает, что элемента по индексу может не быть.",
    },
    {
      type: "quiz",
      q: "Что запрещает `exactOptionalPropertyTypes` для типа `{ nick?: string }`?",
      opts: ["Явно записать `nick: undefined`", "Не передавать `nick` вообще", "Передавать строку", "Читать `nick`"],
      a: 0,
      why: "Отсутствие поля по-прежнему разрешено. Запрещён явный `undefined`, если его нет в типе поля.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "С флагом `noUncheckedIndexedAccess` функция не компилируется. Верни первую букву имени в верхнем регистре или пустую строку, если имени нет.",
      code: `// @flags: noUncheckedIndexedAccess
function initial(names: string[]): string {
  const first = names[0];
  return first[0].toUpperCase();
}`,
      runtime: [["initial(['анна'])", "\"А\""], ["initial([])", "\"\""]],
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "Проверь `first` и символ: `const letter = first?.[0]; return letter ? letter.toUpperCase() : \"\";`.",
      solution: `// @flags: noUncheckedIndexedAccess
function initial(names: string[]): string {
  const first = names[0];
  const letter = first?.[0];
  return letter ? letter.toUpperCase() : "";
}`,
    },
  ],
};
