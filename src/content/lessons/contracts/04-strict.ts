import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct4",
  region: 8,
  title: "Что включает strict",
  q: "Что включает флаг `strict` и почему его включают всегда?",
  answer: "`strict` — одна настройка, которая включает семейство строгих проверок: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict` и с TypeScript 5.6 `strictBuiltinIteratorReturn`. Без них TypeScript пропускает целые классы ошибок: неявный `any`, забытую проверку на `null`, неверные колбэки. Новые строгие проверки команда TypeScript добавляет в `strict`, поэтому проект с `strict: true` получает их при обновлении. Отдельные проверки можно выключить, но обычно наоборот — добавляют флаги сверх `strict`.",
  theory: {
    p: [
      "Без `strict` TypeScript помогает меньше, чем кажется. Параметр без типа молча становится `any`. `null` и `undefined` подходят к любому типу, и `arr.find(…)` возвращает `number` без `undefined`. Колбэк с неверным параметром проходит проверку. Код компилируется, а ошибки всплывают во время работы.",
      "Что входит: `noImplicitAny` — ошибка на неявный `any`; `strictNullChecks` — `null` и `undefined` отдельные типы; `strictFunctionTypes` — параметры функций проверяются правильно (контравариантно); `strictBindCallApply` — типизация `bind`, `call`, `apply`; `strictPropertyInitialization` — поля класса должны быть инициализированы; `noImplicitThis` — ошибка на `this: any`; `useUnknownInCatchVariables` — `unknown` в `catch`; `alwaysStrict` — режим `\"use strict\"`; `strictBuiltinIteratorReturn` — точный тип `return` у встроенных итераторов.",
      "`strict: true` — это «включи всё строгое, в том числе то, что появится в будущих версиях». Поэтому обновление TypeScript иногда приносит новые ошибки: это новые проверки, а не поломка. Выключить одну можно явно: `\"strict\": true, \"strictPropertyInitialization\": false`.",
      "Миграция старого проекта: включают флаги по одному, начиная с `noImplicitAny` и `strictNullChecks`, и чинят ошибки по модулям. В новом проекте `strict` включают с первого дня. В этом тренажёре все примеры проверяются в строгом режиме; строка `// @flags:` в начале примера меняет флаги только для него.",
    ],
    example: `function greet(name) {           // ошибка: неявный any (noImplicitAny)
  return "Привет, " + name;
}

let title: string = null;         // ошибка: null отдельный тип (strictNullChecks)

const nums = [1, 2];
const found = nums.find((n) => n > 5);
const doubled = found * 2;        // ошибка: found может быть undefined`,
    keys: ["`strict` включает семейство проверок: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes` и другие.", "Новые строгие проверки попадают в `strict`, поэтому обновление TypeScript может принести новые ошибки.", "Старый проект переводят по флагу за раз, новый начинают сразу со `strict: true`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `x`, если `strictNullChecks` выключен?",
      probe: "x",
      code: `// @flags: strictNullChecks=false
const arr = [1, 2];
const x = arr.find((n) => n > 5);`,
      opts: ["number", "number | undefined", "undefined", "any"],
      a: 0,
      why: "Без `strictNullChecks` `undefined` входит в любой тип и не показывается, поэтому о возможном «не нашли» компилятор молчит.",
    },
    {
      type: "quiz",
      q: "Какой флаг НЕ включается вместе со `strict`?",
      opts: ["`noUncheckedIndexedAccess`", "`strictNullChecks`", "`noImplicitAny`", "`useUnknownInCatchVariables`"],
      a: 0,
      why: "`noUncheckedIndexedAccess` слишком сильно меняет код, поэтому его включают отдельно. О нём и других флагах сверх `strict` — следующий урок.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "В строгом режиме функция не компилируется: у параметра неявный `any`. Опиши тип параметра — массив объектов с числовым полем `price`.",
      code: `function total(items) {
  return items.reduce((sum, x) => sum + x.price, 0);
}`,
      tests: `const t: number = total([{ price: 10 }, { price: 5 }]);
// @ts-expect-error — строка вместо числа
total([{ price: "10" }]);`,
      runtime: [["total([{ price: 10 }, { price: 5 }])", "15"]],
      forbid: ["any", "ignore"],
      hint: "`items: { price: number }[]`.",
      solution: `function total(items: { price: number }[]) {
  return items.reduce((sum, x) => sum + x.price, 0);
}`,
    },
  ],
};
