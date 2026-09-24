import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "g5",
  region: 4,
  title: "Дженерик-интерфейсы и классы",
  q: "Как типизировать дженерик-класс, например кэш?",
  answer: "Параметры типа пишут после имени класса: `class MemoryCache<K, V>`. Они доступны в полях и методах экземпляра, а в статических членах нет: статика общая для всех вариантов класса. Параметры задают при создании, `new MemoryCache<string, number>()`, или TypeScript выводит их из аргументов конструктора.",
  theory: {
    p: [
      "Параметр типа бывает у интерфейса и у `type`: `interface Box<T> { value: T }`. При использовании его указывают явно: `Box<number>`. Из значения такой параметр не выводится.",
      "У класса параметры пишут после имени: `class MemoryCache<K, V>`. В полях и методах экземпляра `K` и `V` работают как обычные типы. Экземпляр создают так: `new MemoryCache<string, number>()`. Если параметр встречается в конструкторе, TypeScript выведет его из аргумента.",
      "Статические поля и методы не могут использовать параметры класса. Статика одна на все варианты `MemoryCache<string, number>`, `MemoryCache<number, Date>` и остальные, поэтому TypeScript выдаёт ошибку.",
      "У параметра класса бывает ограничение: `class Repo<T extends { id: number }>` принимает только типы с полем `id`, и внутри методов этим полем можно пользоваться.",
    ],
    example: `interface Box<T> { value: T }
const box: Box<number> = { value: 1 };

class MemoryCache<K, V> {
  store = new Map<K, V>();
  get(key: K): V | undefined { return this.store.get(key); }
  set(key: K, value: V) { this.store.set(key, value); }
  static empty: V;              // ошибка: статика не видит параметры класса
}
const cache = new MemoryCache<string, number>();
cache.set("a", 1);
cache.set("b", "2");            // ошибка: значение должно быть числом

class Repo<T extends { id: number }> {
  items: T[] = [];
  find(id: number) { return this.items.find((x) => x.id === id); }
}`,
    keys: ["Параметры класса пишут после имени: `class C<T>`.", "В статических членах параметры класса недоступны.", "`T extends ...` ограничивает, какие типы можно подставить."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `found`?",
      probe: "found",
      code: `class Repo<T extends { id: number }> {
  items: T[] = [];
  find(id: number) { return this.items.find((x) => x.id === id); }
}
const repo = new Repo<{ id: number; title: string }>();
const found = repo.find(1);`,
      opts: ["{ id: number; title: string; } | undefined", "{ id: number; }", "T | undefined", "{ id: number; title: string; }"],
      a: 0,
      why: "`T` подставлен при создании экземпляра. `find` у массива возвращает элемент или `undefined`, если ничего не нашлось.",
    },
    {
      type: "quiz",
      q: "Почему в классе `class Box<T>` нельзя объявить `static fallback: T`?",
      opts: [
        "Статическое поле одно на все варианты `Box<string>`, `Box<number>` и другие",
        "Статические поля вообще не могут иметь тип",
        "Нужно написать `static fallback: T | undefined`",
        "Это разрешено, ошибки не будет",
      ],
      a: 0,
      why: "Статика принадлежит самому классу, а не экземпляру. Для неё непонятно, какой из вариантов `T` подставить, поэтому TypeScript запрещает такую запись.",
      example: `class Box<T> {
  value: T;
  constructor(value: T) { this.value = value; }
  static fallback: T; // ошибка: статика не видит параметры класса
}`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Очередь `Queue` хранит элементы через `any`, и в очередь чисел можно положить строку. Сделай класс дженериком: тип элементов задаётся при создании, а `dequeue` возвращает элемент этого типа или `undefined`.",
      code: `class Queue {
  items: any[] = [];
  enqueue(item: any) { this.items.push(item); }
  dequeue(): any { return this.items.shift(); }
}`,
      tests: `const q = new Queue<number>();
q.enqueue(1);
const first = q.dequeue();
type t1 = Expect<Equal<typeof first, number | undefined>>;
// @ts-expect-error: в очередь чисел нельзя положить строку
q.enqueue("2");`,
      runtime: [["(() => { const q = new Queue(); q.enqueue(1); q.enqueue(2); return q.dequeue(); })()", "1"]],
      forbid: ["any", "as", "ignore"],
      hint: "`class Queue<T>`: массив `T[]`, параметр `item: T`, результат `T | undefined`.",
      solution: `class Queue<T> {
  items: T[] = [];
  enqueue(item: T) { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
}`,
    },
  ],
};
