import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u8",
  region: 5,
  title: "Строковые утилиты",
  q: "Какие строковые утилиты есть в TypeScript и где они полезны?",
  answer: "`Uppercase`, `Lowercase`, `Capitalize` и `Uncapitalize` меняют регистр литеральных строковых типов и реализованы внутри компилятора. Полезны вместе с template literal types, например для генерации имён `onClick` или `getName` в mapped types.",
  theory: {
    p: [
      "`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` меняют регистр строковых литеральных типов. Реализованы внутри компилятора (intrinsic), написать их самому нельзя.",
      "Сами по себе они редки, но в связке с template literal types генерируют имена: `on${Capitalize<E>}` из `\"click\"` даёт `\"onClick\"`, `get${Capitalize<K>}` — имена геттеров.",
      "На union они работают по каждому члену: `Uppercase<\"a\" | \"b\">` — `\"A\" | \"B\"`.",
    ],
    example: `type U = Uppercase<"hello">;               // "HELLO"
type C = Capitalize<"click" | "focus">;    // "Click" | "Focus"

type Handlers<E extends string> = {
  [K in E as \`on\${Capitalize<K>}\`]: () => void;
};
type H = Handlers<"click" | "hover">;`,
    keys: ["Четыре intrinsic-утилиты регистра.", "Раскрываются в полную силу с template literal types.", "Работают по каждому члену union."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `T`?",
      probe: "T",
      code: `type T = \`on\${Capitalize<"click" | "scroll">}\`;`,
      opts: ["\"onclick\" | \"onscroll\"", "\"onClick\" | \"onScroll\"", "`on${string}`", "\"onClick\""],
      a: 1,
      why: "Template literal type раскладывается по каждому члену union, а `Capitalize` делает первую букву заглавной.",
    },
    {
      type: "predict",
      q: "Какой тип у `T`?",
      probe: "T",
      code: `type T = Lowercase<"ABC" | "Def">;`,
      opts: ["\"abc\" | \"def\"", "\"abc\" | \"Def\"", "string", "\"aBC\" | \"def\""],
      a: 0,
      why: "`Lowercase` применяется к каждому члену union и переводит всю строку в нижний регистр.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `Getters<T>`: для каждого поля `name` — метод `getName(): тип поля`.",
      code: `type Getters<T> = unknown;`,
      tests: `type User = { name: string; age: number };
type t1 = Expect<Equal<Getters<User>, { getName: () => string; getAge: () => number }>>;`,
      forbid: ["any", "ignore"],
      hint: "Key remapping: `[K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]`.",
      solution: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K];
};`,
    },
  ],
};
