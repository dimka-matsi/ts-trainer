import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "arr1",
  region: 4,
  title: "map, filter, reduce и другие методы перебора",
  q: "Чем отличаются `forEach`, `map`, `filter` и `reduce`? Что вернёт каждый?",
  answer:
    "`forEach` просто вызывает функцию для каждого элемента и возвращает `undefined`. `map` возвращает новый массив той же длины из результатов функции. `filter` — новый массив из элементов, для которых функция вернула истину. `reduce` сворачивает массив в одно значение через аккумулятор; без начального значения он берёт первый элемент, а на пустом массиве бросает `TypeError`. Для поиска есть `find` и `findIndex`, для проверок — `some` и `every`. Все эти методы не меняют исходный массив.",
  theory: {
    p: [
      "Методы перебора принимают функцию, которую вызывают для каждого элемента с тремя аргументами: элемент, индекс и сам массив. `forEach` нужен ради действия и всегда возвращает `undefined` — цепочку после него не продолжить, а прервать его можно только исключением. Если нужен результат, берут другой метод.",
      "`map` превращает каждый элемент и возвращает новый массив той же длины. `filter` оставляет элементы, для которых функция вернула истину. `find` возвращает первый подходящий элемент или `undefined`, `findIndex` — его индекс или `-1`, `findLast` ищет с конца. `some` — есть ли хоть один подходящий, `every` — подходят ли все; на пустом массиве `every` даёт `true`.",
      "`reduce(fn, initial)` сворачивает массив в одно значение: сумму, объект, другой массив. Функция получает аккумулятор и элемент и возвращает новый аккумулятор. Без `initial` первым аккумулятором станет первый элемент, а пустой массив бросит `TypeError`. Поэтому начальное значение указывают всегда.",
      "`flat(depth)` раскрывает вложенные массивы на заданную глубину (по умолчанию на один уровень), `flatMap` — это `map`, а затем `flat(1)`. Методы можно соединять в цепочку: `users.filter(...).map(...)`. Каждый шаг создаёт новый массив — для огромных данных это стоит учитывать.",
    ],
    code: `const nums = [1, 2, 3, 4];
console.log(nums.map((n) => n * 2));           // новый массив
console.log(nums.filter((n) => n % 2 === 0));  // только чётные
console.log(nums.find((n) => n > 2), nums.findIndex((n) => n > 10));
console.log(nums.some((n) => n > 3), nums.every((n) => n > 0));
console.log(nums.forEach((n) => n * 2));       // undefined всегда

const total = nums.reduce((acc, n) => acc + n, 0);
const byParity = nums.reduce((acc, n) => {
  acc[n % 2 ? "odd" : "even"].push(n);
  return acc;
}, { odd: [], even: [] });
console.log(total, byParity);
console.log([[1, 2], [3, [4]]].flat(), ["a b", "c"].flatMap((s) => s.split(" ")));`,
    keys: [
      "`forEach` — только действие, возвращает `undefined`. `map` — новый массив той же длины, `filter` — подходящие элементы.",
      "`find` и `findIndex` ищут первый элемент, `some` и `every` проверяют условие. `every` на пустом массиве — `true`.",
      "`reduce` сворачивает в одно значение. Без начального значения пустой массив бросает `TypeError` — указывай его всегда.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const nums = [1, 2, 3, 4];
console.log(nums.map((n) => n * 2));
console.log(nums.filter((n) => n % 2 === 0));
console.log(nums.find((n) => n > 2));
console.log(nums.forEach((n) => n * 2));`,
      opts: ["[2, 4, 6, 8]\n[2, 4]\n3\nundefined", "[2, 4, 6, 8]\n[2, 4]\n[3, 4]\n[2, 4, 6, 8]", "[2, 4, 6, 8]\n[false, true, false, true]\n3\nundefined", "[1, 2, 3, 4]\n[2, 4]\n3\nundefined"],
      a: 0,
      why: "`map` возвращает результаты функции, `filter` — сами элементы, а не результаты проверки. `find` — первый подходящий элемент, а не массив. `forEach` всегда возвращает `undefined`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `console.log([1, 2, 3].reduce((acc, n) => acc + n));
console.log([1, 2, 3].reduce((acc, n) => acc + n, 10));
try {
  [].reduce((acc, n) => acc + n);
} catch (e) {
  console.log(e.name);
}
console.log([].every((n) => n > 100));`,
      opts: ["6\n16\nTypeError\ntrue", "6\n16\nundefined\nfalse", "6\n6\nTypeError\nfalse", "5\n16\n0\ntrue"],
      a: 0,
      why: "Без начального значения аккумулятором стал первый элемент. С `10` сумма начинается с десяти. Пустой массив без начального значения нечем начать — `TypeError`. `every` на пустом массиве истинен: нет ни одного нарушения.",
    },
    {
      type: "quiz",
      q: "Когда выбрать `map`, а когда `forEach`?",
      opts: [
        "`map` — когда нужен новый массив из результатов, `forEach` — когда нужно только действие",
        "`forEach` быстрее, поэтому его пишут всегда",
        "`map` меняет исходный массив, `forEach` — нет",
        "Разницы нет",
      ],
      a: 0,
      why: "`map` без использования результата — лишний массив и сигнал для читающего, что результат важен. Ни один из методов сам исходный массив не меняет.",
    },
    {
      type: "run",
      goal: "Напиши `groupBy(list, getKey)`: возвращает объект, где ключ — результат `getKey(элемент)`, а значение — массив элементов с этим ключом. Встроенный `Object.groupBy` использовать нельзя.",
      code: `function groupBy(list, getKey) {
  return {};
}`,
      tests: [
        ["groupBy([1, 2, 3, 4], (n) => (n % 2 ? \"odd\" : \"even\"))", "{\"odd\":[1,3],\"even\":[2,4]}"],
        ["groupBy([\"aa\", \"b\", \"cc\"], (s) => s.length)", "{\"1\":[\"b\"],\"2\":[\"aa\",\"cc\"]}"],
        ["groupBy([], (x) => x)", "{}"],
      ],
      solution: `function groupBy(list, getKey) {
  return list.reduce((groups, item) => {
    const key = getKey(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}`,
      hint: "Начни с пустого объекта в `reduce`. Для каждого элемента посчитай ключ; если массива под ключом ещё нет — создай его, потом добавь элемент.",
      forbid: [{ re: "Object\\.groupBy", msg: "Без встроенного `Object.groupBy`" }],
    },
  ],
};
