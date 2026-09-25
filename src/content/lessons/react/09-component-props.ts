import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr9",
  region: 9,
  title: "ComponentProps и ref",
  q: "Как сделать обёртку над `button`, которая принимает все её пропсы? Как пробросить `ref`?",
  answer: "Пропсы встроенного элемента берут из типов React: `ComponentProps<\"button\">` — все атрибуты кнопки, включая `onClick`, `disabled`, `type` и в React 19 `ref`. Свою обёртку описывают пересечением: `ComponentProps<\"button\"> & { variant: \"primary\" | \"ghost\" }`, а если свой проп конфликтует с родным — сначала `Omit`. Остальное пробрасывают через `{...rest}`. Пропсы чужого компонента — `ComponentProps<typeof Card>`. `ComponentPropsWithoutRef` — без `ref`, если обёртка его не поддерживает.",
  theory: {
    p: [
      "Писать вручную все атрибуты кнопки — `onClick`, `disabled`, `type`, `aria-*` — долго и ненадёжно. `ComponentProps<\"button\">` берёт их из `React.JSX.IntrinsicElements[\"button\"]`. Обёртка принимает их и передаёт дальше: `function Button({ variant, ...rest }: ButtonProps) { return <button className={variant} {...rest} /> }`.",
      "Свои пропсы добавляют пересечением. Если имя совпадает с родным, но тип другой — например, свой `size` вместо HTML-атрибута `size` у `input`, — сначала убирают родной: `Omit<ComponentProps<\"input\">, \"size\"> & { size: \"s\" | \"m\" }`. Иначе пересечение даст `never` или несовместимый тип.",
      "`ref` в React 19 — обычный проп, и `ComponentProps<\"input\">` его уже содержит: после `{...rest}` он дойдёт до `<input>`. `ComponentPropsWithRef` и `ComponentPropsWithoutRef` различают «с ref» и «без ref» — второй берут, когда обёртка сама использует свой ref. В React 18 для проброса нужен был `forwardRef`.",
      "Пропсы любого компонента: `ComponentProps<typeof Card>`, а тип одного пропса — индексный доступ: `ComponentProps<typeof Card>[\"size\"]`. Так не копируют типы, а берут их из источника.",
    ],
    example: `// @filename: App.tsx
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & { variant: "primary" | "ghost" };

function Button({ variant, ...rest }: ButtonProps) {
  return <button className={variant} {...rest} />;
}

type InputProps = Omit<ComponentProps<"input">, "size"> & { size: "s" | "m" };
function Input({ size, ...rest }: InputProps) {
  return <input className={size} {...rest} />;
}

const b = <Button variant="primary" type="submit" disabled onClick={(e) => e.currentTarget} />;
const i = <Input size="m" placeholder="Email" />;
const wrong = <Button variant="link" />;       // ошибка: такого варианта нет`,
    keys: ["`ComponentProps<\"button\">` — все пропсы встроенного элемента, `ComponentProps<typeof X>` — пропсы компонента.", "Свои пропсы — через `&`, конфликтующие родные сначала убирают `Omit`. Остальное пробрасывают `{...rest}`.", "В React 19 `ref` уже входит в `ComponentProps`; `WithoutRef` — если обёртка сама держит ref."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `T`?",
      probe: "T",
      code: `// @filename: App.tsx
import type { ComponentProps } from "react";
type T = ComponentProps<"button">["type"];`,
      opts: ["\"button\" | \"submit\" | \"reset\" | undefined", "string", "string | undefined", "\"button\""],
      a: 0,
      why: "У кнопки атрибут `type` описан тремя значениями и необязателен.",
    },
    {
      type: "quiz",
      q: "Зачем `Omit<ComponentProps<\"input\">, \"size\">` перед добавлением своего `size`?",
      opts: ["Родной `size` у input — число, и пересечение с `\"s\" | \"m\"` дало бы несовместимый тип", "`size` нельзя использовать в React", "`Omit` ускоряет рендер", "Без него пропсы не пробросятся"],
      a: 0,
      why: "Пересечение объединяет требования. Чтобы заменить тип пропса, старый сначала убирают.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши `LinkProps`: все пропсы тега `a` плюс обязательный `tone` — `\"default\"` или `\"danger\"`.",
      code: `// @filename: App.tsx
type LinkProps = { tone: "default" | "danger" };

function Link({ tone, ...rest }: LinkProps) {
  return <a className={tone} {...rest} />;
}`,
      tests: `const a = <Link tone="danger" href="/delete" target="_blank">Удалить</Link>;
// @ts-expect-error — такого тона нет
const b = <Link tone="info" href="/" />;`,
      forbid: ["any", "ignore"],
      hint: "`type LinkProps = ComponentProps<\"a\"> & { tone: \"default\" | \"danger\" }` и импорт `type ComponentProps`.",
      solution: `// @filename: App.tsx
import type { ComponentProps } from "react";

type LinkProps = ComponentProps<"a"> & { tone: "default" | "danger" };

function Link({ tone, ...rest }: LinkProps) {
  return <a className={tone} {...rest} />;
}`,
    },
  ],
};
