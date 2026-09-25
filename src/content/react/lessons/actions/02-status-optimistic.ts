import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "ac2",
  region: 10,
  title: "`useFormStatus` и `useOptimistic`",
  q: "Зачем нужны `useFormStatus` и `useOptimistic`? Какие у них подвохи?",
  answer:
    "`useFormStatus` из `react-dom` сообщает компоненту внутри формы, отправляется ли она: `pending`, отправленные `data`, `method` и `action`. Так кнопка отправки сама знает, что блокироваться, без передачи пропсов. Подвох: хук работает только в компоненте, отрисованном внутри `<form>`, и смотрит на родительскую форму — в компоненте, который саму форму рендерит, `pending` всегда `false`. `useOptimistic(value)` показывает результат до ответа сервера: пока идёт Action, на экране оптимистичное значение, а когда Action закончился, React возвращается к настоящему `value` — при ошибке откат происходит сам.",
  theory: {
    p: [
      "`const { pending, data, method, action } = useFormStatus()`. Хук берёт статус ближайшей родительской формы. Типичное применение — кнопка отправки, которую переиспользуют в разных формах: она сама становится неактивной и показывает «Отправляем…», а форма ничего ей не передаёт.",
      "Главный подвох: вызвать `useFormStatus` в том же компоненте, который рендерит `<form>`, бесполезно — `pending` будет всегда `false`. Хук должен быть в компоненте внутри формы. И он видит только свою родительскую форму, а не соседние или вложенные.",
      "`const [optimistic, setOptimistic] = useOptimistic(value, reducer?)`. Внутри Action вызывают `setOptimistic(…)` — React сразу рисует оптимистичное значение. Пока Action выполняется, оно держится на экране. Когда Action завершился, React рисует настоящий `value`: при успехе это новые данные с сервера, при ошибке — старые, и откат происходит сам, без кода.",
      "Правила `useOptimistic`: сеттер вызывают только внутри Action — в `startTransition` или в `action` формы, иначе будет предупреждение и значение мелькнёт и пропадёт. Если базовое значение может измениться, пока Action идёт, используют редьюсер: он пересчитывает оптимистичное состояние от свежих данных. Как и любую оптимистичность, её применяют к частым обратимым действиям: лайк, отправка сообщения, отметка задачи.",
    ],
    code: `function SubmitButton() {
  const { pending } = useFormStatus(); // статус родительской формы
  return <button disabled={pending}>{pending ? 'Отправляем…' : 'Отправить'}</button>;
}

function Chat({ messages, send }: { messages: string[]; send: (text: string) => Promise<void> }) {
  const [optimistic, addOptimistic] = useOptimistic(messages, (list, text: string) => [...list, text + ' (отправка…)']);

  async function action(formData: FormData) {
    const text = String(formData.get('text'));
    addOptimistic(text); // видно сразу
    await send(text); // когда завершится — покажутся настоящие messages
  }

  return (
    <form action={action}>
      <ul>{optimistic.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <input name="text" />
      <SubmitButton />
    </form>
  );
}`,
    flow: {
      actors: ["Пользователь", "useOptimistic", "Action send", "Сервер"],
      steps: [
        { from: 0, to: 2, label: "отправил «Привет»" },
        { from: 2, to: 1, label: "addOptimistic('Привет')", note: "на экране сразу «Привет (отправка…)»" },
        { from: 2, to: 3, label: "POST /messages" },
        { from: 3, to: 2, label: "ошибка сети", note: "Action завершился", lost: true },
        { from: 1, to: 0, label: "показан настоящий messages без «Привет»", note: "откат сам, без кода" },
      ],
    },
    keys: [
      "`useFormStatus` — статус родительской формы: `pending`, `data`, `method`, `action`. Только в компоненте внутри `<form>`.",
      "`useOptimistic(value, reducer?)` — оптимистичное значение, пока идёт Action; после завершения — настоящий `value`, откат при ошибке сам.",
      "Сеттер `useOptimistic` — только внутри Action. Применяют к частым обратимым действиям.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      code: `function Form() {
  const { pending } = useFormStatus();
  return (
    <form action={save}>
      <button disabled={pending}>Сохранить</button>
    </form>
  );
}`,
      q: "Почему кнопка никогда не блокируется?",
      opts: [
        "`useFormStatus` вызван в компоненте, который сам рендерит форму: `pending` всегда `false`",
        "`disabled` не работает с кнопками в форме",
        "`save` должен быть синхронным",
        "Нужен `useState` для `pending`",
      ],
      a: 0,
      why: "Хук смотрит на родительскую форму. Кнопку выносят в отдельный компонент внутри `<form>`.",
    },
    {
      type: "quiz",
      q: "Что покажет `useOptimistic`, если Action завершился ошибкой?",
      opts: [
        "Настоящее значение `value`: оптимистичное исчезнет само",
        "Оптимистичное значение останется навсегда",
        "Пустой список",
        "Ошибку рендера",
      ],
      a: 0,
      why: "Оптимистичное состояние живёт только пока Action выполняется. Дальше всегда показывается `value`.",
    },
    {
      type: "match",
      q: "Сопоставь хук и задачу.",
      pairs: [
        ["`useActionState`", "состояние, которое возвращает action, и `isPending`"],
        ["`useFormStatus`", "статус отправки родительской формы"],
        ["`useOptimistic`", "показать результат до ответа сервера"],
      ],
      why: "Три хука React 19 для форм закрывают состояние, статус и оптимистичный интерфейс.",
    },
  ],
};
