import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl2",
  region: 7,
  title: "implements и extends",
  q: "Чем `implements` отличается от `extends`?",
  answer: "`extends` — наследование: класс получает поля и методы родителя вместе с кодом и может их переопределить, родитель у класса один. `implements` — только проверка: класс обещает соответствовать форме интерфейса, но ничего от него не получает — все методы нужно написать самому. Интерфейсов можно реализовать сколько угодно. Важная тонкость: `implements` не меняет типы внутри класса — параметры методов не получают типы из интерфейса автоматически.",
  theory: {
    p: [
      "`class Dog extends Animal` — Dog наследует реализацию: поля, методы, конструктор родителя. В конструкторе наследника нужно вызвать `super(...)` до обращения к `this`. Родитель в JavaScript один.",
      "`class Duck implements Swimmer, Flyer` — Duck обещает иметь всё, что описано в интерфейсах. TypeScript проверяет обещание: если метода нет, будет ошибка. Но реализацию никто не даёт, и после компиляции от `implements` не остаётся ничего.",
      "Тонкость: `implements` только проверяет совместимость и не влияет на типы в классе. Если в интерфейсе `check(name: string): boolean`, а в классе `check(s) { … }`, параметр `s` будет неявным `any`, а не `string`. Типы в классе пишут сами.",
      "Когда что. Общий код и поведение — `extends` или лучше композиция: наследование сильно связывает классы. Контракт, который могут выполнять разные несвязанные классы, — интерфейс и `implements`. Классы тоже можно использовать как интерфейс: `implements OtherClass` проверит его публичную форму.",
    ],
    example: `interface Swimmer { swim(): void }
interface Flyer { fly(height: number): void }

class Animal {
  constructor(public name: string) {}
  move() { return this.name + " идёт"; }
}

class Duck extends Animal implements Swimmer, Flyer {
  swim() {}
  fly(height: number) {}
}

class Stone implements Swimmer {}   // ошибка: нет метода swim`,
    keys: ["`extends` наследует реализацию, родитель один, в конструкторе нужен `super()`.", "`implements` только проверяет форму, реализацию пишешь сам, интерфейсов может быть много.", "`implements` не задаёт типы параметров в методах — их пишут явно."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что класс получает от интерфейса через `implements`?",
      opts: ["Ничего, кроме проверки, что он соответствует форме", "Реализацию методов", "Типы параметров для своих методов", "Конструктор интерфейса"],
      a: 0,
      why: "Интерфейс — только описание. `implements` проверяет обещание, но не добавляет код и не выводит типы.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `m`?",
      probe: "m",
      code: `class Animal {
  constructor(public name: string) {}
  move() { return this.name + " идёт"; }
}
class Dog extends Animal {}
const m = new Dog("Шарик").move();`,
      opts: ["string", "void", "Animal", "Dog"],
      a: 0,
      why: "Dog унаследовал метод `move` вместе с реализацией, а он возвращает строку.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Класс `Circle` должен выполнять контракт `Shape`. Допиши недостающий метод: площадь круга.",
      code: `interface Shape {
  area(): number;
  name: string;
}

class Circle implements Shape {
  name = "круг";
  constructor(public r: number) {}
}`,
      runtime: [["Math.round(new Circle(1).area() * 100)", "314"]],
      forbid: ["any", "ignore"],
      hint: "Добавь `area() { return Math.PI * this.r ** 2; }`.",
      solution: `interface Shape {
  area(): number;
  name: string;
}

class Circle implements Shape {
  name = "круг";
  constructor(public r: number) {}
  area() {
    return Math.PI * this.r ** 2;
  }
}`,
    },
  ],
};
