import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "jsx4",
  region: 0,
  level: "junior",
  title: "События",
  q: "Как работают события в React? Что такое SyntheticEvent и делегирование событий?",
  answer:
    "Обработчики пишут в JSX в camelCase и передают функцию, а не её вызов: `onClick={save}`, а не `onClick={save()}`. React оборачивает событие браузера в SyntheticEvent — объект с одинаковым интерфейсом во всех браузерах — и вешает слушатели не на каждый элемент, а на корневой контейнер приложения: событие всплывает до корня, и React сам вызывает нужные обработчики. Всплытие по дереву компонентов работает как в DOM: `e.stopPropagation()` его останавливает, `e.preventDefault()` отменяет действие браузера, а для фазы перехвата есть `onClickCapture`.",
  theory: {
    p: [
      "`onClick={handleClick}` — передаём функцию. `onClick={handleClick()}` вызовет её во время рендера, а в обработчик попадёт результат. Если нужен аргумент — оборачивают в стрелку: `onClick={() => remove(id)}`. По соглашению обработчики внутри компонента называют `handleX`, а пропсы-обработчики — `onX`.",
      "SyntheticEvent — обёртка над событием браузера с тем же интерфейсом: `target`, `currentTarget`, `preventDefault()`, `stopPropagation()`. Настоящее событие лежит в `e.nativeEvent`. С React 17 объект события больше не переиспользуется, его можно читать и после `await`.",
      "Делегирование. React не вешает слушатель на каждую кнопку: с React 17 он слушает события на корневом контейнере, куда смонтировано приложение, а раньше слушал на `document`. Когда событие всплывает до корня, React по своему дереву находит компоненты и вызывает их обработчики. Поэтому событие из портала всплывает к родителям в дереве React, даже если в DOM портал лежит в другом месте.",
      "Всплытие и отмена. `e.stopPropagation()` не даёт событию дойти до обработчиков родителей. `e.preventDefault()` отменяет действие браузера: отправку формы, переход по ссылке. Обработчики `onClickCapture` срабатывают на фазе перехвата — сверху вниз, раньше обычных. В React всплывают все события, кроме `onScroll`.",
    ],
    code: `function Toolbar({ onSave }: { onSave: () => void }) {
  return (
    <div onClick={() => console.log('клик где-то в панели')}>
      <button
        onClick={(e) => {
          e.stopPropagation(); // родитель не узнает о клике
          onSave();
        }}
      >
        Сохранить
      </button>
    </div>
  );
}

function SearchForm({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // не перезагружать страницу
        onSearch(String(new FormData(e.currentTarget).get('q')));
      }}
    >
      <input name="q" />
    </form>
  );
}`,
    flow: {
      actors: ["Кнопка", "div", "Корень приложения", "React"],
      steps: [
        { from: 0, to: 1, label: "click всплывает по DOM" },
        { from: 1, to: 2, label: "до корневого контейнера" },
        { from: 2, to: 3, label: "один слушатель на корне", note: "делегирование" },
        { from: 3, to: 0, label: "onClick кнопки", note: "SyntheticEvent" },
        { from: 3, to: 1, label: "onClick div", note: "всплытие по дереву React, если не было stopPropagation" },
      ],
    },
    keys: [
      "В обработчик передают функцию: `onClick={save}` или `onClick={() => remove(id)}`, а не вызов `save()`.",
      "SyntheticEvent — кросс-браузерная обёртка. С React 17 слушатели висят на корневом контейнере приложения.",
      "Всплытие — по дереву React. `stopPropagation`, `preventDefault` и `onClickCapture` работают как в DOM.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      code: `<button onClick={remove(id)}>Удалить</button>`,
      q: "Что произойдёт?",
      opts: [
        "`remove` вызовется при каждом рендере, а не по клику",
        "Всё правильно: удалит по клику",
        "Ошибка сборки",
        "Кнопка не отрисуется",
      ],
      a: 0,
      why: "Нужна функция, а не результат вызова: `onClick={() => remove(id)}`.",
    },
    {
      type: "match",
      q: "Сопоставь вызов и что он делает.",
      pairs: [
        ["`e.preventDefault()`", "отменить действие браузера, например отправку формы"],
        ["`e.stopPropagation()`", "не дать событию всплыть к родителям"],
        ["`onClickCapture`", "обработать на фазе перехвата, раньше обычных"],
        ["`e.nativeEvent`", "настоящее событие браузера"],
      ],
      why: "SyntheticEvent повторяет интерфейс DOM, поэтому знания о событиях браузера переносятся на React.",
    },
    {
      type: "quiz",
      q: "Куда React вешает слушатели событий начиная с версии 17?",
      opts: ["На корневой контейнер приложения", "На каждый элемент", "На `window`", "На `document`, как раньше"],
      a: 0,
      why: "Так несколько приложений React на одной странице не мешают друг другу, а переход на новую версию проходит по частям.",
    },
  ],
};
