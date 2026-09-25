import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl1",
  region: 7,
  title: "Поля, конструкторы и parameter properties",
  q: "Почему TypeScript требует инициализировать поля класса? Что делает `constructor(private x: number)`?",
  answer: "В строгом режиме флаг `strictPropertyInitialization` проверяет, что каждое поле без `undefined` в типе получает значение — при объявлении или в конструкторе. Иначе поле может оказаться `undefined`, хотя тип обещает строку. Если поле заполняет фреймворк или метод инициализации, пишут `!` — «поверь, будет назначено», но это обещание без проверки. Parameter properties — сокращение: модификатор у параметра конструктора (`private`, `public`, `readonly`) сразу объявляет поле и присваивает ему аргумент.",
  theory: {
    p: [
      "Поля класса объявляют с типом: `name: string`. В строгом режиме каждое поле должно получить значение — при объявлении `count = 0` или в конструкторе `this.name = name`. Иначе ошибка: поле без значения во время работы будет `undefined`.",
      "Варианты, если значение появится позже: сделать тип честным — `user?: User` или `User | null` — или написать `user!: User` (definite assignment). Второе — обещание без проверки, как `!` у переменных: если его нарушить, ошибка случится во время работы.",
      "Parameter properties: `constructor(private readonly repo: Repo, public name: string) {}` — одна строка объявляет поля `repo` и `name` и присваивает им аргументы. Модификаторы — `public`, `private`, `protected`, `readonly`. `private` значит, что поле доступно только внутри класса; модификаторы доступа подробнее — в уроке про них.",
      "Parameter properties — синтаксис только TypeScript, он создаёт код при компиляции. Поэтому его запрещает флаг `erasableSyntaxOnly` (TypeScript 5.8), который нужен для запуска `.ts` в Node без сборки, — об этом регион «Компилятор и проект».",
    ],
    example: `class User {
  name: string;
  age: number;                     // ошибка: поле не инициализировано
  constructor(name: string) {
    this.name = name;
  }
}

class Service {
  constructor(private readonly url: string, public retries = 3) {}
  describe() {
    return this.url + " x" + this.retries;
  }
}
const s = new Service("/api");
s.url;                             // ошибка: private`,
    keys: ["`strictPropertyInitialization`: поле без `undefined` в типе должно получить значение при объявлении или в конструкторе.", "Если значение появится позже — честный `?` или `| null`; `!` — обещание без проверки.", "Parameter properties `constructor(private x: number)` объявляют и присваивают поле в одну строку."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `y`?",
      probe: "y",
      code: `class P {
  constructor(private x: number, public readonly y: number) {}
}
const p = new P(1, 2);
const y = p.y;`,
      opts: ["number", "2", "readonly number", "number | undefined"],
      a: 0,
      why: "`public readonly y: number` в параметре объявил поле типа `number`. `readonly` запрещает запись, но не меняет тип.",
    },
    {
      type: "quiz",
      q: "Что делает `constructor(private readonly repo: Repo) {}`?",
      opts: ["Объявляет приватное поле только для чтения `repo` и присваивает ему аргумент", "Только объявляет параметр конструктора", "Создаёт статическое поле", "Ничего: без тела конструктора поле не появится"],
      a: 0,
      why: "Модификатор у параметра — это parameter property: объявление поля и присваивание в одном месте.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Поле `lastLogin` заполняется только после входа. Сделай его тип честным, чтобы класс компилировался без `!`.",
      code: `class Session {
  userId: number;
  lastLogin: Date;
  constructor(userId: number) {
    this.userId = userId;
  }
}`,
      tests: `const s = new Session(1);
const d: Date | undefined = s.lastLogin;`,
      forbid: ["any", "nonnull", "ignore"],
      hint: "Сделай поле необязательным: `lastLogin?: Date`.",
      solution: `class Session {
  userId: number;
  lastLogin?: Date;
  constructor(userId: number) {
    this.userId = userId;
  }
}`,
    },
  ],
};
