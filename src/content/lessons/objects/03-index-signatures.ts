import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob3",
  region: 3,
  title: "Index signatures",
  q: "Что такое index signature и какие у неё подвохи?",
  answer: "Index signature `{ [key: string]: number }` описывает объект, у которого имена полей заранее неизвестны, но все значения одного типа: словарь, счётчики, переводы. Все объявленные рядом поля обязаны подходить под этот тип значения. Главный подвох: чтение по любому ключу даёт `number`, хотя такого ключа может не быть, — TypeScript не добавляет `undefined`, пока не включён флаг `noUncheckedIndexedAccess`.",
  theory: {
    p: [
      "Иногда имена полей заранее неизвестны: оценки учеников по имени, переводы по ключу, счётчики по слову. Для этого есть index signature: `{ [name: string]: number }` — «любое строковое имя, значение — число». Имя параметра `name` ничего не значит, это подпись для читающего.",
      "Ключ может быть `string`, `number`, `symbol` или шаблоном строки. Числовые ключи в JavaScript всё равно становятся строками, поэтому числовая сигнатура должна быть совместима со строковой.",
      "Рядом можно объявить обычные поля, но они обязаны подходить под тип значения. `{ [key: string]: number; name: string }` — ошибка: `name` строковое, а все значения должны быть числами. Выход — расширить тип значения до `number | string`.",
      "Подвох: `scores.oleg` имеет тип `number`, хотя такого ключа может не быть, и во время работы там будет `undefined`. Флаг `noUncheckedIndexedAccess` добавляет `| undefined` к чтению по сигнатуре — о флагах регион «Контракты». Если ключи известны заранее, лучше описать их явно, а не сигнатурой.",
    ],
    example: `type Scores = { [name: string]: number };

const scores: Scores = { anna: 5, boris: 4 };
scores.vera = 3;                 // можно: любое строковое имя
scores.gleb = "пять";            // ошибка: значение должно быть числом
const s = scores.oleg;           // number, хотя ключа может не быть

type Mixed = {
  [key: string]: number;
  name: string;                  // ошибка: name не подходит под number
};`,
    keys: ["`{ [key: string]: T }` — объект с заранее неизвестными именами полей и значениями типа `T`.", "Объявленные рядом поля обязаны подходить под тип значения сигнатуры.", "Чтение по ключу даёт `T` без `undefined`, пока не включён `noUncheckedIndexedAccess`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `s`?",
      probe: "s",
      code: `type Scores = { [name: string]: number };
const scores: Scores = { anna: 5 };
const s = scores.oleg;`,
      opts: ["number", "number | undefined", "undefined", "any"],
      a: 0,
      why: "Без `noUncheckedIndexedAccess` чтение по сигнатуре даёт тип значения как есть, даже если ключа нет.",
    },
    {
      type: "quiz",
      q: "Почему `{ [key: string]: number; name: string }` не компилируется?",
      opts: ["Поле `name` строковое, а по сигнатуре все значения должны быть числами", "Сигнатуру нельзя сочетать с полями", "Имя параметра должно быть `key`", "Нужен `readonly`"],
      a: 0,
      why: "`name` — тоже строковый ключ, значит, он попадает под сигнатуру. Тип значения нужно расширить до `number | string`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши тип `Translations`: обязательное поле `locale` и любые другие ключи-строки со значениями-строками.",
      code: `type Translations = { locale: string };`,
      tests: `const ok: Translations = { locale: "ru", hello: "привет", bye: "пока" };
// @ts-expect-error — значения только строки
const bad: Translations = { locale: "ru", count: 1 };
// @ts-expect-error — без locale нельзя
const noLocale: Translations = { hello: "привет" };`,
      forbid: ["any", "ignore"],
      hint: "Добавь сигнатуру `[key: string]: string` рядом с `locale`.",
      solution: `type Translations = { locale: string; [key: string]: string };`,
    },
  ],
};
