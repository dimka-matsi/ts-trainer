import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj4",
  region: 10,
  title: "module, moduleResolution и импорт CommonJS",
  q: "Что задают `module` и `moduleResolution`? Зачем `esModuleInterop` и что будет без него?",
  answer: "`module` — в каком формате писать импорты и экспорты на выходе: `esnext`, `commonjs`, `nodenext`, `preserve`. `moduleResolution` — как искать файл по строке импорта: `bundler` для Vite и webpack (расширения не нужны, учитывается `exports` в package.json), `nodenext` для кода, который запускает Node (расширения обязательны, учитывается `\"type\": \"module\"`). CommonJS-модуль экспортирует одно значение через `module.exports`, и импортировать его как `import x from` без помощи нельзя: `esModuleInterop` добавляет совместимость, чтобы default-импорт работал как в Babel. В TypeScript 6 `esModuleInterop` включён всегда, а старые `moduleResolution: node` и `classic` объявлены устаревшими.",
  theory: {
    p: [
      "`module` задаёт формат выходного кода. Для сборщиков — `esnext` или `preserve` (оставить как написано). Для Node — `nodenext`: TypeScript сам выберет ESM или CommonJS для каждого файла по `package.json` и расширению. `commonjs` — старые Node-проекты. В TypeScript 6 по умолчанию `esnext`.",
      "`moduleResolution` — как найти модуль. `bundler`: как Vite и webpack — без расширений, с учётом поля `exports` в package.json. `nodenext`: строго как Node — в ESM импорт `./util.js` с расширением, условия `import` и `require` в `exports`. Старые `node10` и `classic` в TypeScript 6 устарели.",
      "CommonJS и ESM. В CommonJS модуль экспортирует объект или функцию целиком: `module.exports = greet`, в типах это `export = greet`. У ESM default-импорт ищет поле `default`, которого там нет. Раньше приходилось писать `import * as greet from \"legacy\"`, но это нарушает стандарт: namespace-объект нельзя вызвать.",
      "`esModuleInterop` добавляет вспомогательный код, чтобы `import greet from \"legacy\"` получал `module.exports`, и включает `allowSyntheticDefaultImports` для проверки типов. Сборщики ведут себя так же, поэтому флаг включают всегда, а в TypeScript 6 его нельзя выключить. В этой песочнице разрешение `bundler`, поэтому default-импорт работает и без флага; ниже он выключен явно, чтобы показать ошибку.",
    ],
    example: `// @flags: allowSyntheticDefaultImports=false
// @filename: legacy.d.ts
declare module "legacy" {
  function greet(name: string): string;
  export = greet;
}
// @filename: main.ts
import greet from "legacy";           // ошибка: без совместимости нельзя
import * as greet2 from "legacy";     // ошибка: namespace-объект — не функция`,
    keys: ["`module` — формат импортов на выходе, `moduleResolution` — как искать файл: `bundler` или `nodenext`.", "CommonJS экспортирует значение целиком (`export =`), default-импорту нужна совместимость.", "`esModuleInterop` даёт default-импорт CommonJS; в TypeScript 6 включён всегда, `node10` и `classic` устарели."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Какой `moduleResolution` выбрать для проекта на Vite?",
      opts: ["`bundler`: он ищет модули как сборщик — без расширений и с учётом `exports`", "`classic`", "`node10`", "`nodenext`: он лучше для любого проекта"],
      a: 0,
      why: "`nodenext` требует расширений в импортах, как Node. Для сборщиков есть отдельный режим `bundler`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `// @filename: legacy.d.ts
declare module "legacy" {
  function greet(name: string): string;
  export = greet;
}
// @filename: main.ts
import greet from "legacy";
const r = greet("Аня");`,
      opts: ["string", "any", "unknown", "typeof greet"],
      a: 0,
      why: "С совместимостью default-импорт получает саму функцию из `export =`, и её результат — `string`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Совместимость выключена, и default-импорт CommonJS-модуля не компилируется. Включи в первой строке флаг, который даёт default-импорт CommonJS.",
      code: `// @flags: allowSyntheticDefaultImports=false
// @filename: legacy.d.ts
declare module "legacy" {
  function greet(name: string): string;
  export = greet;
}
// @filename: main.ts
import greet from "legacy";
const r: string = greet("Аня");`,
      forbid: ["any", "ignore"],
      must: ["import greet from \"legacy\""],
      hint: "Замени первую строку на `// @flags: esModuleInterop`.",
      solution: `// @flags: esModuleInterop
// @filename: legacy.d.ts
declare module "legacy" {
  function greet(name: string): string;
  export = greet;
}
// @filename: main.ts
import greet from "legacy";
const r: string = greet("Аня");`,
    },
  ],
};
