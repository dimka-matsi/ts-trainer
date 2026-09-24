import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b8",
  region: 0,
  title: "Литералы, as const, enum",
  q: "Почему `req.method` стал `string`, а не `\"GET\"`? Чем `as const` лучше `enum`?",
  answer: "Свойства объекта TS расширяет до общего типа, потому что их можно перезаписать, поэтому `\"GET\"` стал `string`. `as const` запрещает расширение и делает всё readonly. Вместо `enum` часто берут объект `as const` и union его значений: это обычный JS без особого рантайм-кода.",
  theory: {
    p: [
      "Литеральный тип — одно конкретное значение: `\"GET\"`, `42`, `true`. Union литералов задаёт набор допустимых значений: `\"left\" | \"right\" | \"center\"`. `boolean` — это `true | false`.",
      "`const x = \"GET\"` получает тип `\"GET\"`, а `let x = \"GET\"` — `string`, потому что переменную можно перезаписать. Свойства объекта тоже расширяются: у `{ method: \"GET\" }` поле имеет тип `string`.",
      "`as const` запрещает расширение: свойства становятся `readonly` с литеральными типами, массивы превращаются в readonly-кортежи.",
      "`enum` — редкая фича TS, которая добавляет код в рантайм, а числовой enum принимает любое число. Часто вместо него используют объект `as const` и union его значений.",
    ],
    example: `declare function handle(url: string, method: "GET" | "POST"): void;

const req = { url: "/api", method: "GET" };
handle(req.url, req.method);   // ошибка: string не "GET" | "POST"

const req2 = { url: "/api", method: "GET" } as const;
handle(req2.url, req2.method); // ок

const Role = { Admin: "admin", User: "user" } as const;
type Role = (typeof Role)[keyof typeof Role]; // "admin" | "user"`,
    keys: ["`let` и свойства объектов расширяют литералы.", "`as const` сохраняет литералы и делает всё readonly.", "`enum` — рантайм-код, union литералов — нет."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `m`?",
      probe: "m",
      code: `const req = { url: "/api", method: "GET" };
const m = req.method;`,
      opts: ["\"GET\"", "string", "readonly \"GET\"", "any"],
      a: 1,
      why: "Свойство объекта можно перезаписать, поэтому TS расширяет литерал `\"GET\"` до `string`, даже если сам объект объявлен через `const`.",
    },
    {
      type: "predict",
      q: "Какой тип у `dirs`?",
      probe: "dirs",
      code: `const dirs = ["up", "down"] as const;`,
      opts: ["string[]", "(\"up\" | \"down\")[]", "readonly [\"up\", \"down\"]", "[\"up\", \"down\"]"],
      a: 2,
      why: "`as const` превращает массив в readonly-кортеж с литеральными типами элементов.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Сделай так, чтобы вызов `move(config.start)` компилировался. Можно `as const` или аннотацию, другие `as` нельзя.",
      code: `type Direction = "up" | "down" | "left" | "right";

function move(d: Direction) {
  console.log(d);
}

const config = { start: "up", speed: 2 };
move(config.start);`,
      forbid: ["any", "as", "ignore"],
      must: ["move(config.start)"],
      hint: "Свойство `start` расширилось до `string`. Запрети расширение или укажи тип.",
      solution: `type Direction = "up" | "down" | "left" | "right";

function move(d: Direction) {
  console.log(d);
}

const config = { start: "up", speed: 2 } as const;
move(config.start);`,
    },
  ],
};
