import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "arr4",
  region: 4,
  level: "middle",
  title: "Map, Set, WeakMap и WeakSet",
  q: "Чем `Map` отличается от объекта, а `Set` — от массива? Зачем нужны `WeakMap` и `WeakSet`?",
  answer:
    "`Map` — коллекция пар ключ-значение, где ключом может быть что угодно, включая объекты. Она помнит порядок добавления, знает свой размер `size` и не смешивает данные с унаследованными свойствами, как обычный объект. `Set` хранит только уникальные значения — так удобно убирать дубли. `WeakMap` и `WeakSet` принимают ключами только объекты и держат их слабо: если объект больше нигде не нужен, сборщик мусора удалит его вместе с записью. Поэтому их нельзя перебрать, и у них нет `size`.",
  theory: {
    p: [
      "`Map` хранит пары: `map.set(key, value)`, `map.get(key)`, `map.has(key)`, `map.delete(key)`, `map.size`. Ключ — любое значение: объект, функция, число. Ключи сравниваются как в `includes`: объекты — по ссылке, `NaN` равен `NaN`. `Map` перебирается в порядке добавления: `for (const [k, v] of map)`.",
      "Когда `Map` лучше объекта: ключи — объекты или заранее неизвестные строки из данных, частые добавления и удаления, нужен размер. У обычного объекта ключи только строки и символы, есть унаследованные свойства вроде `toString`, а размер считают через `Object.keys(obj).length`. Для записи с известными полями — объект.",
      "`Set` — множество уникальных значений: `add`, `has`, `delete`, `size`. Убрать дубли из массива — `[...new Set(arr)]`. В ES2025 у `Set` появились методы множеств: `union` (объединение), `intersection` (пересечение), `difference` (разность), `isSubsetOf` и другие.",
      "`WeakMap` и `WeakSet` принимают только объекты и держат их «слабо»: запись не мешает сборщику мусора удалить объект, когда на него не осталось других ссылок. Поэтому их нельзя перебрать и у них нет `size` — содержимое может исчезнуть в любой момент. Применение: кэш или дополнительные данные для объектов, которыми владеет кто-то другой, без утечки памяти.",
    ],
    code: `const map = new Map();
const key = { id: 1 };
map.set(key, "объект").set("1", "строка").set(1, "число");
console.log(map.size, map.get(key), map.get({ id: 1 })); // другой объект — другой ключ
for (const [k, v] of map) console.log(typeof k, v);

console.log([...new Set([1, 2, 2, NaN, NaN, "2"])]); // дубли убраны

const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a.intersection(b)], [...a.union(b)], [...a.difference(b)]);

const visits = new WeakMap();      // данные «при» объекте
const user = { name: "Аня" };
visits.set(user, 3);
console.log(visits.get(user));     // user удалят — запись исчезнет сама`,
    keys: [
      "`Map`: ключи любого типа, порядок добавления, `size`. Объект — для записей с известными полями.",
      "`Set` хранит уникальные значения: `[...new Set(arr)]` убирает дубли. В ES2025 есть `union`, `intersection`, `difference`.",
      "`WeakMap` и `WeakSet`: ключи только объекты, держатся слабо, нельзя перебрать. Для кэшей без утечек памяти.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const map = new Map();
const key = { id: 1 };
map.set(key, "объект");
map.set("1", "строка");
map.set(1, "число");
console.log(map.size);
console.log(map.get(key), map.get({ id: 1 }));
console.log([...new Set([1, 2, 2, NaN, NaN, "2"])]);`,
      opts: ["3\nобъект undefined\n[1, 2, NaN, \"2\"]", "2\nобъект объект\n[1, 2, NaN, \"2\"]", "3\nобъект undefined\n[1, 2, NaN, NaN, \"2\"]", "2\nобъект undefined\n[1, 2]"],
      a: 0,
      why: "В `Map` ключи `\"1\"` и `1` разные, в отличие от объекта. Новый объект `{ id: 1 }` — другая ссылка. `Set` считает `NaN` равным `NaN`, а строку `\"2\"` отличает от числа.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);
console.log([...a.intersection(b)]);
console.log(a.union(b).size);
console.log([...a.difference(b)]);`,
      opts: ["[2, 3]\n4\n[1]", "[2, 3]\n6\n[1, 4]", "[1, 4]\n4\n[1]", "[2, 3]\n4\n[4]"],
      a: 0,
      why: "Пересечение — общие элементы. Объединение без повторов — четыре числа. Разность `a` минус `b` — то, что есть только в `a`.",
    },
    {
      type: "match",
      q: "Сопоставь коллекцию и задачу.",
      pairs: [
        ["`Map`", "счётчик по ключам-объектам с порядком и размером"],
        ["`Set`", "убрать дубли из списка"],
        ["`WeakMap`", "кэш для чужих объектов без утечки памяти"],
        ["объект", "запись с заранее известными полями"],
      ],
      why: "`WeakMap` не удерживает ключ: объект удалят, и запись в кэше исчезнет сама.",
    },
    {
      type: "run",
      goal: "Напиши `countWords(text)`: возвращает `Map`, где ключ — слово, значение — сколько раз оно встретилось. Слова разделены пробелами, порядок — как в тексте.",
      code: `function countWords(text) {
  const counts = {};
  for (const word of text.split(" ")) {
    counts[word] = (counts[word] || 0) + 1;
  }
  return counts;
}`,
      tests: [
        ["[...countWords(\"a b a\")]", "[[\"a\",2],[\"b\",1]]"],
        ["countWords(\"x\").get(\"x\")", "1"],
        ["countWords(\"toString toString\").get(\"toString\")", "2"],
      ],
      solution: `function countWords(text) {
  const counts = new Map();
  for (const word of text.split(" ")) {
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return counts;
}`,
      hint: "Создай `new Map()` и для каждого слова записывай `counts.set(word, (counts.get(word) ?? 0) + 1)`.",
    },
  ],
};
