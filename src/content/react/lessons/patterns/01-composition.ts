import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "pt1",
  region: 12,
  level: "middle",
  title: "Композиция и составные компоненты",
  q: "Что такое композиция в React? Как устроены составные компоненты (compound components)?",
  answer:
    "React строит интерфейс композицией, а не наследованием: компоненты вкладывают друг в друга и передают содержимое через `children` и пропсы-«слоты» вроде `header` и `footer`. Составные компоненты — набор компонентов, которые работают только вместе и делят общее состояние через контекст: `<Tabs>`, `<Tabs.List>`, `<Tabs.Tab>`, `<Tabs.Panel>`. Пользователь сам собирает разметку, а логика переключения спрятана внутри. Раньше такие компоненты делали через `Children.map` и `cloneElement`, но это хрупко: ломается, если между родителем и ребёнком есть обёртка, поэтому сейчас берут контекст.",
  theory: {
    p: [
      "Композиция — главный способ переиспользования в React. Команда React не рекомендует наследовать компоненты друг от друга: всё, что нужно, решается вложенностью. `<Card>` принимает `children`, `<Layout>` — пропсы `sidebar` и `header` с готовыми элементами. Компонент не знает, что внутри, и не зависит от конкретных детей.",
      "Составные компоненты. Вкладки, аккордеон, выпадающий список, таблица с сортировкой — у них есть общее состояние: какая вкладка активна. Родитель `<Tabs>` хранит его и отдаёт через контекст, а `<Tabs.Tab>` и `<Tabs.Panel>` читают. Пользователь компонента свободно расставляет части, добавляет иконки и обёртки, а API остаётся простым.",
      "Старый способ — `Children.map(children, child => cloneElement(child, { active }))`: родитель перебирает детей и подкладывает им пропсы. Это устаревшие API: они видят только прямых детей, ломаются от обёртки или фрагмента и прячут поток данных. Контекст надёжнее и понятнее.",
      "Управляемый и неуправляемый режим. Хорошие переиспользуемые компоненты поддерживают оба: `defaultValue` — компонент хранит состояние сам, `value` плюс `onChange` — состояние у родителя. Так делают как стандартные поля ввода, так и библиотеки компонентов. Ещё один паттерн — пропсы-«слоты»: `icon`, `actions`, `empty` вместо десятка булевых флагов.",
    ],
    code: `const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null);

function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return (
    <button aria-selected={ctx.active === id} onClick={() => ctx.setActive(id)}>
      {children}
    </button>
  );
}

function Panel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = useContext(TabsContext)!;
  return ctx.active === id ? <div>{children}</div> : null;
}

Tabs.Tab = Tab;
Tabs.Panel = Panel;

// Пользователь собирает разметку сам
<Tabs defaultTab="info">
  <Tabs.Tab id="info">Описание</Tabs.Tab>
  <Tabs.Tab id="reviews">Отзывы</Tabs.Tab>
  <Tabs.Panel id="info">Текст описания</Tabs.Panel>
  <Tabs.Panel id="reviews">Список отзывов</Tabs.Panel>
</Tabs>;`,
    flow: {
      actors: ["Tabs: useState(active)", "TabsContext", "Tabs.Tab", "Tabs.Panel"],
      steps: [
        { from: 0, to: 1, label: "{ active: 'info', setActive }" },
        { from: 1, to: 2, label: "вкладка знает, активна ли она" },
        { from: 2, to: 0, label: "клик: setActive('reviews')" },
        { from: 1, to: 3, label: "панель «Отзывы» показана", note: "между частями могут быть любые обёртки" },
      ],
    },
    keys: [
      "Композиция вместо наследования: `children` и пропсы-слоты с готовыми элементами.",
      "Составные компоненты делят состояние через контекст: пользователь собирает разметку, логика спрятана внутри.",
      "`Children` и `cloneElement` — устаревший и хрупкий способ. Хорошие компоненты поддерживают и `value`, и `defaultValue`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Почему составные компоненты сейчас делают через контекст, а не через `cloneElement`?",
      opts: [
        "`cloneElement` видит только прямых детей и ломается, если между частями есть обёртка",
        "`cloneElement` удалён из React",
        "Контекст быстрее всегда",
        "`cloneElement` работает только с классами",
      ],
      a: 0,
      why: "Контекст доставляет состояние на любую глубину, поэтому части компонента можно свободно оборачивать.",
    },
    {
      type: "quiz",
      q: "Как в React принято переиспользовать общую разметку, например карточку с рамкой?",
      opts: [
        "Композицией: `<Card>` принимает `children` или пропсы-слоты",
        "Наследованием от класса `Card`",
        "Копированием разметки",
        "Через глобальную переменную",
      ],
      a: 0,
      why: "React не рекомендует наследование компонентов. Всё решается вложенностью и пропсами.",
    },
    {
      type: "match",
      q: "Сопоставь паттерн и пример.",
      pairs: [
        ["`children`", "`<Card>содержимое</Card>`"],
        ["пропсы-слоты", "`<Layout sidebar={<Menu />}>`"],
        ["составной компонент", "`<Tabs.Tab>` и `<Tabs.Panel>` внутри `<Tabs>`"],
        ["управляемый режим", "`value` и `onChange` от родителя"],
      ],
      why: "Все четыре дают гибкость без наследования и без десятков булевых пропсов.",
    },
  ],
};
