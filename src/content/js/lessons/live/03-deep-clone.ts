import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc3",
  region: 9,
  title: "deepClone",
  q: "Напиши глубокое копирование объекта. Как обработать даты, `Map`, `Set` и циклические ссылки?",
  answer:
    "Рекурсия: примитивы и функции возвращаем как есть, для массива создаём новый массив, для объекта — новый объект и копируем каждое свойство рекурсивно. Дата копируется через `new Date(value)`, `Map` и `Set` — через новые коллекции с рекурсивной копией элементов. От циклических ссылок спасает `WeakMap` «оригинал → копия»: прежде чем копировать объект, проверяем, не копировали ли его уже, и если да — возвращаем готовую копию. В реальном коде есть встроенный `structuredClone`.",
  theory: {
    p: [
      "Базовая версия — три случая. Примитив (`typeof value !== \"object\"` или `null`) возвращаем как есть — он и так копируется. Массив — `value.map(deepClone)`. Объект — новый объект, в который кладём `deepClone` каждого собственного значения. Функции обычно не копируют, а переносят ссылкой.",
      "Особые объекты. Дата — объект, и базовая версия превратит её в пустой `{}`. Поэтому перед общим случаем проверяют `instanceof Date` и создают `new Date(value)`. Так же `Map` и `Set`: новая коллекция, куда кладут копии ключей и значений. Порядок проверок важен: сначала особые типы, потом массив, потом обычный объект.",
      "Циклическая ссылка — объект, который прямо или через другие ссылается на себя: `user.self = user`. Наивная рекурсия уйдёт в бесконечность и упадёт с `RangeError`. Решение — `WeakMap` уже скопированных объектов: оригинал → копия. Копию кладут в карту до рекурсии в её свойства, и тогда повторная встреча того же объекта возвращает готовую копию. `WeakMap` не держит объекты в памяти после копирования.",
    ],
    code: `function deepCloneBasic(value) {
  if (typeof value !== "object" || value === null) return value; // примитивы и функции
  if (Array.isArray(value)) return value.map(deepCloneBasic);
  const copy = {};
  for (const [key, item] of Object.entries(value)) copy[key] = deepCloneBasic(item);
  return copy;
}

const original = { user: { name: "Аня", tags: ["admin"] }, when: new Date(0) };
const copy = deepCloneBasic(original);
copy.user.tags.push("editor");
console.log(original.user.tags);          // ["admin"] — вложенное не общее
console.log(copy.when instanceof Date);   // false — дата сломалась, это исправит задание`,
    keys: [
      "Рекурсия: примитив — как есть, массив — `map`, объект — новый объект с копиями значений.",
      "Особые типы проверяют раньше общего случая: `Date` — `new Date(value)`, `Map` и `Set` — новые коллекции.",
      "Циклы — `WeakMap` «оригинал → копия», копию записывают до рекурсии. В реальном коде есть `structuredClone`.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `deepClone(value)`: копирует массивы и обычные объекты на всю глубину, правильно копирует `Date`, `Map` и `Set` и не зацикливается на циклических ссылках. `structuredClone` и `JSON` не использовать.",
      code: `function deepClone(value) {
  return { ...value };
}`,
      tests: [
        ["(() => { const o = { a: [1, { b: 2 }] }; const c = deepClone(o); c.a[1].b = 3; return [o.a[1].b, c.a[1].b, Array.isArray(c.a)]; })()", "[2,3,true]"],
        ["(() => { const c = deepClone({ d: new Date(0) }); return c.d instanceof Date && c.d.getTime() === 0; })()", "true"],
        ["(() => { const m = new Map([[\"k\", { v: 1 }]]); const c = deepClone(m); c.get(\"k\").v = 2; return [m.get(\"k\").v, c instanceof Map, deepClone(new Set([1, 2])).size]; })()", "[1,true,2]"],
        ["(() => { const o = { name: \"a\" }; o.self = o; const c = deepClone(o); return c.self === c && c !== o; })()", "true"],
        ["deepClone(5)", "5"],
      ],
      solution: `function deepClone(value, seen = new WeakMap()) {
  if (typeof value !== "object" || value === null) return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value);
  if (value instanceof Map) {
    const copy = new Map();
    seen.set(value, copy);
    for (const [k, v] of value) copy.set(deepClone(k, seen), deepClone(v, seen));
    return copy;
  }
  if (value instanceof Set) {
    const copy = new Set();
    seen.set(value, copy);
    for (const v of value) copy.add(deepClone(v, seen));
    return copy;
  }
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen);
  return copy;
}`,
      hint: "Начни с примитивов. Потом `WeakMap` уже скопированных, затем `Date`, `Map`, `Set`, и в конце массив или объект. Копию записывай в `WeakMap` до того, как копировать её содержимое.",
      forbid: [
        { re: "structuredClone", msg: "Без `structuredClone`" },
        { re: "JSON\\.", msg: "Без `JSON`" },
      ],
    },
    {
      type: "quiz",
      q: "Зачем в `deepClone` запоминать скопированные объекты в `WeakMap`?",
      opts: [
        "Чтобы циклическая ссылка вернула уже созданную копию, а не ушла в бесконечную рекурсию",
        "Чтобы копирование шло быстрее для чисел",
        "Чтобы копия была заморожена",
        "Чтобы сохранить функции",
      ],
      a: 0,
      why: "Без запоминания `o.self = o` даст бесконечную рекурсию и `RangeError`. Заодно общий вложенный объект останется общим и в копии, как в оригинале.",
    },
  ],
};
