import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g7",
  region: 4,
  title: "Классы в дженериках и аннотации in/out",
  q: "Как принять класс параметром дженерик-функции и зачем аннотации `in` и `out` у параметров типа?",
  answer: "Класс передают как значение с construct signature: `create<T>(C: new () => T): T`, и `T` выводится из переданного класса. Аннотации `in` и `out` (TypeScript 4.7) явно задают вариантность: `out T` — параметр только в выходных позициях, `in T` — только во входных. Компилятор проверяет, что объявление им соответствует, и быстрее сравнивает такие типы.",
  theory: {
    p: [
      "Класс в JavaScript — значение, которое можно передать в функцию. Его тип описывает construct signature `new () => T`. В дженерике `create<T>(C: new () => T): T` параметр `T` выводится из класса: `create(Dog)` возвращает `Dog`.",
      "Ограничение работает и здесь: `create<T extends Animal>(C: new () => T)` принимает только классы, которые создают животных. Если конструктору нужны аргументы, их описывают в сигнатуре: `new (name: string) => T`.",
      "Обычно вариантность параметра типа TypeScript вычисляет сам. Её можно указать явно: `interface Producer<out T> { get(): T }` — `T` только возвращается, `interface Consumer<in T> { accept: (x: T) => void }` — только принимается. Если объявление противоречит аннотации, будет ошибка TS2636.",
      "Аннотации нужны редко: для документации, для сложных рекурсивных типов и чтобы ускорить проверку в больших библиотеках. Параметры, описанные как метод `accept(x: T): void`, проверяются в обе стороны, поэтому для точной проверки используют свойство-функцию.",
    ],
    example: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

function create<T extends Animal>(C: new () => T): T {
  return new C();
}
const d = create(Dog);        // Dog
d.bark();

interface Producer<out T> { get(): T }
interface Consumer<in T> { accept: (x: T) => void }

declare const dogs: Producer<Dog>;
const animals: Producer<Animal> = dogs;  // можно: out — ковариантность

interface Wrong<in T> { get(): T }       // ошибка: T возвращается, а помечен in`,
    keys: ["Класс передают как `C: new () => T`.", "`out T` — только выход, `in T` — только вход.", "Аннотации проверяются компилятором, но нужны редко."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `d`?",
      probe: "d",
      code: `class Dog { bark() {} }
function create<T>(C: new () => T) {
  return new C();
}
const d = create(Dog);`,
      opts: ["Dog", "typeof Dog", "new () => Dog", "unknown"],
      a: 0,
      why: "`T` выведен из класса `Dog` через construct signature. `new C()` создаёт экземпляр, поэтому результат — `Dog`, а не сам класс `typeof Dog`.",
    },
    {
      type: "quiz",
      q: "Какое объявление даст ошибку из-за аннотации вариантности?",
      opts: [
        "`interface Source<in T> { read: () => T }`",
        "`interface Source<out T> { read: () => T }`",
        "`interface Sink<in T> { write: (x: T) => void }`",
        "Ни одно",
      ],
      a: 0,
      why: "`T` возвращается из `read`, то есть стоит в выходной позиции. Для этого подходит `out`, а `in` противоречит использованию.",
      example: `interface Source<in T> { read: () => T }       // ошибка: T на выходе, а помечен in
interface SourceOk<out T> { read: () => T }
interface Sink<in T> { write: (x: T) => void }`,
    },
    {
      type: "code",
      kind: "fix",
      goal: "`Handler` принимает значение, но параметр типа помечен как `out`, и компилятор сообщает об ошибке. Исправь аннотацию так, чтобы обработчик любых животных можно было использовать как обработчик собак.",
      code: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

interface Handler<out T> {
  handle: (value: T) => void;
}`,
      tests: `declare const animalHandler: Handler<Animal>;
const dogHandler: Handler<Dog> = animalHandler;
declare const onlyDogs: Handler<Dog>;
// @ts-expect-error: обработчик собак не справится с любым животным
const forAll: Handler<Animal> = onlyDogs;`,
      forbid: ["any", "as", "ignore"],
      must: ["handle: (value: T) => void;"],
      hint: "Параметр только принимается, значит, он входной: `interface Handler<in T>`.",
      solution: `class Animal { name = "a"; }
class Dog extends Animal { bark() {} }

interface Handler<in T> {
  handle: (value: T) => void;
}`,
    },
  ],
};
