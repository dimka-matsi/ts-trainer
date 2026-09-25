import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl5",
  region: 7,
  title: "Абстрактные классы и конструкторы",
  q: "Что выбрать: абстрактный класс или интерфейс? Как описать параметр «любой наследник абстрактного класса»?",
  answer: "Абстрактный класс нельзя создать через `new`: он задаёт общую реализацию и оставляет абстрактные методы, которые обязан написать наследник. Интерфейс — только форма без кода, и класс может реализовать несколько интерфейсов, а унаследовать — один класс. Если нужна общая логика — абстрактный класс, если только контракт — интерфейс. Параметр «класс-наследник» описывают через abstract construct signature: `C: abstract new () => Shape` — сюда подходит и сам абстрактный класс, и конкретные наследники, а `new () => Shape` принимает только классы, которые можно создать.",
  theory: {
    p: [
      "`abstract class Shape { abstract area(): number; describe() { … } }`. `new Shape()` — ошибка. Наследник обязан реализовать все абстрактные методы, иначе он тоже должен быть абстрактным. Обычные методы вроде `describe` наследуются с кодом и могут вызывать абстрактные.",
      "Абстрактный класс или интерфейс. Интерфейс не существует во время работы и не содержит кода, зато класс может реализовать много интерфейсов. Абстрактный класс — настоящий класс в JavaScript с общей логикой, но родитель у класса один. Правило: нужна общая реализация — абстрактный класс; нужен контракт для разных классов — интерфейс.",
      "Конструктор как значение. Тип `new () => Shape` — «что-то, что создаётся через `new` и даёт `Shape`». Абстрактный класс сюда не подходит: его создать нельзя. Если функции нужен сам класс, чтобы читать статику или наследоваться от него, пишут `abstract new () => Shape`.",
      "Class expression — класс как выражение: `const Temp = class { … }`. Им пользуются в фабриках и миксинах — функциях, которые возвращают новый класс. Об этом урок про миксины.",
    ],
    example: `abstract class Shape {
  abstract area(): number;
  describe() {
    return "Площадь: " + this.area();
  }
}

class Square extends Shape {
  constructor(private side: number) { super(); }
  area() { return this.side ** 2; }
}

const s = new Shape();                     // ошибка: класс абстрактный
function create(C: new () => Shape) { return new C(); }
function register(C: abstract new () => Shape) {}
register(Shape);
create(Shape);                             // ошибка: абстрактный нельзя создать`,
    keys: ["Абстрактный класс нельзя создать через `new`, наследник обязан реализовать абстрактные методы.", "Общая реализация — абстрактный класс, чистый контракт для разных классов — интерфейс.", "`new () => T` — создаваемый класс, `abstract new () => T` — любой, включая абстрактный."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Когда стоит выбрать абстрактный класс вместо интерфейса?",
      opts: ["Когда у наследников есть общая реализация, а не только форма", "Когда классу нужно реализовать несколько контрактов", "Когда нужен тип без кода во время работы", "Всегда: интерфейсы устарели"],
      a: 0,
      why: "Абстрактный класс даёт общий код. Интерфейс — только описание, зато их можно реализовать сколько угодно.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `d`?",
      probe: "d",
      code: `abstract class Shape {
  abstract area(): number;
  describe() { return "Площадь: " + this.area(); }
}
class Square extends Shape {
  area() { return 4; }
}
const d = new Square().describe();`,
      opts: ["string", "number", "never", "void"],
      a: 0,
      why: "`describe` унаследован от абстрактного класса и склеивает строку с числом.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "`Triangle` наследует абстрактный `Shape`, но не компилируется. Реализуй недостающий метод: площадь по основанию и высоте.",
      code: `abstract class Shape {
  abstract area(): number;
}

class Triangle extends Shape {
  constructor(public base: number, public height: number) {
    super();
  }
}`,
      runtime: [["new Triangle(4, 3).area()", "6"]],
      forbid: ["any", "ignore"],
      hint: "`area() { return (this.base * this.height) / 2; }`.",
      solution: `abstract class Shape {
  abstract area(): number;
}

class Triangle extends Shape {
  constructor(public base: number, public height: number) {
    super();
  }
  area() {
    return (this.base * this.height) / 2;
  }
}`,
    },
  ],
};
