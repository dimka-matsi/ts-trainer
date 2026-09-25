import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "hk6",
  region: 2,
  title: "useLayoutEffect и useInsertionEffect",
  q: "Чем `useLayoutEffect` отличается от `useEffect`? Когда нужен `useInsertionEffect`?",
  answer:
    "`useEffect` запускается после того, как браузер отрисовал экран, и не задерживает показ. `useLayoutEffect` запускается синхронно после изменения DOM, но до отрисовки: в нём измеряют размеры и положение элементов и сразу поправляют раскладку, так что пользователь не увидит промежуточного кадра. Цена — он блокирует отрисовку, поэтому по умолчанию берут `useEffect`. `useInsertionEffect` срабатывает ещё раньше, до изменений DOM, и нужен только авторам библиотек CSS-in-JS, чтобы вставить стили.",
  theory: {
    p: [
      "Порядок после рендера: сначала `useInsertionEffect`, затем React применяет изменения к DOM, затем синхронно выполняются `useLayoutEffect`, затем браузер рисует кадр, и только потом выполняются `useEffect`. Все три принимают одинаковые аргументы: функцию, зависимости и очистку.",
      "Зачем `useLayoutEffect`. Подсказке нужно знать свою высоту, чтобы встать над кнопкой или под ней. Если измерять в `useEffect`, браузер успеет нарисовать подсказку в неверном месте, и она прыгнет. `useLayoutEffect` измеряет до отрисовки, а если в нём поменять состояние, React перерисует синхронно, и пользователь увидит сразу правильный кадр.",
      "Цена. Код в `useLayoutEffect` задерживает отрисовку. Тяжёлые вычисления в нём делают интерфейс медленным. Поэтому правило: по умолчанию `useEffect`, а `useLayoutEffect` — только когда без него видно мигание или прыжок. При рендеринге на сервере эффекты раскладки не выполняются: на сервере нет DOM.",
      "`useInsertionEffect` существует для библиотек CSS-in-JS: вставить тег `<style>` до того, как эффекты раскладки начнут читать размеры. В нём нельзя обновлять состояние, а ref ещё не привязаны. В обычном коде приложения он не нужен.",
    ],
    code: `function Tooltip({ targetRect, children }: { targetRect: DOMRect; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    // Измеряем до отрисовки: подсказка сразу окажется на месте
    setHeight(ref.current!.getBoundingClientRect().height);
  }, []);

  const top = targetRect.top - height < 0 ? targetRect.bottom : targetRect.top - height;
  return (
    <div ref={ref} style={{ position: 'absolute', top }}>
      {children}
    </div>
  );
}`,
    flow: {
      actors: ["Рендер", "useInsertionEffect", "DOM", "useLayoutEffect", "Экран", "useEffect"],
      steps: [
        { from: 0, to: 1, label: "стили вставлены", note: "до изменений DOM" },
        { from: 0, to: 2, label: "React применяет изменения к DOM" },
        { from: 2, to: 3, label: "измерить и поправить", note: "синхронно, до отрисовки" },
        { from: 3, to: 4, label: "браузер рисует уже правильный кадр" },
        { from: 4, to: 5, label: "после отрисовки: подписки, запросы" },
      ],
    },
    keys: [
      "Порядок: `useInsertionEffect` → изменения DOM → `useLayoutEffect` → отрисовка → `useEffect`.",
      "`useLayoutEffect` — измерить и поправить раскладку до отрисовки, без мигания. Блокирует отрисовку.",
      "По умолчанию — `useEffect`. `useInsertionEffect` — только для библиотек CSS-in-JS.",
    ],
  },
  tasks: [
    {
      type: "order",
      q: "Расставь по времени запуска.",
      items: ["рендер компонента", "`useInsertionEffect`", "изменения DOM", "`useLayoutEffect`", "отрисовка экрана", "`useEffect`"],
      why: "Чем раньше хук, тем меньше ему доступно и тем сильнее он может задержать отрисовку.",
    },
    {
      type: "quiz",
      q: "Подсказка на долю секунды появляется не на месте, потом прыгает. Что поможет?",
      opts: [
        "Измерять в `useLayoutEffect`: он работает до отрисовки",
        "Перенести измерение в `useEffect` с `[]`",
        "Добавить `setTimeout`",
        "Обернуть компонент в `memo`",
      ],
      a: 0,
      why: "`useEffect` срабатывает после отрисовки — пользователь успевает увидеть неверный кадр.",
    },
    {
      type: "quiz",
      q: "Почему `useLayoutEffect` не используют по умолчанию?",
      opts: [
        "Он блокирует отрисовку: тяжёлый код в нём задерживает кадр",
        "Он не работает в браузере",
        "Он доступен только в классах",
        "Он устарел",
      ],
      a: 0,
      why: "Эффект после отрисовки не мешает пользователю увидеть экран. Эффект до отрисовки — мешает.",
    },
  ],
};
