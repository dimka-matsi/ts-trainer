import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl6",
  region: 7,
  title: "Геттеры, сеттеры и static",
  q: "Как типизируются `get`/`set` и статические члены класса? Почему статика не видит параметры типа класса?",
  answer: "Геттер и сеттер описывают свойство, которое вычисляется при чтении и проверяется при записи. Если есть только `get`, свойство автоматически `readonly`. С TypeScript 5.1 типы геттера и сеттера могут различаться: сеттер принимает `string | number`, а геттер отдаёт `number`. Статические члены принадлежат самому классу, а не экземплярам, поэтому не видят параметр типа `T`: `T` у каждого экземпляра свой, а статика одна на всех. Блок `static { … }` выполняет код инициализации класса.",
  theory: {
    p: [
      "`get celsius() { … }` и `set celsius(v) { … }` — свойство с логикой. Снаружи это обычное чтение и запись: `t.celsius = 20`. Если сеттера нет, TypeScript сделает свойство только для чтения, и запись будет ошибкой.",
      "Типы геттера и сеттера. Раньше они обязаны были совпадать. С TypeScript 5.1 могут быть разными, если тип геттера подходит под тип сеттера: например, `set size(v: string | number)` и `get size(): number` — принимаем строку, храним число.",
      "`static` — член самого класса: `Counter.count`, `Config.load()`. Статике не доступен `this` экземпляра. Параметр типа класса `Box<T>` статика видеть не может: `Box<string>` и `Box<number>` — один и тот же класс во время работы, и статическое поле у них одно.",
      "`static { … }` (ES2022) — блок, который выполняется один раз при создании класса: заполнить статическую таблицу, прочитать настройки. `static` сочетается с `private`, `readonly` и `#`: `static #instances = 0`.",
    ],
    example: `class Temperature {
  #c = 0;
  get celsius() { return this.#c; }
  set celsius(v: number) {
    if (v < -273.15) throw new Error("Ниже абсолютного нуля");
    this.#c = v;
  }
  get fahrenheit() { return this.#c * 1.8 + 32; }
}

const t = new Temperature();
t.celsius = 20;
t.fahrenheit = 100;                 // ошибка: только геттер

class Box<T> {
  static empty: T;                  // ошибка: статика не видит T
  static count = 0;
  static { Box.count = 1; }
}`,
    keys: ["`get`/`set` — свойство с логикой, без сеттера оно только для чтения.", "С TypeScript 5.1 типы геттера и сеттера могут различаться.", "`static` — член класса, а не экземпляра, и не видит параметр типа класса; `static { }` — инициализация класса."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `f`?",
      probe: "f",
      code: `class Temperature {
  #c = 0;
  get fahrenheit() { return this.#c * 1.8 + 32; }
}
const f = new Temperature().fahrenheit;`,
      opts: ["number", "() => number", "void", "string"],
      a: 0,
      why: "Геттер снаружи выглядит как обычное свойство, его тип — тип результата геттера.",
    },
    {
      type: "quiz",
      q: "Почему статическое поле не может иметь тип `T` дженерик-класса `Box<T>`?",
      opts: ["Статика одна на весь класс, а `T` у каждого экземпляра свой", "Статические поля не бывают типизированы", "`T` доступен только в конструкторе", "Это ограничение старых версий"],
      a: 0,
      why: "`Box<string>` и `Box<number>` — один класс во время работы, и статическое поле у них общее.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Добавь свойство `size`: сеттер принимает число или строку вроде `\"42\"` и сохраняет число, геттер отдаёт число.",
      code: `class Font {
  #size = 16;
}`,
      tests: `const f = new Font();
f.size = "20";
f.size = 18;
const n: number = f.size;`,
      runtime: [["(() => { const f = new Font(); f.size = '20'; return f.size; })()", "20"]],
      forbid: ["any", "as", "ignore"],
      hint: "`get size(): number { return this.#size; }` и `set size(v: number | string) { this.#size = Number(v); }`.",
      solution: `class Font {
  #size = 16;
  get size(): number {
    return this.#size;
  }
  set size(v: number | string) {
    this.#size = Number(v);
  }
}`,
    },
  ],
};
