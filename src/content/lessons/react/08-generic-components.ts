import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr8",
  region: 9,
  title: "Дженерик-компоненты и хуки",
  q: "Как написать `<Select<T>>` или `useFetch<T>`, чтобы тип выводился из пропсов?",
  answer: "Компонент — функция, поэтому он может быть дженериком: `function Select<T>({ items, getLabel, onChange }: SelectProps<T>)`. `T` выводится из `items`, и колбэки `getLabel` и `onChange` получают элемент того же типа — без `any` и приведений. Для стрелочной функции в `.tsx` пишут `<T,>`. Дженерик-хук устроен так же: `useFetch<T>(url)` возвращает `{ data: T | null; error; loading }`; тип обычно задают явно или берут из функции-загрузчика. Ограничения `T extends { id: string }` дают доступ к общим полям.",
  theory: {
    p: [
      "Список, выпадающее меню, таблица работают с любыми данными. Без дженерика пришлось бы `items: unknown[]` и приводить типы в колбэках. С дженериком `function List<T>(props: { items: T[]; renderItem: (item: T) => ReactNode })` тип элемента выводится из `items`, и `renderItem` знает его точно.",
      "Использование: `<Select items={users} getLabel={(u) => u.name} onChange={(u) => setUser(u)} />` — `u` сам получает тип пользователя. Явно `<Select<User> … />` пишут редко, только если вывод не справился.",
      "Ограничения: `T extends { id: string }` — компонент может использовать `item.id` как ключ списка, а пользователь обязан передать элементы с `id`. Для стрелки в `.tsx`: `const List = <T extends { id: string }>(…) => …` — с ограничением запятая не нужна.",
      "Дженерик-хук: `function useFetch<T>(url: string): { data: T | null; error: string | null }`. `T` из аргументов не выводится, поэтому вызывают `useFetch<User[]>(\"/api/users\")`. Честнее передать функцию-проверку или схему: `useFetch(url, isUserList)` — тогда тип выводится из проверки, а данные действительно проверены.",
    ],
    example: `// @filename: App.tsx
import type { ReactNode } from "react";

type SelectProps<T> = {
  items: T[];
  getLabel: (item: T) => string;
  onChange: (item: T) => void;
};

function Select<T>({ items, getLabel, onChange }: SelectProps<T>) {
  return <ul>{items.map((item, i) => <li key={i} onClick={() => onChange(item)}>{getLabel(item)}</li>)}</ul>;
}

const users = [{ id: 1, name: "Аня" }];
const ok = <Select items={users} getLabel={(u) => u.name} onChange={(u) => console.log(u.id)} />;
const bad = <Select items={[1, 2]} getLabel={(n) => n.toFixed()} onChange={(n) => n.toUpperCase()} />; // ошибка: n — число`,
    keys: ["Компонент может быть дженериком: `T` выводится из пропсов, колбэки получают точный тип.", "Стрелка в `.tsx` — `<T,>`; ограничения `T extends { id: string }` дают доступ к общим полям.", "Дженерик-хук `useFetch<T>` обычно вызывают с явным `T`, честнее — выводить тип из проверки данных."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Почему `Select<T>` лучше `Select` с `items: unknown[]`?",
      opts: ["Тип элемента выводится из `items`, и колбэки получают его без приведений", "Он быстрее рендерится", "`unknown[]` нельзя передать в JSX", "Разницы нет"],
      a: 0,
      why: "С `unknown` в каждом колбэке пришлось бы проверять или приводить тип элемента.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `first`?",
      probe: "first",
      code: `// @filename: App.tsx
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}
const first = firstItem([{ id: 1, name: "Аня" }]);`,
      opts: ["{ id: number; name: string; } | undefined", "unknown", "{ id: number; name: string; }", "any"],
      a: 0,
      why: "`T` выводится из аргумента, а результат объявлен как `T | undefined`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Сделай компонент `List` дженериком: элементы любого типа с полем `id: string`, `renderItem` получает элемент того же типа.",
      code: `// @filename: App.tsx
import type { ReactNode } from "react";

function List(props: { items: unknown[]; renderItem: (item: unknown) => ReactNode }) {
  return <ul>{props.items.map((item) => <li>{props.renderItem(item)}</li>)}</ul>;
}`,
      tests: `const el = <List items={[{ id: "1", title: "Чай" }]} renderItem={(p) => <b>{p.title}</b>} />;
// @ts-expect-error — у элементов нет id
const bad = <List items={[{ title: "Чай" }]} renderItem={() => null} />;`,
      forbid: ["any", "as", "ignore"],
      hint: "`function List<T extends { id: string }>(props: { items: T[]; renderItem: (item: T) => ReactNode })` и `key={item.id}`.",
      solution: `// @filename: App.tsx
import type { ReactNode } from "react";

function List<T extends { id: string }>(props: { items: T[]; renderItem: (item: T) => ReactNode }) {
  return <ul>{props.items.map((item) => <li key={item.id}>{props.renderItem(item)}</li>)}</ul>;
}`,
    },
  ],
};
