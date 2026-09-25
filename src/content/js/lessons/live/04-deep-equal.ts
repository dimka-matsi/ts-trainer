import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc4",
  region: 9,
  title: "deepEqual и shallowEqual",
  q: "Напиши глубокое сравнение двух значений. Чем оно отличается от поверхностного?",
  answer:
    "Поверхностное сравнение проверяет только первый уровень: те же ключи и значения, равные по `Object.is`. Так сравнивают пропсы `React.memo`. Глубокое сравнение рекурсивно: если оба значения — объекты, сравниваем количество ключей и каждое значение через `deepEqual`; массив не равен объекту; даты сравниваем по времени. Примитивы сравниваем через `Object.is`, чтобы `NaN` был равен `NaN`. Отсутствующее свойство и свойство со значением `undefined` — разные, это ловится сравнением количества ключей.",
  theory: {
    p: [
      "Поверхностное сравнение (`shallowEqual`): если `Object.is(a, b)` — равны. Иначе, если оба объекты, берём ключи, сравниваем их количество и каждое значение через `Object.is`. Вложенные объекты сравниваются по ссылке. Этого достаточно для неизменяемых данных: если вложенный объект изменили правильно, у него новая ссылка.",
      "Глубокое сравнение (`deepEqual`) то же делает рекурсивно: значения свойств сравниваются снова через `deepEqual`. Детали, которые проверяют на собеседовании: `null` — не объект для этой проверки; массив и объект с теми же индексами — не равны; `{ a: undefined }` и `{}` — не равны, это видно по количеству ключей; даты равны, если равно время.",
      "Зачем это нужно: тесты (`expect(a).toEqual(b)`), сравнение состояния, кэш по аргументам. Глубокое сравнение дорогое, поэтому в горячем коде его избегают и полагаются на неизменяемость и сравнение ссылок.",
    ],
    code: `function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((key) => Object.hasOwn(b, key) && Object.is(a[key], b[key]));
}

console.log(shallowEqual({ a: 1 }, { a: 1 }));             // true
console.log(shallowEqual({ a: { b: 1 } }, { a: { b: 1 } })); // false — вложенные по ссылке
const inner = { b: 1 };
console.log(shallowEqual({ a: inner }, { a: inner }));     // true — ссылка та же`,
    keys: [
      "Поверхностное: первый уровень через `Object.is`. Так работает `React.memo`.",
      "Глубокое: рекурсия по ключам, количество ключей, массив ≠ объект, даты — по времени, `NaN` равен `NaN`.",
      "Глубокое сравнение дорогое — в горячем коде полагаются на неизменяемость и ссылки.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `deepEqual(a, b)`: сравнивает примитивы через `Object.is`, массивы и обычные объекты — рекурсивно по ключам, даты — по времени. Массив не равен объекту.",
      code: `function deepEqual(a, b) {
  return a === b;
}`,
      tests: [
        ["deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })", "true"],
        ["deepEqual({ a: 1 }, { a: 1, b: undefined })", "false"],
        ["deepEqual([1, 2], { 0: 1, 1: 2 })", "false"],
        ["deepEqual(NaN, NaN)", "true"],
        ["deepEqual(new Date(0), new Date(0))", "true"],
        ["deepEqual(null, {})", "false"],
        ["deepEqual({ a: 1 }, { b: 1 })", "false"],
      ],
      solution: `function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;
  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;
  return keysA.every((key) => Object.hasOwn(b, key) && deepEqual(a[key], b[key]));
}`,
      hint: "Возьми `shallowEqual` из теории и замени сравнение значений на рекурсивный `deepEqual`. Добавь две проверки: даты и «оба массива или оба не массивы».",
    },
    {
      type: "quiz",
      q: "Почему `React.memo` сравнивает пропсы поверхностно, а не глубоко?",
      opts: [
        "Глубокое сравнение дорогое, а при неизменяемых обновлениях новая ссылка и так означает изменение",
        "Глубокое сравнение невозможно в JavaScript",
        "Поверхностное сравнение точнее",
        "React не умеет рекурсию",
      ],
      a: 0,
      why: "Если данные меняют через копии, сравнения ссылок достаточно. Глубокий обход большого объекта на каждом рендере съел бы весь выигрыш от мемоизации.",
    },
  ],
};
