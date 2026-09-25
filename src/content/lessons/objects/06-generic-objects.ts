import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob6",
  region: 3,
  title: "Дженерик-объектные типы",
  q: "Зачем нужны дженерик-интерфейсы вроде `Box<T>`?",
  answer: "Дженерик-объектный тип описывает форму один раз для любого содержимого: `interface Box<T> { contents: T }`, и `Box<string>`, `Box<User>` получаются подстановкой. Без него пришлось бы писать `StringBox`, `UserBox` или брать `unknown` и проверять тип при каждом чтении. Так устроены встроенные `Array<T>` и `Promise<T>`, а в приложениях — ответы API, состояния загрузки, пагинация.",
  theory: {
    p: [
      "Допустим, нужна «коробка» с содержимым любого типа. Варианты без дженериков плохи: `contents: any` теряет проверки, `contents: unknown` заставляет проверять тип при каждом чтении, а отдельные `StringBox` и `NumberBox` плодят копии. Дженерик решает это: `interface Box<T> { contents: T }`.",
      "Параметр типа указывают при использовании: `Box<string>` — это `{ contents: string }`. Функции, которые принимают и возвращают такие типы, тоже делают дженериками, и тогда `T` выводится из аргумента: `box([1, 2])` — это `Box<number[]>`.",
      "Встроенные типы устроены так же: `Array<T>` (он же `T[]`), `Promise<T>`, `Map<K, V>`. В приложении так описывают повторяющиеся формы: ответ API `ApiResponse<T>`, страница результатов `Page<T>`, состояние загрузки `RequestState<T>`.",
      "Дженерик бывает и у `type`: `type Pair<T> = { first: T; second: T }` или `type OrNull<T> = T | null`. Между `interface` и `type` здесь та же разница, что и без дженериков.",
    ],
    example: `interface Box<T> {
  contents: T;
}

const s: Box<string> = { contents: "привет" };
const n: Box<number> = { contents: "42" };   // ошибка: нужно число

type ApiResponse<T> = { data: T; error: string | null };
const res: ApiResponse<number[]> = { data: [1, 2], error: null };`,
    keys: ["`interface Box<T>` описывает форму один раз для любого содержимого.", "При использовании `T` подставляют явно или его выводит дженерик-функция.", "Так устроены `Array<T>`, `Promise<T>` и типы ответов API в приложениях."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `b`?",
      probe: "b",
      code: `interface Box<T> { contents: T }
function box<T>(value: T): Box<T> {
  return { contents: value };
}
const b = box([1, 2]);`,
      opts: ["Box<number[]>", "Box<unknown>", "{ contents: number[]; }", "Box<[number, number]>"],
      a: 0,
      why: "`T` выводится из аргумента: массив чисел — `number[]`. Результат — `Box<number[]>`, TypeScript печатает имя интерфейса.",
    },
    {
      type: "quiz",
      q: "Чем `interface Box<T> { contents: T }` лучше `interface Box { contents: unknown }`?",
      opts: ["Тип содержимого сохраняется, и при чтении не нужно проверять его заново", "Он работает быстрее во время выполнения", "`unknown` нельзя использовать в интерфейсах", "Разницы нет"],
      a: 0,
      why: "С `unknown` каждое чтение требует сужения, а `Box<string>` сразу знает, что внутри строка.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши дженерик-тип `Page<T>` для страницы результатов: `items` — массив `T`, `total` — число, `next` — номер следующей страницы или `null`.",
      code: `type Page = { items: unknown[]; total: number };`,
      tests: `type t1 = Expect<Equal<Page<string>, { items: string[]; total: number; next: number | null }>>;
const users: Page<{ id: number }> = { items: [{ id: 1 }], total: 1, next: null };`,
      forbid: ["any", "ignore"],
      hint: "`type Page<T> = { items: T[]; total: number; next: number | null }`.",
      solution: `type Page<T> = { items: T[]; total: number; next: number | null };`,
    },
  ],
};
