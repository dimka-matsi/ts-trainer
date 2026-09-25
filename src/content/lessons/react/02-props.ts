import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr2",
  region: 9,
  title: "Пропсы и children",
  q: "Как типизировать пропсы и `children`? Чем отличаются `ReactNode`, `ReactElement` и `JSX.Element`?",
  answer: "Пропсы описывают типом объекта в параметре компонента: `function Card({ title, children }: CardProps)`. Для `children` почти всегда берут `ReactNode` — всё, что React умеет отрисовать: элементы, строки, числа, `null`, `undefined`, массивы. `ReactElement` уже: только JSX-элемент, строку в него не передать. `React.JSX.Element` — тип результата JSX-выражения, по сути `ReactElement`. `React.FC` с React 18 не добавляет `children` сам, поэтому многие пишут обычные функции с типом пропсов.",
  theory: {
    p: [
      "Пропсы — тип объекта: `type CardProps = { title: string; size?: \"s\" | \"m\"; onClose?: () => void }`. Значения по умолчанию задают при разборе параметров: `{ size = \"m\" }`. Необязательные пропсы помечают `?`, колбэки — функцией с нужными параметрами.",
      "`children: ReactNode` — самый широкий тип того, что можно положить внутрь: JSX, строка, число, `null`, `undefined`, `boolean`, массив и промис в React 19. Если компонент ждёт ровно один элемент, например для `cloneElement`, — `ReactElement`. Если функцию — `children: (value: T) => ReactNode` для render props.",
      "`ReactElement` — объект элемента `{ type, props, key }`, `React.JSX.Element` — тип, который получается из JSX, по сути то же самое. В позиции «что вернуть из компонента» или «что принять внутрь» обычно лучше `ReactNode`: компонент может вернуть и `null`, и строку.",
      "`React.FC<Props>` — тип функционального компонента. До React 18 он неявно добавлял `children`, и это было источником ошибок, теперь не добавляет. Большой пользы от `FC` нет, поэтому часто пишут просто `function Card(props: CardProps)` — тип результата выводится сам.",
    ],
    example: `// @filename: App.tsx
import type { ReactNode, ReactElement } from "react";

type CardProps = { title: string; size?: "s" | "m"; children?: ReactNode };

function Card({ title, size = "m", children }: CardProps) {
  return <section className={size}><h2>{title}</h2>{children}</section>;
}

const a = <Card title="Заказ">Текст и <b>жирный</b></Card>;
const b = <Card title="Пусто" size="l" />;    // ошибка: размера l нет
const node: ReactNode = "строка";
const element: ReactElement = "строка";      // ошибка: нужен JSX-элемент`,
    keys: ["Пропсы — тип объекта в параметре, значения по умолчанию — при разборе параметров.", "`children: ReactNode` — всё, что React отрисует; `ReactElement` — только JSX-элемент.", "`React.FC` не добавляет `children` с React 18; обычная функция с типом пропсов — нормальный выбор."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Какой тип выбрать для `children`, если внутрь могут передать текст, элементы или ничего?",
      opts: ["`ReactNode`", "`ReactElement`", "`JSX.Element`", "`string`"],
      a: 0,
      why: "`ReactNode` включает строки, числа, `null`, `undefined`, элементы и массивы.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `el`?",
      probe: "el",
      code: `// @filename: App.tsx
import type { ReactNode } from "react";
function Card({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}
const el = <Card>текст</Card>;`,
      opts: ["React.JSX.Element", "ReactNode", "string", "Card"],
      a: 0,
      why: "Любое JSX-выражение с компонентом даёт элемент React, независимо от типа пропсов.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши пропсы `Alert`: обязательный `kind` — `\"info\"` или `\"error\"`, необязательный заголовок-строка `title` и содержимое `children` любого отрисовываемого вида.",
      code: `// @filename: App.tsx
type AlertProps = {};

function Alert({ kind, title, children }: AlertProps) {
  return <div className={kind}>{title}{children}</div>;
}`,
      tests: `const a = <Alert kind="info">Готово</Alert>;
const b = <Alert kind="error" title="Ошибка"><b>Сеть</b></Alert>;
// @ts-expect-error — такого вида нет
const c = <Alert kind="warn" />;`,
      forbid: ["any", "ignore"],
      hint: "`type AlertProps = { kind: \"info\" | \"error\"; title?: string; children?: ReactNode }` и импорт `ReactNode` из `react`.",
      solution: `// @filename: App.tsx
import type { ReactNode } from "react";

type AlertProps = { kind: "info" | "error"; title?: string; children?: ReactNode };

function Alert({ kind, title, children }: AlertProps) {
  return <div className={kind}>{title}{children}</div>;
}`,
    },
  ],
};
