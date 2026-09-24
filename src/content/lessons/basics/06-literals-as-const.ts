import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b8",
  region: 0,
  title: "Литералы, as const, enum",
  q: "Почему у `method` в объекте `{ method: \"GET\" }` тип `string`, а не `\"GET\"`? И чем union строк удобнее `enum`?",
  answer: "Свойство объекта потом можно перезаписать другой строкой, поэтому TypeScript даёт ему общий тип `string`. Если дописать `as const`, типы останутся точными, а свойства станут доступны только для чтения. Вместо `enum` часто пишут union строк вроде `\"light\" | \"dark\"`: он не добавляет в JavaScript никакого кода.",
  theory: {
    p: [
      "Литеральный тип — тип из одного конкретного значения: `\"GET\"`, `42`, `true`. Union литералов задаёт список допустимых значений: `\"left\" | \"right\" | \"center\"`. Тип `boolean` — это `true | false`.",
      "`const x = \"GET\"` получает тип `\"GET\"`: значение константы не изменится. `let x = \"GET\"` получает тип `string`, потому что потом туда можно записать другую строку. С полями объекта так же: у `{ method: \"GET\" }` поле имеет тип `string`.",
      "Запись `as const` после значения оставляет типы точными. Свойства получают литеральные типы и становятся доступны только для чтения, это обозначается словом `readonly`. Массив превращается в кортеж, который тоже нельзя менять.",
      "`enum` — одна из немногих конструкций TypeScript, которая остаётся в JavaScript: из неё получается объект. В числовой `enum` можно записать любую переменную типа `number`, даже если такого значения в нём нет. Поэтому вместо `enum` часто пишут union строк.",
    ],
    example: `declare function handle(url: string, method: "GET" | "POST"): void;

const req = { url: "/api", method: "GET" };
handle(req.url, req.method);   // ошибка: string не подходит под "GET" | "POST"

const req2 = { url: "/api", method: "GET" } as const;
handle(req2.url, req2.method); // можно

enum Color { Red, Green }      // в JavaScript появится объект Color
type Mode = "light" | "dark";  // в JavaScript не останется ничего`,
    keys: ["У `let` и у полей объекта литерал превращается в общий тип.", "`as const` сохраняет точные значения и запрещает запись.", "`enum` остаётся в JavaScript как объект, union строк — нет."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `m`?",
      probe: "m",
      code: `const req = { url: "/api", method: "GET" };
const m = req.method;`,
      opts: ["\"GET\"", "string", "readonly \"GET\"", "any"],
      a: 1,
      why: "В поле объекта потом можно записать другую строку, поэтому TypeScript выводит для него `string`. `const` запрещает менять саму переменную, а поля объекта менять можно.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `dirs`?",
      probe: "dirs",
      code: `const dirs = ["up", "down"] as const;`,
      opts: ["string[]", "(\"up\" | \"down\")[]", "readonly [\"up\", \"down\"]", "[\"up\", \"down\"]"],
      a: 2,
      why: "`as const` превращает массив в кортеж, который нельзя менять, и сохраняет точное значение каждого элемента.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Вызов `move(config.start)` не компилируется: у поля `start` тип `string`, а `move` принимает только четыре направления. Исправь объявление `config`: подойдёт `as const` или указание типа.",
      code: `type Direction = "up" | "down" | "left" | "right";

function move(d: Direction) {
  console.log(d);
}

const config = { start: "up", speed: 2 };
move(config.start);`,
      forbid: ["any", "as", "ignore"],
      must: ["move(config.start)"],
      hint: "Допиши `as const` после объекта или укажи у `config` тип `{ start: Direction; speed: number }`.",
      solution: `type Direction = "up" | "down" | "left" | "right";

function move(d: Direction) {
  console.log(d);
}

const config = { start: "up", speed: 2 } as const;
move(config.start);`,
    },
  ],
};
