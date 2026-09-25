import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr1",
  region: 9,
  title: "JSX в TypeScript",
  q: "Что делают настройка `jsx` и расширение `.tsx`? Какой тип у JSX-выражения и какие есть особенности синтаксиса?",
  answer: "JSX пишут только в файлах `.tsx`: в `.ts` угловые скобки означали бы приведение типа. Настройка `jsx` говорит, что делать с JSX: `react-jsx` — превращать в вызовы `jsx()` из `react/jsx-runtime`, `preserve` — оставить сборщику. Тип JSX-выражения — `React.JSX.Element`; в React 19 глобального `JSX` больше нет, только `React.JSX`. Особенности `.tsx`: приведение только через `as`, а у дженерик-стрелки пишут запятую `<T,>`, иначе она читается как тег.",
  theory: {
    p: [
      "Файл с JSX должен иметь расширение `.tsx`. В обычном `.ts` запись `<User>data` — старый синтаксис приведения типа, и парсер не может отличить его от тега. Поэтому в `.tsx` приведение пишут только через `as`.",
      "`jsx` в tsconfig: `react-jsx` (React 17+) — JSX превращается в вызовы `jsx()` из `react/jsx-runtime`, и `import React` в каждом файле не нужен. `preserve` — JSX остаётся как есть, его превратит сборщик. `react` — старый режим с `React.createElement`.",
      "Типы проверяются по описанию из `@types/react`. Встроенные теги описаны в `React.JSX.IntrinsicElements`: у `<input>` есть `value` и `onChange`, у `<a>` — `href`. Компоненты проверяются по типу их пропсов. Результат JSX — `React.JSX.Element`. В React 19 глобальное пространство имён `JSX` убрали, поэтому старый код с `JSX.Element` нужно поменять на `React.JSX.Element` или `ReactElement`.",
      "Дженерик-стрелка в `.tsx`: `const List = <T>(props: …) => …` парсер примет за открывающий тег `<T>`. Пишут `<T,>` или `<T extends unknown>`. У обычного объявления `function List<T>(…)` такой проблемы нет.",
    ],
    example: `// @filename: App.tsx
import type { ReactElement } from "react";

function Hello({ name }: { name: string }) {
  return <h1>Привет, {name}</h1>;
}

const el = <Hello name="Аня" />;              // React.JSX.Element
const missing = <Hello />;                   // ошибка: нет пропса name
const link = <a href="/" target="_blank">OK</a>;
const Arrow = <T,>(props: { value: T }) => <p>{String(props.value)}</p>;
const old: JSX.Element = <div />;            // ошибка: в React 19 нет глобального JSX
const ok: ReactElement = <div />;`,
    keys: ["JSX — только в `.tsx`, приведение типа там только через `as`.", "`jsx: react-jsx` превращает JSX в вызовы `jsx()`, тип результата — `React.JSX.Element`; глобального `JSX` в React 19 нет.", "Дженерик-стрелка в `.tsx` пишется `<T,>`, чтобы не спутать с тегом."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `el`?",
      probe: "el",
      code: `// @filename: App.tsx
const el = <div />;`,
      opts: ["React.JSX.Element", "HTMLDivElement", "string", "ReactNode"],
      a: 0,
      why: "JSX-выражение — описание элемента React, а не DOM-узел. Его тип — `React.JSX.Element`.",
    },
    {
      type: "quiz",
      q: "Почему в `.tsx` дженерик-стрелку пишут `<T,>(x: T) => …`?",
      opts: ["Без запятой `<T>` парсер примет за открывающий JSX-тег", "Так требует ESLint", "Запятая делает параметр необязательным", "Это ошибка, так не пишут"],
      a: 0,
      why: "Запятая показывает, что это список параметров типа, а не тег.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Код написан для React 18 и использует глобальный `JSX`. В React 19 его нет — исправь тип результата функции.",
      code: `// @filename: App.tsx
function Badge({ count }: { count: number }): JSX.Element {
  return <span>{count}</span>;
}`,
      forbid: ["any", "ignore"],
      hint: "Используй `React.JSX.Element` из импорта `react` или `ReactElement`: `import type { ReactElement } from \"react\";`.",
      solution: `// @filename: App.tsx
import type { ReactElement } from "react";

function Badge({ count }: { count: number }): ReactElement {
  return <span>{count}</span>;
}`,
    },
  ],
};
