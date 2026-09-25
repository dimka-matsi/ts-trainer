import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "pt4",
  region: 12,
  title: "Классовые компоненты и жизненный цикл",
  q: "Как устроены классовые компоненты и их жизненный цикл? Как методы жизненного цикла соответствуют хукам и почему от классов ушли?",
  answer:
    "Классовый компонент наследует `React.Component`, хранит состояние в `this.state`, меняет его через `this.setState` — он сливает объект с состоянием на один уровень — и рисует в `render`. Жизненный цикл: монтирование (`constructor`, `render`, `componentDidMount`), обновление (`shouldComponentUpdate`, `render`, `componentDidUpdate`), размонтирование (`componentWillUnmount`). В хуках `componentDidMount` и `componentWillUnmount` — это эффект с пустыми зависимостями и его очистка, `componentDidUpdate` — эффект с зависимостями, `shouldComponentUpdate` и `PureComponent` — `memo`. От классов ушли, потому что логику трудно переиспользовать, связанный код разбросан по разным методам, а `this` путает. Классы работают, но нужны в основном для границ ошибок и старого кода.",
  theory: {
    p: [
      "Класс: `class Counter extends React.Component { state = { count: 0 }; render() { … } }`. `this.setState({ count: 1 })` сливает объект с текущим состоянием на один уровень и ставит обновление в очередь, как и сеттер хука. Второй аргумент — колбэк после обновления. Если новое состояние зависит от старого — `this.setState(prev => …)`. Обработчики нужно привязывать к `this`: стрелочными полями класса или `bind` в конструкторе.",
      "Жизненный цикл. Монтирование: `constructor` → `static getDerivedStateFromProps` → `render` → `componentDidMount` — место для подписок и запросов. Обновление: `getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` (прочитать DOM до изменений, например позицию прокрутки) → `componentDidUpdate(prevProps, prevState)`. Размонтирование: `componentWillUnmount` — отписаться.",
      "Соответствие хукам. `componentDidMount` и `componentWillUnmount` — `useEffect(() => { …; return cleanup }, [])`. `componentDidUpdate` с проверкой `prevProps.id !== this.props.id` — `useEffect` с `[id]`. `shouldComponentUpdate` и `PureComponent` — `memo`. `getSnapshotBeforeUpdate` и ошибки — аналогов нет. Хуки думают не «когда» (жизненный цикл), а «с чем синхронизироваться» (зависимости).",
      "Почему хуки. В классе подписка и отписка разнесены по `componentDidMount` и `componentWillUnmount`, а несвязанная логика смешана в одном методе. Переиспользовать логику можно было только HOC и render props. `this` в обработчиках — источник ошибок. Устаревшие методы `componentWillMount`, `componentWillReceiveProps`, `componentWillUpdate` помечены `UNSAFE_`. Новые возможности React — хуки, Server Components, Actions — работают только с функциями.",
    ],
    code: `class Clock extends React.Component<{ zone: string }, { time: string }> {
  state = { time: '' };
  private timer?: number;

  componentDidMount() {
    this.timer = window.setInterval(() => this.setState({ time: now(this.props.zone) }), 1000);
  }

  componentDidUpdate(prevProps: { zone: string }) {
    if (prevProps.zone !== this.props.zone) this.setState({ time: now(this.props.zone) });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <p>{this.state.time}</p>;
  }
}

// То же на хуках: одна синхронизация вместо трёх методов
function ClockHooks({ zone }: { zone: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    setTime(now(zone));
    const id = setInterval(() => setTime(now(zone)), 1000);
    return () => clearInterval(id);
  }, [zone]);
  return <p>{time}</p>;
}`,
    flow: {
      actors: ["Монтирование", "Обновление", "Размонтирование"],
      steps: [
        { from: 0, to: 0, label: "constructor → render → componentDidMount", note: "подписки и запросы" },
        { from: 1, to: 1, label: "shouldComponentUpdate → render → componentDidUpdate", note: "сравнить prevProps" },
        { from: 2, to: 2, label: "componentWillUnmount", note: "отписаться" },
        { from: 0, to: 2, label: "в хуках: useEffect(fn, [zone]) и его очистка", note: "одно место вместо трёх" },
      ],
    },
    keys: [
      "Класс: `this.state`, `this.setState` сливает на один уровень, `render`. Методы жизненного цикла по фазам: монтирование, обновление, размонтирование.",
      "Соответствие: `didMount` и `willUnmount` — эффект с `[]` и очистка, `didUpdate` — эффект с зависимостями, `PureComponent` — `memo`.",
      "Ушли от классов из-за разбросанной логики, `this` и сложного переиспользования. Классы нужны для границ ошибок и старого кода.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь метод класса и его аналог на хуках.",
      pairs: [
        ["`componentDidMount`", "`useEffect` с пустыми зависимостями"],
        ["`componentWillUnmount`", "функция очистки эффекта"],
        ["`componentDidUpdate` с проверкой `prevProps.id`", "`useEffect` с `[id]`"],
        ["`PureComponent`", "`memo`"],
      ],
      why: "Хуки заменяют «когда вызвать» на «от чего зависит синхронизация».",
    },
    {
      type: "order",
      q: "Расставь методы при монтировании классового компонента.",
      items: ["`constructor`", "`static getDerivedStateFromProps`", "`render`", "`componentDidMount`"],
      why: "Сначала создаётся экземпляр, потом рендер, и только после попадания в DOM — `componentDidMount`.",
    },
    {
      type: "quiz",
      q: "Почему React перешёл от классов к хукам?",
      opts: [
        "Логику трудно переиспользовать, связанный код разбросан по методам, а `this` путает",
        "Классы работают медленнее",
        "Классы удалены в React 19",
        "Классы не поддерживают состояние",
      ],
      a: 0,
      why: "Классы по-прежнему работают, но новые возможности React пишутся для функций и хуков.",
    },
    {
      type: "quiz",
      q: "Что делает `this.setState({ count: 1 })` с остальными полями состояния класса?",
      opts: [
        "Оставляет их: объект сливается с состоянием на один уровень",
        "Удаляет их",
        "Обнуляет",
        "Копирует в `prevState`",
      ],
      a: 0,
      why: "В отличие от сеттера `useState`, который заменяет значение целиком, `setState` в классе сливает объект.",
    },
  ],
};
