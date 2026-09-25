import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr3",
  region: 9,
  title: "События",
  q: "Как типизировать `onChange` у инпута и `onSubmit` у формы? Чем `target` отличается от `currentTarget`?",
  answer: "Если обработчик написан прямо в JSX, TypeScript выводит тип события сам: `onChange={(e) => setName(e.target.value)}`. Если обработчик вынесен в функцию, тип указывают явно: `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent<HTMLButtonElement>`, `KeyboardEvent<HTMLInputElement>` из `react`. Параметр-дженерик — элемент, на котором висит обработчик: он задаёт тип `currentTarget`. `currentTarget` — элемент с обработчиком, его тип точный; `target` — элемент, где событие случилось, у кликов он может быть вложенным, поэтому типизирован шире.",
  theory: {
    p: [
      "Встроенный обработчик получает тип из контекста: в `<input onChange={(e) => …} />` `e` — `ChangeEvent<HTMLInputElement>`, и `e.target.value` — строка. Ничего писать не нужно.",
      "Вынесенный обработчик: `function handleChange(e: ChangeEvent<HTMLInputElement>) { … }`. Типы событий импортируют из `react`: `ChangeEvent`, `FormEvent`, `MouseEvent`, `KeyboardEvent`, `FocusEvent`. Это синтетические события React, а не DOM-события, поэтому брать `MouseEvent` из DOM нельзя — типы разные.",
      "Альтернатива — взять тип пропа целиком: `ComponentProps<\"input\">[\"onChange\"]` или `ChangeEventHandler<HTMLInputElement>` — тип всей функции-обработчика.",
      "`currentTarget` — элемент, на котором висит обработчик, его тип задан параметром: `MouseEvent<HTMLButtonElement>` — значит, `e.currentTarget` — кнопка. `target` — где событие произошло на самом деле: клик мог попасть во вложенную иконку. Для форм берут `e.currentTarget` и `new FormData(e.currentTarget)`.",
    ],
    example: `// @filename: App.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";

function Search() {
  const [q, setQ] = useState("");
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value);
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }
  return (
    <form onSubmit={handleSubmit}>
      <input value={q} onChange={handleChange} />
      <button onClick={(e) => e.currentTarget.focus()}>Найти</button>
    </form>
  );
}`,
    keys: ["Во встроенном обработчике тип события выводится сам.", "Вынесенный обработчик: `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent<HTMLButtonElement>` из `react`.", "`currentTarget` — элемент с обработчиком (точный тип), `target` — где событие случилось."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `t`?",
      probe: "t",
      code: `// @filename: App.tsx
import type { MouseEvent } from "react";
const t = (e: MouseEvent<HTMLButtonElement>) => e.currentTarget;`,
      opts: ["(e: MouseEvent<HTMLButtonElement>) => EventTarget & HTMLButtonElement", "(e: MouseEvent<HTMLButtonElement>) => HTMLButtonElement", "(e: MouseEvent<HTMLButtonElement>) => EventTarget", "(e: MouseEvent<HTMLButtonElement>) => Element"],
      a: 0,
      why: "`currentTarget` в React-событии — `EventTarget & T`, где `T` — параметр-элемент.",
    },
    {
      type: "quiz",
      q: "Почему для обработчика клика в React нельзя взять глобальный `MouseEvent` из DOM?",
      opts: ["React передаёт своё синтетическое событие, его тип — `MouseEvent` из `react`", "DOM-события запрещены в TypeScript", "Глобальный `MouseEvent` только для Node", "Можно, типы одинаковые"],
      a: 0,
      why: "У синтетического события свой интерфейс: `nativeEvent`, `currentTarget` с точным типом и т.д.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Обработчик вынесен в функцию, и параметр получил неявный `any`. Укажи тип события изменения поля.",
      code: `// @filename: App.tsx
import { useState } from "react";

function NameField() {
  const [name, setName] = useState("");
  function handleChange(e) {
    setName(e.target.value);
  }
  return <input value={name} onChange={handleChange} />;
}`,
      forbid: ["any", "as", "ignore"],
      hint: "`function handleChange(e: ChangeEvent<HTMLInputElement>)` и импорт `type ChangeEvent` из `react`.",
      solution: `// @filename: App.tsx
import { useState, type ChangeEvent } from "react";

function NameField() {
  const [name, setName] = useState("");
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }
  return <input value={name} onChange={handleChange} />;
}`,
    },
  ],
};
