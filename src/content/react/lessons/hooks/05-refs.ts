import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "hk5",
  region: 2,
  title: "useRef, ref как проп и useImperativeHandle",
  q: "Что такое `useRef` и чем ref отличается от состояния? Как передать ref в свой компонент?",
  answer:
    "`useRef` возвращает объект `{ current }`, который живёт между рендерами, но его изменение не вызывает ререндер. Его используют для доступа к DOM-элементу — фокус, прокрутка, измерения — и для значений, которые не нужны для отображения: id таймера, прошлое значение. В React 19 `ref` передают своему компоненту как обычный проп, а `forwardRef` больше не нужен. `useImperativeHandle` позволяет отдать родителю не сам DOM-узел, а ограниченный набор методов.",
  theory: {
    p: [
      "`const inputRef = useRef<HTMLInputElement>(null)` и `<input ref={inputRef} />`: после коммита React положит DOM-узел в `inputRef.current`. Теперь в обработчике можно вызвать `inputRef.current.focus()`. Во время рендера `ref.current` не читают и не меняют — это нарушает чистоту; с ним работают в обработчиках и эффектах.",
      "Ref или состояние. Ref — ящик, за которым React не следит: изменил `ref.current` — экран не обновится. Состояние — для того, что показывается на экране. Ref — для служебного: id `setInterval`, флаг «уже отправлено», предыдущее значение, экземпляр сторонней библиотеки.",
      "Ref в свой компонент. До React 19 функциональный компонент не принимал `ref`, и нужен был `forwardRef`. В React 19 `ref` — обычный проп: `function MyInput({ ref, ...props })`. `forwardRef` оставлен для совместимости и в будущем будет объявлен устаревшим. Ещё одна новинка React 19: колбэк в `ref` может вернуть функцию очистки.",
      "`useImperativeHandle(ref, () => ({ focus, scrollToTop }))` отдаёт родителю свой объект с методами, а не весь DOM-узел. Так компонент сам решает, что можно делать снаружи. Пользуются им редко: почти всё решается пропсами, а ref нужен для фокуса, прокрутки, анимаций и интеграции с кодом не на React.",
    ],
    code: `function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <MyInput ref={inputRef} placeholder="Поиск" />
      <button onClick={() => inputRef.current?.focus()}>Найти</button>
    </>
  );
}

// React 19: ref — обычный проп, forwardRef не нужен
function MyInput({ ref, ...props }: React.ComponentProps<'input'>) {
  return <input ref={ref} {...props} />;
}

function Stopwatch() {
  const intervalRef = useRef<number | null>(null); // служебное значение, на экран не влияет
  const [ms, setMs] = useState(0);
  const start = () => {
    intervalRef.current = window.setInterval(() => setMs((m) => m + 10), 10);
  };
  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  return <button onClick={ms ? stop : start}>{ms}</button>;
}`,
    flow: {
      actors: ["Search", "MyInput (ref — проп)", "DOM input", "inputRef.current"],
      steps: [
        { from: 0, to: 1, label: "ref={inputRef}" },
        { from: 1, to: 2, label: "<input ref={ref}>" },
        { from: 2, to: 3, label: "после коммита: узел в current" },
        { from: 0, to: 3, label: "клик: inputRef.current.focus()", note: "в обработчике, а не в рендере" },
        { from: 3, to: 2, label: "фокус на поле" },
      ],
    },
    keys: [
      "`useRef` — объект `{ current }` между рендерами. Изменение не вызывает ререндер.",
      "Ref — для DOM-узлов и служебных значений, состояние — для того, что на экране. `ref.current` не трогают во время рендера.",
      "В React 19 `ref` — обычный проп, `forwardRef` не нужен. `useImperativeHandle` отдаёт родителю ограниченный набор методов.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Счётчик кликов хранится в `useRef`, и по клику выполняется `countRef.current++`. Что увидит пользователь?",
      opts: [
        "Число на экране не изменится: изменение ref не вызывает ререндер",
        "Число увеличится",
        "React выбросит ошибку",
        "Компонент перерисуется дважды",
      ],
      a: 0,
      why: "Значение в ref меняется, но React об этом не знает. То, что показывается, держат в состоянии.",
    },
    {
      type: "sort",
      q: "Что хранить в ref, а что в состоянии?",
      groups: ["ref", "Состояние"],
      items: [
        ["id запущенного `setInterval`", 0],
        ["DOM-узел поля для фокуса", 0],
        ["флаг «аналитика уже отправлена»", 0],
        ["текст, который показывается на экране", 1],
        ["открыто ли меню", 1],
      ],
      why: "Если от значения зависит отрисовка — состояние. Если оно служебное — ref.",
    },
    {
      type: "quiz",
      q: "Как в React 19 передать ref в свой функциональный компонент?",
      opts: [
        "Как обычный проп `ref`, без `forwardRef`",
        "Только через `forwardRef`",
        "Через контекст",
        "Никак: ref бывает только у DOM-элементов",
      ],
      a: 0,
      why: "С React 19 `ref` не отфильтровывается из пропсов функционального компонента. `forwardRef` остался ради совместимости.",
    },
  ],
};
