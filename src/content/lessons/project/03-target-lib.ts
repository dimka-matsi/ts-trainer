import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj3",
  region: 10,
  title: "target и lib",
  q: "Чем `target` отличается от `lib`? Почему `\"a\".replaceAll` может не компилироваться?",
  answer: "`target` — под какую версию JavaScript писать выходной код: более новый синтаксис вроде `?.` или `class` для старого `target` переписывается. `lib` — какие встроенные API TypeScript считает существующими: `Array.prototype.flat`, `Promise.allSettled`, DOM. По умолчанию `lib` следует за `target`, но их можно задать отдельно. Ошибка «Property replaceAll does not exist… change lib» значит, что в `lib` нет ES2021, — проверка не знает о методе, хотя браузер его, может быть, и поддерживает. Полифилы `lib` не добавляет: это только описание. В TypeScript 6 `target` по умолчанию es2025, а es5 объявлен устаревшим.",
  theory: {
    p: [
      "`target` отвечает за синтаксис на выходе. С `target: es2017` стрелки и классы остаются как есть, а `?.` и `??` переписываются в проверки. Для современных браузеров и Node ставят свежий `target`, чтобы не раздувать код.",
      "`lib` отвечает за типы встроенных объектов. Если в `lib` нет `es2021.string`, у строк нет метода `replaceAll`, и TypeScript выдаст ошибку с подсказкой, какую `lib` добавить. `dom` даёт `document`, `window`, `fetch`. Для Node вместо `dom` ставят пакет `@types/node`.",
      "По умолчанию `lib` выводится из `target`: `target: es2020` включает `lib` ES2020 и DOM. Задают отдельно, когда код работает в особом окружении — в воркере (`webworker`), в Node без DOM — или когда полифилы добавляют методы новее `target`.",
      "Важно: ни `target`, ни `lib` не добавляют полифилы. Если указать `lib: es2023`, а запускать в старом браузере, `array.findLast` упадёт во время работы. В TypeScript 6 по умолчанию `target: es2025`, минимально поддерживаемый — ES2015, а `target: es5` объявлен устаревшим. В этой песочнице `lib` — ES2017, поэтому примеры с более новыми методами показывают ошибку.",
    ],
    example: `const title = "a-b-c".replaceAll("-", " ");   // ошибка: в lib нет ES2021
const nested = [1, [2, 3]].flat();              // ошибка: в lib нет ES2019

const fixed = "a-b-c".split("-").join(" ");     // работает с ES2017
const entries = Object.entries({ a: 1 });       // ES2017 — есть`,
    keys: ["`target` — синтаксис выходного JavaScript, `lib` — какие встроенные API известны проверке.", "Ошибка «change your target library» — метод новее, чем `lib`. Полифилов `lib` не добавляет.", "В TypeScript 6 `target` по умолчанию es2025, минимум ES2015, `es5` устарел."],
  },
  tasks: [
    {
      type: "quiz",
      q: "TypeScript пишет «Property 'replaceAll' does not exist… Try changing the 'lib' compiler option». Что это значит?",
      opts: ["В `lib` проекта нет ES2021, поэтому проверка не знает о методе", "Метод удалён из JavaScript", "Нужно обновить Node", "Строка пустая"],
      a: 0,
      why: "`lib` описывает, какие встроенные API существуют. Будет ли метод во время работы, зависит от браузера или полифила.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `e`?",
      probe: "e",
      code: `const e = Object.entries({ a: 1, b: 2 });`,
      opts: ["[string, number][]", "[\"a\" | \"b\", number][]", "any[]", "{ a: number; b: number; }"],
      a: 0,
      why: "`Object.entries` из ES2017 возвращает пары с ключом `string`: у объекта во время работы могут быть и другие ключи.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "В этой песочнице `lib` — ES2017, и `replaceAll` недоступен. Перепиши функцию без него, сохранив поведение.",
      code: `function slug(s: string) {
  return s.toLowerCase().replaceAll(" ", "-");
}`,
      runtime: [["slug('Привет Мир Тест')", "\"привет-мир-тест\""]],
      forbid: ["any", "as", "ignore"],
      hint: "`s.toLowerCase().split(\" \").join(\"-\")`.",
      solution: `function slug(s: string) {
  return s.toLowerCase().split(" ").join("-");
}`,
    },
  ],
};
