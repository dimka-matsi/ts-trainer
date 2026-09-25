import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tc7",
  region: 6,
  title: "Задачи с собеседований на типы",
  q: "Напиши `TupleToUnion`, типобезопасный `get(obj, key)` и `EventEmitter` с проверкой событий. Как рассуждать над такими задачами?",
  answer: "Задачи на типы решают по одной схеме: понять форму входа и выхода, выбрать инструмент и проверить на крайних случаях. `TupleToUnion<T>` — индексный доступ `T[number]`. Типобезопасный `get` — параметр-ключ `K extends keyof T` и результат `T[K]`. `EventEmitter` — карта событий `Events`, где ключ — имя события, а значение — тип данных, и методы `on<E extends keyof Events>(event: E, handler: (data: Events[E]) => void)`. На собеседовании ценят, когда проговариваешь шаги и проверяешь `never`, union и пустые кортежи.",
  theory: {
    p: [
      "Схема решения: 1) записать пример входа и ожидаемого выхода; 2) понять, какая форма нужна — перебор ключей (mapped type), выбор ветки (conditional), разбор строки (шаблон с `infer`), доступ к полю (`T[K]`); 3) написать и проверить на крайних случаях: пустой кортеж, `never`, union, необязательные поля.",
      "`TupleToUnion<[1, \"a\"]>` — `1 | \"a\"`: это просто `T[number]`. Вариант через `infer`: `T extends (infer U)[] ? U : never`. Часто просят и обратное — последний элемент кортежа: `T extends [...unknown[], infer L] ? L : never`.",
      "`get(obj, key)`: параметр-ключ `K extends keyof T`, результат `T[K]`. Для вложенных путей — рекурсивный `Paths<T>` из прошлого урока и тип значения по пути, который разбирает строку по точке через `infer`.",
      "`EventEmitter`: карта событий `type Events = { login: { userId: string }; logout: undefined }`. Метод `on<E extends keyof Events>(event: E, handler: (data: Events[E]) => void)` не даст подписаться на несуществующее событие и подскажет тип данных. `emit` устроен так же. Это частый вопрос уровня middle+.",
    ],
    example: `type TupleToUnion<T extends readonly unknown[]> = T[number];
type U = TupleToUnion<[1, "a", true]>;          // 1 | "a" | true

type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;
type L = Last<[1, 2, 3]>;                       // 3

type Events = { login: { userId: string }; logout: undefined };
declare function on<E extends keyof Events>(event: E, handler: (data: Events[E]) => void): void;

on("login", (data) => data.userId);
on("signup", () => {});                        // ошибка: такого события нет`,
    keys: ["Схема: пример входа и выхода → нужная форма типа → проверка на крайних случаях.", "Кортеж в union — `T[number]`, последний элемент — `infer` в `[...unknown[], infer L]`.", "Типобезопасные события — карта `Events` и `on<E extends keyof Events>` с `Events[E]` для данных."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `L`?",
      probe: "L",
      code: `type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;
type L = Last<[1, 2, 3]>;`,
      opts: ["3", "1 | 2 | 3", "never", "number"],
      a: 0,
      why: "Шаблон кортежа `[...unknown[], infer L]` сопоставляет последний элемент.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `TupleToUnion<T>`: union всех элементов кортежа.",
      code: `type TupleToUnion<T extends readonly unknown[]> = unknown;`,
      tests: `type t1 = Expect<Equal<TupleToUnion<[1, "a", true]>, 1 | "a" | true>>;
type t2 = Expect<Equal<TupleToUnion<[]>, never>>;
type t3 = Expect<Equal<TupleToUnion<readonly ["x", "y"]>, "x" | "y">>;`,
      forbid: ["any", "ignore"],
      hint: "Индексный доступ по `number` даёт тип любого элемента.",
      solution: `type TupleToUnion<T extends readonly unknown[]> = T[number];`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Типизируй `Emitter`: метод `on` принимает только имена событий из `Events`, а обработчик получает данные нужного типа.",
      code: `type Events = { login: { userId: string }; message: { text: string } };

interface Emitter {
  on(event: string, handler: (data: unknown) => void): void;
}`,
      tests: `declare const emitter: Emitter;
emitter.on("login", (d) => { const id: string = d.userId; });
emitter.on("message", (d) => { const t: string = d.text; });
// @ts-expect-error — такого события нет
emitter.on("signup", () => {});`,
      forbid: ["any", "as", "ignore"],
      hint: "Сделай метод дженериком: `on<E extends keyof Events>(event: E, handler: (data: Events[E]) => void): void`.",
      solution: `type Events = { login: { userId: string }; message: { text: string } };

interface Emitter {
  on<E extends keyof Events>(event: E, handler: (data: Events[E]) => void): void;
}`,
    },
  ],
};
