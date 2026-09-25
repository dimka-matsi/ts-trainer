import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr10",
  region: 9,
  title: "Полиморфный as-prop",
  q: "Как типизировать `<Box as=\"a\" href=\"...\">`, чтобы пропсы зависели от выбранного тега?",
  answer: "Полиморфный компонент рендерит разный тег по пропсу `as`, и его пропсы должны меняться вместе с тегом: с `as=\"a\"` разрешён `href`, с `as=\"button\"` — нет. Решение — дженерик по тегу: `C extends ElementType`, а пропсы — `{ as?: C } & Omit<ComponentPropsWithoutRef<C>, \"as\">`. `C` выводится из `as`, и `ComponentPropsWithoutRef<C>` подставляет атрибуты нужного элемента. По умолчанию — `C = \"div\"`. Это сложный тип, поэтому библиотеки часто заменяют его приёмом `asChild` со слотом.",
  theory: {
    p: [
      "Компоненты вёрстки — `Box`, `Text`, `Button` — часто должны рендериться разными тегами: кнопка иногда ссылка, текст иногда заголовок. Для этого делают проп `as`: `<Text as=\"h2\">`. Задача типизации — чтобы остальные пропсы соответствовали выбранному тегу.",
      "`ElementType` — всё, что можно отрендерить: строка-тег вроде `\"a\"` или компонент. `ComponentPropsWithoutRef<C>` — пропсы этого элемента. Тип `BoxProps<C extends ElementType> = { as?: C; children?: ReactNode } & Omit<ComponentPropsWithoutRef<C>, \"as\" | \"children\">`, компонент — `function Box<C extends ElementType = \"div\">({ as, ...rest }: BoxProps<C>)`.",
      "Внутри: `const Tag = as ?? \"div\"; return <Tag {...rest} />`. Переменную с заглавной буквы JSX понимает как компонент. Снаружи `<Box as=\"a\" href=\"/\">` компилируется, а `<Box as=\"button\" href=\"/\">` — ошибка: у кнопки нет `href`.",
      "Цена: такие типы замедляют проверку и дают длинные сообщения об ошибках, а ref добавляет ещё сложности. Поэтому в Radix UI и shadcn/ui используют `asChild`: компонент не выбирает тег, а передаёт свои пропсы единственному ребёнку. Знать оба подхода полезно для собеседования на senior.",
    ],
    example: `// @filename: App.tsx
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type BoxProps<C extends ElementType> = { as?: C; children?: ReactNode } & Omit<ComponentPropsWithoutRef<C>, "as" | "children">;

function Box<C extends ElementType = "div">({ as, ...rest }: BoxProps<C>) {
  const Tag = as ?? "div";
  return <Tag {...rest} />;
}

const link = <Box as="a" href="/orders">Заказы</Box>;
const plain = <Box>Просто блок</Box>;
const wrong = <Box as="button" href="/">Нельзя</Box>;   // ошибка: у кнопки нет href`,
    keys: ["Полиморфный компонент: дженерик по тегу `C extends ElementType`, пропсы — `ComponentPropsWithoutRef<C>`.", "`C` выводится из `as`, по умолчанию `\"div\"`; внутри — `const Tag = as ?? \"div\"`.", "Типы тяжёлые, поэтому библиотеки часто используют `asChild` со слотом."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что делает `ComponentPropsWithoutRef<C>` в полиморфном компоненте?",
      opts: ["Подставляет пропсы того элемента, который выбран в `as`", "Убирает все пропсы", "Делает компонент дженериком", "Проверяет, что `as` — строка"],
      a: 0,
      why: "`C` выводится из `as`, и тип пропсов меняется вместе с тегом: у `a` есть `href`, у `button` — нет.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `H`?",
      probe: "H",
      code: `// @filename: App.tsx
import type { ComponentPropsWithoutRef } from "react";
type H = ComponentPropsWithoutRef<"a">["href"];`,
      opts: ["string | undefined", "string", "URL", "never"],
      a: 0,
      why: "У ссылки атрибут `href` — необязательная строка.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Сделай `Text` полиморфным: проп `as` — любой тег, остальные пропсы — от этого тега, по умолчанию `\"p\"`.",
      code: `// @filename: App.tsx
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

function Text({ as, children }: { as?: string; children?: ReactNode }) {
  return <p>{children}</p>;
}`,
      tests: `const a = <Text as="h2" id="title">Заголовок</Text>;
const b = <Text as="label" htmlFor="email">Email</Text>;
// @ts-expect-error — у абзаца нет htmlFor
const c = <Text htmlFor="x">Текст</Text>;`,
      forbid: ["any", "ignore"],
      hint: "`type TextProps<C extends ElementType> = { as?: C; children?: ReactNode } & Omit<ComponentPropsWithoutRef<C>, \"as\" | \"children\">;` и `function Text<C extends ElementType = \"p\">`.",
      solution: `// @filename: App.tsx
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type TextProps<C extends ElementType> = { as?: C; children?: ReactNode } & Omit<ComponentPropsWithoutRef<C>, "as" | "children">;

function Text<C extends ElementType = "p">({ as, children, ...rest }: TextProps<C>) {
  const Tag = as ?? "p";
  return <Tag {...rest}>{children}</Tag>;
}`,
    },
  ],
};
