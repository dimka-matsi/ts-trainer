import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b6",
  region: 0,
  title: "type и interface",
  q: "Чем `type` отличается от `interface` и что выбрать?",
  answer: "`interface` описывает только объекты, и одноимённые интерфейсы сливаются в один. Этим пользуются, чтобы дополнить типы библиотеки. `type` может назвать любой тип: union, кортеж, функцию. При расширении `extends` сразу сообщает о конфликте полей, а пересечение `&` без ошибки делает такое поле типом `never`.",
  theory: {
    p: [
      "`type` даёт имя любому типу: объекту, union, кортежу, функции. Такое имя называют type alias. `interface` описывает только объекты.",
      "Главное отличие в том, что интерфейс можно дополнить. Два объявления `interface Box` сливаются в одно, это называется declaration merging. Так добавляют поля в типы библиотек. Второй `type` с тем же именем даст ошибку.",
      "Интерфейс расширяют через `interface B extends A`, а у `type` для этого есть пересечение `A & B`: объект должен подходить под оба типа. Если в `A` поле `id: string`, а в `B` — `id: number`, `extends` сразу выдаст ошибку. Пересечение ошибки не даст, а поле получит тип `never`. Это тип, у которого нет ни одного значения.",
      "Alias — только другое имя для типа: `type UserId = string` не создаёт новый тип, и любую строку можно передать как `UserId`. Handbook советует брать `interface` для объектов, а `type` — когда нужен union или кортеж.",
    ],
    example: `interface Animal { name: string }
interface Bear extends Animal { honey: boolean }

type Point = { x: number; y: number };
type ID = number | string;        // interface так не умеет

interface Box { width: number }
interface Box { height: number }  // слияние: у Box оба поля
const box: Box = { width: 1, height: 2 };`,
    keys: ["`type` называет любой тип, `interface` — только объекты.", "Одноимённые интерфейсы сливаются, два `type` с одним именем — ошибка.", "Конфликт полей в `&` даёт `never`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `type A = { id: string } & { id: number };
declare const a: A;
const r = a.id;`,
      opts: ["string | number", "never", "string", "number"],
      a: 1,
      why: "Пересечение объединяет требования: `id` должен быть одновременно строкой и числом. Таких значений нет, поэтому у поля тип `never`.",
    },
    {
      type: "quiz",
      q: "В одном файле написано `interface Box { width: number }` и ниже `interface Box { height: number }`. Что получится?",
      opts: ["Один интерфейс с обоими полями", "Ошибка: дублирующийся идентификатор", "Второе объявление перезапишет первое", "Union двух интерфейсов"],
      a: 0,
      why: "Одноимённые интерфейсы сливаются в один с обоими полями. Два `type` с одним именем дали бы ошибку Duplicate identifier.",
      example: `interface Box { width: number }
interface Box { height: number }
const box: Box = { width: 1, height: 2 };

type Size = { width: number };  // ошибка: у двух type одно имя
type Size = { height: number }; // ошибка: второе объявление с тем же именем`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Сейчас `Status` принимает любую строку. Опиши его как union трёх строк: `\"todo\"`, `\"doing\"` и `\"done\"`. А `Task` сделай расширением `Base` и добавь поле `status` типа `Status`.",
      code: `interface Base { id: number }

type Status = string;

interface Task {
  title: string;
}`,
      tests: `const ok: Task = { id: 1, title: "x", status: "done" };
// @ts-expect-error: такого статуса нет
const s: Status = "later";
// @ts-expect-error: без id задача неполная
const noId: Task = { title: "x", status: "todo" };`,
      forbid: ["any", "ignore"],
      hint: "`type Status = \"todo\" | ...`, а `interface Task extends Base { ... }`.",
      solution: `interface Base { id: number }

type Status = "todo" | "doing" | "done";

interface Task extends Base {
  title: string;
  status: Status;
}`,
    },
  ],
};
