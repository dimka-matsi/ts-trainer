import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr4",
  region: 9,
  title: "useState и useReducer",
  q: "Как типизировать `useState` с `null` и `useReducer`, чтобы `action` сужался по `type`?",
  answer: "`useState` выводит тип из начального значения: `useState(0)` — `number`. Если начальное значение не отражает всех вариантов, тип передают явно: `useState<User | null>(null)`, иначе состояние навсегда будет `null`. Для `useReducer` действия описывают discriminated union: `{ type: \"add\"; amount: number } | { type: \"reset\" }`. Тогда в `switch (action.type)` TypeScript сужает `action`, и в ветке `\"add\"` доступен `amount`, а `dispatch` не даст отправить действие без нужных полей.",
  theory: {
    p: [
      "`const [count, setCount] = useState(0)` — тип `number` выведен из `0`. `setCount` принимает число или функцию `(prev: number) => number`. С объектом `useState({ name: \"\", age: 0 })` тип тоже выводится.",
      "Проблема с `null` и пустыми массивами. `useState(null)` выведет тип `null`, и записать пользователя будет нельзя. `useState([])` даст `never[]`. Поэтому пишут явно: `useState<User | null>(null)`, `useState<string[]>([])`. Потом при чтении `user` нужна проверка на `null`.",
      "`useReducer(reducer, initialState)` берёт типы из редьюсера. Действия — discriminated union с полем `type`: каждое действие несёт свои данные. В редьюсере `switch (action.type)` сужает тип, а проверка `never` в `default` не даст забыть новое действие.",
      "`dispatch` типизирован по union действий: `dispatch({ type: \"add\" })` без `amount` — ошибка. Так редьюсер становится контрактом: компонент может отправить только существующее действие с правильными данными.",
    ],
    example: `// @filename: App.tsx
import { useReducer, useState } from "react";

type User = { name: string };
type Action = { type: "add"; amount: number } | { type: "reset" };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "add": return state + action.amount;   // здесь action — вариант "add"
    case "reset": return 0;
  }
}

function Counter() {
  const [user, setUser] = useState<User | null>(null);
  const [count, dispatch] = useReducer(reducer, 0);
  dispatch({ type: "add", amount: 5 });
  dispatch({ type: "add" });                    // ошибка: нет amount
  return <p>{user ? user.name : "Гость"}: {count}</p>;
}`,
    keys: ["`useState` выводит тип из начального значения; для `null` и `[]` тип указывают явно.", "Действия `useReducer` — discriminated union по `type`: `switch` сужает `action`.", "`dispatch` принимает только существующие действия с нужными полями."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `list` в компоненте?",
      probe: "list",
      code: `// @filename: App.tsx
import { useState } from "react";
function C() {
  const [items] = useState([]);
  const list = items;
  return null;
}`,
      opts: ["never[]", "any[]", "unknown[]", "[]"],
      a: 0,
      why: "Из пустого массива в строгом режиме выводится `never[]`: в такой массив ничего не положить. Нужно `useState<string[]>([])`.",
    },
    {
      type: "quiz",
      q: "Почему `useState(null)` для пользователя — ошибка проектирования?",
      opts: ["Тип состояния выведется как `null`, и записать пользователя будет нельзя", "`null` запрещён в состоянии React", "Компонент не перерисуется", "Так нельзя из-за StrictMode"],
      a: 0,
      why: "Тип берётся из начального значения. Нужно явно: `useState<User | null>(null)`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши тип `Action` для редьюсера корзины: `add` с полем `id` (число), `remove` с полем `id`, `clear` без данных.",
      code: `// @filename: App.tsx
type Action = { type: string };

function reducer(state: number[], action: Action): number[] {
  switch (action.type) {
    case "add": return [...state, action.id];
    case "remove": return state.filter((x) => x !== action.id);
    case "clear": return [];
    default: return state;
  }
}`,
      tests: `reducer([], { type: "add", id: 1 });
reducer([], { type: "clear" });
// @ts-expect-error — у remove обязателен id
reducer([], { type: "remove" });
// @ts-expect-error — такого действия нет
reducer([], { type: "pay" });`,
      forbid: ["any", "as", "ignore"],
      hint: "`type Action = { type: \"add\"; id: number } | { type: \"remove\"; id: number } | { type: \"clear\" }`.",
      solution: `// @filename: App.tsx
type Action = { type: "add"; id: number } | { type: "remove"; id: number } | { type: "clear" };

function reducer(state: number[], action: Action): number[] {
  switch (action.type) {
    case "add": return [...state, action.id];
    case "remove": return state.filter((x) => x !== action.id);
    case "clear": return [];
    default: return state;
  }
}`,
    },
  ],
};
