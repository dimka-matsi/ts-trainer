import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b7",
  region: 0,
  title: "Type assertions",
  q: "Когда можно использовать `as` и что означает `as unknown as T`?",
  answer: "`as T` сообщает компилятору тип, который он сам определить не может, например конкретный вид элемента из `getElementById`. Во время работы программы ничего не проверяется и не преобразуется. `as unknown as T` позволяет записать любой тип в любой, без проверки совместимости. На ревью такое обычно просят переделать: это значит, что типы описаны неверно.",
  theory: {
    p: [
      "`значение as T` говорит компилятору: считай, что здесь тип `T`. Это нужно, когда программист знает больше компилятора. Например, `document.getElementById(\"main\")` возвращает общий `HTMLElement`, а на странице там точно `canvas`. Никакой проверки или преобразования при этом не происходит.",
      "TypeScript разрешает `as` только между связанными типами: к более узкому или более широкому. `\"hello\" as number` — ошибка, строка и число не пересекаются. Через `unknown` запрет можно обойти: `\"hello\" as unknown as number` скомпилируется, но тип будет неверным.",
      "Восклицательный знак после значения, `x!`, тоже утверждение: он говорит, что `null` и `undefined` здесь нет. Он тоже ничего не проверяет. Если значение всё-таки `null`, программа упадёт.",
      "Законное применение `as` — брендированные типы. `type UserId = string & { readonly __brand: \"UserId\" }` нельзя получить из обычной строки без `as`. Строку превращают в `UserId` в одной функции, которая её проверяет. После этого `UserId` и `OrderId` нельзя перепутать, хотя оба — строки.",
    ],
    example: `const canvas = document.getElementById("main") as HTMLCanvasElement;

const x = "hello" as number;            // ошибка: типы не пересекаются
const y = "hello" as unknown as number; // компилируется, но тип неверный

function len(s?: string | null) {
  return s!.length;                     // упадёт, если s не передали
}

type UserId = string & { readonly __brand: "UserId" };
const toUserId = (raw: string) => raw as UserId;`,
    keys: ["`as` не проверяет и не преобразует данные.", "Между несвязанными типами одного `as` недостаточно, и это сигнал о проблеме.", "`!` скрывает возможный `null`, а не убирает его."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `el`?",
      probe: "el",
      code: `const el = document.getElementById("app");`,
      opts: ["HTMLElement", "HTMLElement | null", "Element", "HTMLElement | undefined"],
      a: 1,
      why: "Элемента с таким `id` на странице может не быть. Тогда метод вернёт `null`, поэтому он и указан в типе.",
    },
    {
      type: "quiz",
      q: "Написано `const n = JSON.parse(text) as number`, а в `text` лежит строка `'\"abc\"'`. Что будет во время работы программы?",
      opts: ["Ничего особенного: в `n` окажется строка `\"abc\"`", "Бросится TypeError", "`n` станет `NaN`", "Сработает проверка типа из `as`"],
      a: 0,
      why: "`as` удаляется при компиляции вместе с типами. В `n` окажется строка, хотя компилятор считает её числом. Ошибка проявится позже, там, где с `n` обратятся как с числом.",
      example: `const text = '"abc"';
const n = JSON.parse(text) as number;
n.toFixed(2); // компилируется, но при запуске упадёт: у строки нет toFixed`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "Убери `as` и `!`. `nameLength` должна вернуть длину имени или 0, если имени нет. `parseAge` должна вернуть число, если пришло число, и 0 во всех остальных случаях.",
      code: `type User = { name?: string | null };

function nameLength(u: User): number {
  return u.name!.length;
}

function parseAge(input: unknown): number {
  return input as number;
}`,
      runtime: [["nameLength({})", "0"], ["nameLength({ name: \"Ann\" })", "3"], ["parseAge(\"5\")", "0"], ["parseAge(7)", "7"]],
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "Для имени подойдут `?.` и `??`. Для возраста проверь `typeof input === \"number\"`.",
      solution: `type User = { name?: string | null };

function nameLength(u: User): number {
  return u.name?.length ?? 0;
}

function parseAge(input: unknown): number {
  return typeof input === "number" ? input : 0;
}`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Сейчас в `loadUser` можно передать любую строку. Сделай `UserId` брендированным типом, чтобы строку можно было передать только через `toUserId`. Внутри `toUserId` `as` разрешён.",
      code: `type UserId = string;

function toUserId(raw: string): UserId {
  return raw;
}

function loadUser(id: UserId) {
  return id;
}`,
      tests: `// @ts-expect-error: обычная строка не должна подходить
loadUser("u1");
loadUser(toUserId("u1"));`,
      forbid: ["any"],
      hint: "`type UserId = string & { readonly __brand: \"UserId\" }`, а в `toUserId` верни `raw as UserId`.",
      solution: `type UserId = string & { readonly __brand: "UserId" };

function toUserId(raw: string): UserId {
  return raw as UserId;
}

function loadUser(id: UserId) {
  return id;
}`,
    },
  ],
};
