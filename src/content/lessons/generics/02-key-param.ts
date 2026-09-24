import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g2",
  region: 4,
  title: "Параметр-ключ K extends keyof T",
  q: "Как типизировать функцию `getValue(obj, key)`, чтобы результат имел тип поля?",
  answer: "Нужны два параметра типа: `T` для объекта и `K extends keyof T` для ключа. Ограничение не даёт передать имя, которого нет в объекте, а результат `T[K]` — тип именно этого поля. Оба параметра TypeScript выводит из аргументов.",
  theory: {
    p: [
      "Ограничение параметра типа может ссылаться на другой параметр. `K extends keyof T` значит, что `K` — одно из имён полей `T`.",
      "Функция `getValue<T, K extends keyof T>(obj: T, key: K): T[K]` принимает объект и имя его поля. При вызове `getValue(user, \"age\")` TypeScript выводит `T` из объекта, а `K` — как литерал `\"age\"`. Поэтому результат получает тип `number`.",
      "Если описать параметр просто как `key: keyof T`, результатом станет union типов всех полей. Отдельный параметр `K` запоминает, какой именно ключ передали, и тип результата получается точным.",
      "Так же типизируют функции, которые получают имя поля аргументом: сортировку по полю, `setValue`, выбор нескольких полей объекта.",
    ],
    example: `function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { name: "Ann", age: 30 };
const age = getValue(user, "age");   // number
const name = getValue(user, "name"); // string
getValue(user, "email");             // ошибка: такого поля нет

function getLoose<T>(obj: T, key: keyof T) {
  return obj[key];
}
const x = getLoose(user, "age");     // string | number`,
    keys: ["`K extends keyof T` — ключ из полей `T`.", "Результат `T[K]` — тип именно этого поля.", "С `key: keyof T` результат — union типов всех полей."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `x`?",
      probe: "x",
      code: `function getLoose<T>(obj: T, key: keyof T) {
  return obj[key];
}
const user = { name: "Ann", age: 30 };
const x = getLoose(user, "age");`,
      opts: ["number", "string | number", "string", "unknown"],
      a: 1,
      why: "Параметр `key` описан как любое имя поля, конкретный ключ не запоминается. Поэтому результат — union типов всех полей: `string | number`.",
    },
    {
      type: "quiz",
      q: "Есть `function setValue<T, K extends keyof T>(obj: T, key: K, value: T[K])` и `const user = { name: \"Ann\", age: 30 }`. Какой вызов не скомпилируется?",
      opts: ["`setValue(user, \"age\", \"30\")`", "`setValue(user, \"age\", 31)`", "`setValue(user, \"name\", \"Bob\")`", "Все скомпилируются"],
      a: 0,
      why: "Для ключа `\"age\"` значение должно иметь тип `user[\"age\"]`, то есть `number`. Строка `\"30\"` не подходит.",
      example: `function setValue<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
  obj[key] = value;
}
const user = { name: "Ann", age: 30 };
setValue(user, "age", 31);
setValue(user, "age", "30"); // ошибка: для age нужно число`,
    },
    {
      type: "code",
      kind: "write",
      goal: "`sortBy` сортирует массив объектов по полю. Сейчас всё описано через `any`, и опечатка в имени поля не ловится. Сделай функцию дженериком: ключ должен быть именем поля элементов, а результат — массивом того же типа.",
      code: `function sortBy(items: any[], key: any): any[] {
  return [...items].sort((a, b) => (a[key] > b[key] ? 1 : -1));
}`,
      tests: `const users = [{ name: "Bob", age: 30 }, { name: "Ann", age: 25 }];
const sorted = sortBy(users, "age");
type t1 = Expect<Equal<typeof sorted, { name: string; age: number }[]>>;
// @ts-expect-error: такого поля нет
sortBy(users, "email");`,
      runtime: [["sortBy([{ a: 2 }, { a: 1 }], \"a\")", "[{\"a\":1},{\"a\":2}]"]],
      forbid: ["any", "as", "ignore"],
      hint: "Два параметра типа: `T` для элемента и `K extends keyof T` для ключа. Массив — `T[]`.",
      solution: `function sortBy<T, K extends keyof T>(items: T[], key: K): T[] {
  return [...items].sort((a, b) => (a[key] > b[key] ? 1 : -1));
}`,
    },
  ],
};
