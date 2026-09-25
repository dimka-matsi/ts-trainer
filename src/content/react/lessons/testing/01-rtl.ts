import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "tst1",
  region: 13,
  level: "junior",
  title: "React Testing Library: что и как тестировать",
  q: "Как тестировать компоненты React? Какие запросы в Testing Library выбирать и почему не тестируют детали реализации?",
  answer:
    "Компоненты тестируют так, как ими пользуется человек: отрисовать, найти элемент по тому, что видно на экране, выполнить действие и проверить результат. React Testing Library подталкивает к этому: нет доступа к состоянию и методам компонента, а запросы ищут по роли, подписи и тексту. Приоритет — `getByRole` с именем, затем `getByLabelText`, `getByText`, а `getByTestId` — последний вариант. `get…` бросает ошибку, если не нашёл, `query…` возвращает `null` для проверки отсутствия, `find…` ждёт появления. Действия — через `userEvent`, а не `fireEvent`. Детали реализации не тестируют, потому что такие тесты ломаются при рефакторинге, хотя поведение не изменилось.",
  theory: {
    p: [
      "Инструменты: тест-раннер Vitest или Jest, окружение jsdom вместо браузера, React Testing Library для рендера и поиска, `@testing-library/user-event` для действий, `@testing-library/jest-dom` для проверок вроде `toBeInTheDocument()`. Старый `react-test-renderer` в React 19 объявлен устаревшим.",
      "Принцип: чем больше тест похож на реальное использование, тем больше ему доверия. Тест не знает, как устроен компонент: хранится ли значение в `useState` или в хранилище, сколько внутри детей. Он знает только то, что видит пользователь. Тогда рефакторинг не ломает тесты, а тесты ловят настоящие ошибки.",
      "Запросы по приоритету. `getByRole('button', { name: 'Отправить' })` — лучший: так элемент находит и экранная читалка, и тест заодно проверяет доступность. Для полей — `getByLabelText('Email')`. Потом `getByPlaceholderText`, `getByText`, `getByDisplayValue`, `getByAltText`, `getByTitle`. `getByTestId` — когда иначе никак. Варианты: `get…` — элемент обязан быть, `query…` — проверить, что его нет, `find…` — дождаться асинхронного появления.",
      "Действия: `const user = userEvent.setup(); await user.type(input, 'Аня'); await user.click(button)`. `userEvent` воспроизводит реальную последовательность событий — фокус, нажатия клавиш, ввод, — а `fireEvent` отправляет одно событие напрямую. Проверяют результат для пользователя: появился текст, кнопка стала неактивной, вызвался колбэк из пропсов.",
    ],
    code: `test('показывает ошибку при пустом email', async () => {
  const user = userEvent.setup();
  render(<SubscribeForm />);

  await user.click(screen.getByRole('button', { name: 'Подписаться' }));

  expect(await screen.findByRole('alert')).toHaveTextContent('Нужен email');
});

test('вызывает onSelect с id товара', async () => {
  const user = userEvent.setup();
  const onSelect = vi.fn();
  render(<ProductCard product={{ id: 7, title: 'Чайник' }} onSelect={onSelect} />);

  await user.click(screen.getByRole('button', { name: /чайник/i }));

  expect(onSelect).toHaveBeenCalledWith(7);
});`,
    flow: {
      actors: ["Тест", "render в jsdom", "screen: запросы", "userEvent", "Проверка"],
      steps: [
        { from: 0, to: 1, label: "render(<SubscribeForm />)" },
        { from: 0, to: 2, label: "getByRole('button', { name: 'Подписаться' })", note: "как видит пользователь" },
        { from: 0, to: 3, label: "user.click(кнопка)", note: "реальная последовательность событий" },
        { from: 0, to: 2, label: "findByRole('alert')", note: "дождаться появления" },
        { from: 2, to: 4, label: "текст «Нужен email» на экране", note: "проверяем поведение, а не состояние" },
      ],
    },
    keys: [
      "Тестируют поведение глазами пользователя, а не детали реализации: тогда рефакторинг не ломает тесты.",
      "Запросы: сначала `getByRole` с именем, потом `getByLabelText` и `getByText`, `getByTestId` — последний. `get` / `query` / `find` — есть, нет, дождаться.",
      "Действия — `userEvent`, проверки — `jest-dom`. Раннер — Vitest или Jest с jsdom.",
    ],
  },
  tasks: [
    {
      type: "order",
      q: "Расставь запросы Testing Library по рекомендуемому приоритету.",
      items: ["`getByRole`", "`getByLabelText`", "`getByText`", "`getByTestId`"],
      why: "Чем ближе запрос к тому, как элемент находит человек или экранная читалка, тем он лучше.",
    },
    {
      type: "quiz",
      q: "Как проверить, что сообщения об ошибке нет на экране?",
      opts: [
        "`expect(screen.queryByRole('alert')).not.toBeInTheDocument()`",
        "`screen.getByRole('alert')` — и ждать, что тест упадёт",
        "`await screen.findByRole('alert')`",
        "Никак: отсутствие проверить нельзя",
      ],
      a: 0,
      why: "`queryBy` возвращает `null`, если не нашёл. `getBy` бросает ошибку, `findBy` ждёт появления.",
    },
    {
      type: "quiz",
      q: "Почему не стоит проверять в тесте значение `useState` внутри компонента?",
      opts: [
        "Это деталь реализации: тест сломается при рефакторинге, хотя поведение для пользователя не изменится",
        "Состояние невозможно прочитать в принципе",
        "Это замедляет тесты в 10 раз",
        "Так запрещает React",
      ],
      a: 0,
      why: "Проверяют то, что видит пользователь. Как компонент это хранит — его внутреннее дело.",
    },
    {
      type: "quiz",
      q: "Чем `userEvent` лучше `fireEvent`?",
      opts: [
        "Воспроизводит реальную последовательность событий: фокус, нажатия клавиш, ввод",
        "Он работает быстрее",
        "Он не требует `render`",
        "`fireEvent` удалён",
      ],
      a: 0,
      why: "Настоящий клик — это цепочка событий. Ошибки часто прячутся именно в ней.",
    },
  ],
};
