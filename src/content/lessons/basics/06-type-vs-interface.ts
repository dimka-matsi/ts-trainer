import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "b6",
  region: 0,
  title: "type и interface",
  q: "Чем `type` отличается от `interface` и что выбрать?",
  answer: "`interface` описывает только объекты и поддерживает declaration merging, поэтому им расширяют типы библиотек. `type` умеет union, кортежи, mapped и conditional типы. При наследовании `extends` даёт понятную ошибку на конфликт, а пересечение молча превращает поле в `never`.",
  theory: {
    p: [
      "Type alias даёт имя любому типу: объекту, union, кортежу, функции. `interface` именует только объектный тип.",
      "Главное отличие: interface открыт. Два объявления `interface Box` сливаются в одно — это declaration merging, так расширяют типы библиотек. Повторный `type` с тем же именем — ошибка.",
      "Расширение: `interface B extends A` против `type B = A & {...}`. При конфликте полей `extends` сразу даёт понятную ошибку, а `&` молча превращает поле в `never`.",
      "Alias — только имя: `type UserId = string` не создаёт новый тип, любую строку можно передать как `UserId`. Handbook советует брать `interface`, пока не понадобятся возможности `type`.",
    ],
    example: `interface Animal { name: string }
interface Bear extends Animal { honey: boolean }

type Point = { x: number; y: number };
type ID = number | string;        // interface так не умеет

interface Box { width: number }
interface Box { height: number }  // слияние: у Box оба поля
const box: Box = { width: 1, height: 2 };`,
    keys: ["`type` — любой тип, `interface` — только объекты.", "`interface` сливается, `type` — нет.", "Конфликт в `&` даёт `never`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип у `R`?",
      probe: "R",
      code: `type A = { id: string } & { id: number };
type R = A["id"];`,
      opts: ["string | number", "never", "string", "Ошибка компиляции в A"],
      a: 1,
      why: "Пересечение объединяет требования: `id` должен быть одновременно `string` и `number`. Таких значений нет, поле становится `never`.",
    },
    {
      type: "quiz",
      q: "Два объявления `interface Box { width: number }` и `interface Box { height: number }` в одном файле. Что получится?",
      opts: ["Один интерфейс с обоими полями", "Ошибка: дублирующийся идентификатор", "Второе объявление перезапишет первое", "Union двух интерфейсов"],
      a: 0,
      why: "Интерфейсы открыты: одноимённые объявления сливаются. С `type` такое объявление дало бы ошибку Duplicate identifier.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши `Status` как union трёх строк `\"todo\" | \"doing\" | \"done\"`, а `Task` — как расширение `Base` с полями `title` и `status`.",
      code: `interface Base { id: number }

type Status = string;

interface Task {
  title: string;
}`,
      tests: `type t1 = Expect<Equal<Status, "todo" | "doing" | "done">>;
type t2 = Expect<Equal<Task["id"], number>>;
type t3 = Expect<Equal<Task["status"], Status>>;
const ok: Task = { id: 1, title: "x", status: "done" };`,
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
