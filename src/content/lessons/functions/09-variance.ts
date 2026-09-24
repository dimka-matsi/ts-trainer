import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f8",
  region: 2,
  title: "Ковариантность и контравариантность",
  q: "Что такое вариантность и почему параметры методов бивариантны?",
  answer: "Вариантность — правило, как отношение «подтип» переносится с частей на составной тип. Результат функции ковариантен: где ждут функцию, возвращающую `Animal`, подойдёт функция, возвращающая `Dog`. Параметры при `strictFunctionTypes` контравариантны: где ждут обработчик собак, подойдёт обработчик любых животных, но не наоборот. Параметры методов и массивы проверяются в обе стороны ради совместимости со старым кодом, поэтому часть ошибок TypeScript пропускает.",
  theory: {
    p: [
      "Пусть `Dog` — подтип `Animal`: собаку можно передать туда, где ждут животное. Вариантность описывает, как это правило переносится на составные типы, например на функции `() => Dog` и `(d: Dog) => void`.",
      "Результат функции ковариантен: функция, которая возвращает `Dog`, подходит туда, где ждут `Animal`. Направление подтипов сохраняется.",
      "Параметры контравариантны: обработчик `(a: Animal) => void` подходит туда, где ждут `(d: Dog) => void`, потому что умеет больше. Наоборот нельзя: обработчику собак могут передать кошку. Так проверяет флаг `strictFunctionTypes` из `strict`.",
      "Исключение — методы, записанные как `handle(x: Dog): void`. Их параметры проверяются в обе стороны (бивариантно), как и массивы, и TypeScript пропускает часть ошибок. Поэтому колбэки в своих типах лучше описывать свойством-функцией: `handle: (x: Dog) => void`.",
    ],
    example: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

const makeDog = () => new Dog();
const makeAnimal: () => Animal = makeDog;       // ок: результат ковариантен

const onAnimal = (a: Animal) => {};
const onDog: (d: Dog) => void = onAnimal;       // ок: параметр контравариантен
const bad: (a: Animal) => void = (d: Dog) => d.bark(); // ошибка

// Метод проверяется бивариантно
type WithMethod = { handle(a: Animal): void };
const m: WithMethod = { handle(d: Dog) { d.bark(); } }; // компилируется!

// Свойство-функция проверяется строго
type WithProp = { handle: (a: Animal) => void };
const p: WithProp = { handle: (d: Dog) => d.bark() };   // ошибка`,
    keys: ["Результат функции ковариантен.", "Параметры функций контравариантны при `strictFunctionTypes`.", "Параметры методов проверяются слабее: колбэки описывай свойством-функцией."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `pet`?",
      probe: "pet",
      code: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

const makeAnimal: () => Animal = () => new Dog();
const pet = makeAnimal();`,
      opts: ["Dog", "Animal", "Animal | Dog", "never"],
      a: 1,
      why: "Функцию, которая создаёт `Dog`, можно записать туда, где ждут функцию, возвращающую `Animal`: результат ковариантен. Но тип переменной `makeAnimal` — `() => Animal`, поэтому и результат вызова `Animal`.",
    },
    {
      type: "quiz",
      q: "У параметра тип `(d: Dog) => void`. Какую функцию в него можно передать?",
      opts: [
        "`(a: Animal) => void`",
        "`(p: Puppy) => void`, где `Puppy extends Dog`",
        "Оба варианта",
        "Ни один",
      ],
      a: 0,
      why: "Функция, которая умеет обрабатывать любое животное, справится и с собакой. Обработчику щенков может прийти взрослая собака без полей `Puppy`.",
      example: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }
class Puppy extends Dog { play() {} }

function walk(handler: (d: Dog) => void) {
  handler(new Dog());
}
walk((a: Animal) => a.name);   // можно
walk((p: Puppy) => p.play());  // ошибка: у Dog нет play`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`admit` в типе `Shelter` описан как метод, поэтому TypeScript разрешает записать туда функцию, которая принимает только собак. Перепиши `Shelter` так, чтобы такая подмена давала ошибку.",
      code: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

type Shelter = {
  admit(a: Animal): void;
};`,
      tests: `const ok: Shelter = { admit: (a: Animal) => a.name };
// @ts-expect-error: приют для собак не принимает любых животных
const dogsOnly: Shelter = { admit: (d: Dog) => d.bark() };`,
      forbid: ["any", "as", "ignore"],
      must: ["type Shelter"],
      hint: "Свойство-функция `admit: (a: Animal) => void` проверяется строже, чем метод.",
      solution: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

type Shelter = {
  admit: (a: Animal) => void;
};`,
    },
  ],
};
