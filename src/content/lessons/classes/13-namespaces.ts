import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl13",
  region: 7,
  title: "Namespaces",
  q: "Что такое `namespace` и нужен ли он в новом коде?",
  answer: "`namespace` — способ TypeScript группировать код до появления ES-модулей: объявления внутри `namespace Geo { export … }` доступны как `Geo.area`. Он компилируется в объект с немедленно вызываемой функцией. В новом коде вместо него используют модули: каждый файл — своя область, импорт и экспорт. Namespaces остались в старых проектах, в `.d.ts` глобальных библиотек (`declare namespace jQuery`) и для слияния с функцией или классом, чтобы добавить им статические типы.",
  theory: {
    p: [
      "`namespace Geo { export const PI = 3.14; export function area(r: number) { … } }` — объявления внутри видны снаружи через `Geo.PI`, если помечены `export`. Раньше их называли «внутренними модулями». Компилятор создаёт для namespace объект и функцию, которая его заполняет.",
      "Почему не в новом коде. ES-модули делают то же лучше: область видимости файла, явные импорты, tree shaking. Namespaces не поддерживаются инструментами, которые только стирают типы, — их запрещает флаг `erasableSyntaxOnly`.",
      "Где встречаются: в `.d.ts` глобальных библиотек, которые подключаются тегом `<script>` (`declare namespace google.maps { … }`); в старом коде; для слияния — `function format() {}` и `namespace format { export type Options = … }` дают функцию с «вложенным» типом `format.Options`.",
      "`declare namespace` — только типы, кода не создаёт; обычный `namespace` создаёт код. На собеседовании достаточно объяснить, что это такое, чем отличается от модуля и почему в новом коде выбирают модули.",
    ],
    example: `namespace Geo {
  export const PI = 3.14;
  export function area(r: number) {
    return PI * r * r;
  }
  const secret = 1;                   // без export не видно снаружи
}

const a = Geo.area(2);
Geo.secret;                           // ошибка: не экспортирован

function format(s: string, opts?: format.Options) { return s; }
namespace format {
  export type Options = { upper?: boolean };
}`,
    keys: ["`namespace` группирует объявления в объект, снаружи видно только помеченное `export`.", "В новом коде вместо него — ES-модули; `erasableSyntaxOnly` namespaces запрещает.", "Встречаются в `.d.ts` глобальных библиотек и для слияния с функцией или классом."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `a`?",
      probe: "a",
      code: `namespace Geo {
  export const PI = 3.14;
  export function area(r: number) { return PI * r * r; }
}
const a = Geo.area(1);`,
      opts: ["number", "3.14", "typeof Geo", "void"],
      a: 0,
      why: "Функция из namespace — обычная функция, её результат — `number`.",
    },
    {
      type: "quiz",
      q: "Что использовать в новом проекте вместо `namespace` для организации кода?",
      opts: ["ES-модули: файлы с `import` и `export`", "`declare namespace`", "Глобальные переменные", "`enum`"],
      a: 0,
      why: "Модули дают свою область видимости каждому файлу, явные зависимости и выбрасывание неиспользуемого кода.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Функция `Money.format` не видна снаружи namespace. Сделай её доступной.",
      code: `namespace Money {
  function format(n: number) {
    return n.toFixed(2) + " ₽";
  }
}

const s = Money.format(10);`,
      runtime: [["Money.format(10)", "\"10.00 ₽\""]],
      forbid: ["any", "ignore"],
      hint: "Внутри namespace снаружи видно только то, что помечено `export`.",
      solution: `namespace Money {
  export function format(n: number) {
    return n.toFixed(2) + " ₽";
  }
}

const s = Money.format(10);`,
    },
  ],
};
