import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob2",
  region: 3,
  title: "readonly и const",
  q: "Чем `readonly` отличается от `const`? Защищает ли `readonly` вложенные объекты?",
  answer: "`const` запрещает переназначить переменную, но содержимое объекта в ней можно менять. `readonly` — модификатор свойства в типе: через этот тип поле нельзя перезаписать. Он не глубокий: `readonly retry` запрещает заменить объект целиком, но поля внутри `retry` менять можно. И оба работают только при проверке типов: в JavaScript от них ничего не остаётся, а объект с `readonly`-полями можно присвоить в переменную обычного типа и изменить через неё.",
  theory: {
    p: [
      "`const` относится к переменной: `const config = {…}` нельзя переназначить, `config = другой` — ошибка. Но `config.url = \"/v2\"` — пожалуйста: объект тот же, меняется его содержимое.",
      "`readonly` относится к свойству в типе: `{ readonly url: string }`. Через такой тип присваивание `obj.url = …` — ошибка. Так описывают данные, которые нельзя менять: конфигурацию, пропсы, ответы API.",
      "`readonly` не глубокий. Если поле — объект, `readonly` запрещает заменить объект целиком, но не менять его поля. Для глубокой защиты помечают каждый уровень или пишут рекурсивный тип — это разберём в регионе «Башня условий».",
      "Это только проверка типов: во время работы программы ничего не заморожено. Для настоящей заморозки есть `Object.freeze`. Ещё тонкость: `readonly` не влияет на совместимость — объект с `readonly`-полями можно присвоить в переменную обычного типа, а копия через spread `{ ...obj }` получает обычные поля.",
    ],
    example: `type Config = { readonly url: string; readonly retry: { count: number } };

const config: Config = { url: "/api", retry: { count: 3 } };
config.url = "/v2";              // ошибка: поле только для чтения
config.retry.count = 5;          // можно: readonly не глубокий
config = { url: "", retry: { count: 0 } }; // ошибка: переменная const`,
    keys: ["`const` — нельзя переназначить переменную, `readonly` — нельзя перезаписать поле через этот тип.", "`readonly` не глубокий: вложенные объекты можно менять.", "Обе проверки только при компиляции. Заморозка во время работы — `Object.freeze`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `copy`?",
      probe: "copy",
      code: `type User = { readonly id: number; name: string };
declare const u: User;
const copy = { ...u };`,
      opts: ["{ id: number; name: string; }", "{ readonly id: number; name: string; }", "User", "{ readonly id: number; readonly name: string; }"],
      a: 0,
      why: "Spread создаёт новый объект, и его поля обычные: модификатор `readonly` не переносится.",
    },
    {
      type: "quiz",
      q: "Есть `const cfg: { readonly retry: { count: number } }`. Что из этого компилируется?",
      opts: ["`cfg.retry.count = 5`", "`cfg.retry = { count: 5 }`", "`cfg = { retry: { count: 5 } }`", "Ничего"],
      a: 0,
      why: "`readonly` защищает только само поле `retry`, а `const` — переменную. Поле внутри вложенного объекта ничем не защищено.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Координаты точки нельзя менять после создания. Сделай так, чтобы присваивание `p.x = 1` не компилировалось.",
      code: `type Point = { x: number; y: number };`,
      tests: `declare const p: Point;
// @ts-expect-error — поле только для чтения
p.x = 1;
// @ts-expect-error — и это тоже
p.y = 2;
const q: Point = { x: 0, y: 0 };`,
      forbid: ["any", "ignore", { re: "\\bReadonly\\b", msg: "Сделай через модификатор readonly у полей" }],
      must: ["readonly x", "readonly y"],
      hint: "Поставь `readonly` перед каждым полем.",
      solution: `type Point = { readonly x: number; readonly y: number };`,
    },
  ],
};
