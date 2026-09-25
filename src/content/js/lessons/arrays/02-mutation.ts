import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "arr2",
  region: 4,
  level: "junior",
  title: "Мутирующие методы и toSorted",
  q: "Какие методы массива меняют исходный массив? Почему `[10, 1, 2].sort()` даёт `[1, 10, 2]`?",
  answer:
    "Меняют массив на месте `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse` и `fill`. Остальные — `slice`, `concat`, `map`, `filter` — возвращают новый массив. `sort` без функции сравнения сравнивает элементы как строки, поэтому `\"10\"` оказывается раньше `\"2\"`; для чисел пишут `sort((a, b) => a - b)`. С ES2023 есть немутирующие версии: `toSorted`, `toReversed`, `toSpliced` и `with` — их удобно использовать для состояния в React.",
  theory: {
    p: [
      "Мутирующие методы меняют сам массив: `push` и `pop` работают с концом, `unshift` и `shift` — с началом, `splice(start, count, ...items)` удаляет и вставляет в середине, `sort` и `reverse` переставляют, `fill` заполняет. `sort` и `reverse` при этом возвращают тот же массив, а не копию — легко ошибиться, думая, что оригинал остался прежним.",
      "`slice(start, end)` возвращает копию части массива и ничего не меняет — не путай со `splice`. `concat`, `map`, `filter`, `flat` тоже создают новый массив. Для неизменяемых обновлений раньше писали `[...arr].sort()`. С ES2023 есть готовые методы: `toSorted`, `toReversed`, `toSpliced(start, count, ...items)` и `with(index, value)` — копия с заменённым элементом.",
      "`sort()` без аргумента приводит элементы к строкам и сравнивает строки по символам. Поэтому числа сортируются «как слова»: `[10, 1, 2]` → `[1, 10, 2]`. Для чисел передают функцию сравнения: отрицательный результат — `a` раньше `b`, положительный — позже. `(a, b) => a - b` сортирует по возрастанию. Сортировка устойчивая: равные элементы сохраняют исходный порядок.",
      "Почему это важно. Состояние в React и Redux нельзя менять на месте: библиотека сравнивает ссылки и не заметит изменения. `state.items.sort()` испортит состояние и не вызовет перерисовку, а `state.items.toSorted()` вернёт новый массив.",
    ],
    code: `const nums = [10, 1, 2];
const sorted = nums.sort();          // сравнивает строки и меняет nums
console.log(sorted, sorted === nums);
console.log([10, 1, 2].sort((a, b) => a - b));

const list = [1, 2, 3, 4, 5];
console.log(list.slice(1, 3));       // копия части, list не изменён
console.log(list.splice(1, 2), list); // вырезал и изменил list

const safe = [3, 1, 2];
console.log(safe.toSorted(), safe.toReversed(), safe.with(0, 9));
console.log(safe);                   // не изменился`,
    keys: [
      "Мутируют: `push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`, `fill`. `sort` и `reverse` возвращают тот же массив.",
      "`sort()` без функции сравнивает строки. Для чисел — `sort((a, b) => a - b)`.",
      "Немутирующие версии ES2023: `toSorted`, `toReversed`, `toSpliced`, `with`. `slice` копирует, `splice` меняет.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const nums = [10, 1, 2];
const sorted = nums.sort();
console.log(sorted);
console.log(sorted === nums);
console.log([10, 1, 2].sort((a, b) => a - b));`,
      opts: ["[1, 10, 2]\ntrue\n[1, 2, 10]", "[1, 2, 10]\nfalse\n[1, 2, 10]", "[1, 10, 2]\nfalse\n[10, 2, 1]", "[1, 2, 10]\ntrue\n[1, 2, 10]"],
      a: 0,
      why: "Без функции сравнения элементы сравниваются как строки: `\"10\"` меньше `\"2\"`. `sort` меняет массив и возвращает его же. Функция `a - b` сортирует числа по возрастанию.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const list = [1, 2, 3, 4, 5];
const part = list.slice(1, 3);
const removed = list.splice(1, 2);
console.log(part);
console.log(removed);
console.log(list);`,
      opts: ["[2, 3]\n[2, 3]\n[1, 4, 5]", "[2, 3]\n[2, 3, 4]\n[1, 5]", "[2, 3]\n[2, 3]\n[1, 2, 3, 4, 5]", "[1, 2]\n[2, 3]\n[1, 4, 5]"],
      a: 0,
      why: "`slice(1, 3)` копирует элементы с индекса 1 до 3, не включая 3. `splice(1, 2)` вырезает два элемента начиная с индекса 1 и меняет сам массив.",
    },
    {
      type: "sort",
      q: "Какие методы меняют исходный массив?",
      groups: ["меняет массив", "возвращает новый"],
      items: [
        ["`push`", 0],
        ["`sort`", 0],
        ["`splice`", 0],
        ["`reverse`", 0],
        ["`slice`", 1],
        ["`toSorted`", 1],
        ["`concat`", 1],
        ["`with`", 1],
      ],
      why: "Ловушка — `sort` и `reverse`: они возвращают массив, и кажется, что это копия. Для копий есть `toSorted` и `toReversed`.",
    },
    {
      type: "run",
      goal: "Почини `removeAt(list, index)`: она должна вернуть новый массив без элемента с индексом `index` и не менять исходный.",
      code: `function removeAt(list, index) {
  list.splice(index, 1);
  return list;
}`,
      tests: [
        ["removeAt([1, 2, 3], 1)", "[1,3]"],
        ["(() => { const a = [1, 2, 3]; removeAt(a, 0); return a; })()", "[1,2,3]"],
        ["(() => { const a = [1]; return removeAt(a, 0) !== a; })()", "true"],
      ],
      solution: `function removeAt(list, index) {
  return list.toSpliced(index, 1);
}`,
      hint: "Есть немутирующая версия `splice` — `toSpliced`. Или собери результат из двух кусков `slice`.",
    },
  ],
};
