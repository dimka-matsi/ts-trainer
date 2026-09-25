import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "ac1",
  region: 10,
  title: "Actions: `<form action>` и `useActionState`",
  q: "Что такое Actions в React 19? Как работают `<form action={…}>` и `useActionState`?",
  answer:
    "Action — асинхронная функция, запущенная в переходе: пока она выполняется, React знает, что идёт работа, и даёт `isPending`. В React 19 функцию можно передать прямо в `<form action={fn}>`: при отправке она получает `FormData`, React сам оборачивает её в переход, а после успеха сбрасывает неуправляемые поля. `useActionState(action, initialState)` добавляет к этому состояние: возвращает `[state, dispatchAction, isPending]`, где action получает предыдущее состояние и данные формы и возвращает новое — например, текст ошибки. Так форма с загрузкой, ошибкой и результатом пишется без ручных `useState` и `try/catch`.",
  theory: {
    p: [
      "Раньше отправка формы — это `onSubmit` с `preventDefault`, флаг загрузки, флаг ошибки, `try/catch` и сброс полей руками. В React 19 появилось понятие Action: функция, которая выполняется в переходе, в том числе асинхронная. Пока она работает, `isPending` равен `true`, а ошибки можно поймать границей ошибок или вернуть как состояние.",
      "`<form action={fn}>`. Вместо адреса в `action` передают функцию. При отправке React сам вызывает её с `FormData`, оборачивает в переход и не перезагружает страницу. После успешного выполнения React сбрасывает неуправляемые поля формы. Кнопка может запустить свою функцию: `<button formAction={saveDraft}>`.",
      "`useActionState(action, initialState)` возвращает `[state, dispatchAction, isPending]`. `action` получает предыдущее состояние и данные — при использовании с формой это `FormData` — и возвращает новое состояние: сообщение об ошибке, результат, счётчик. Вызовы выстраиваются в очередь и выполняются по одному. `dispatchAction` передают в `<form action>` или вызывают внутри `startTransition`.",
      "Советы. Ошибку лучше вернуть как состояние, а не бросать: брошенная ошибка отменит поставленные в очередь вызовы и уйдёт к границе ошибок. Третий аргумент — `permalink` — нужен для прогрессивного улучшения с Server Components: форма отправится и до загрузки JavaScript. С серверными функциями состояние и данные должны сериализоваться.",
    ],
    code: `async function subscribe(prev: { error: string | null }, formData: FormData) {
  const email = String(formData.get('email'));
  if (!email.includes('@')) return { error: 'Нужен email' };
  const res = await fetch('/api/subscribe', { method: 'POST', body: formData });
  return res.ok ? { error: null } : { error: 'Не получилось, попробуйте ещё раз' };
}

function SubscribeForm() {
  const [state, formAction, isPending] = useActionState(subscribe, { error: null });
  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>{isPending ? 'Отправляем…' : 'Подписаться'}</button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`,
    flow: {
      actors: ["Пользователь", "<form action>", "Action subscribe", "Сервер", "useActionState"],
      steps: [
        { from: 0, to: 1, label: "нажал «Подписаться»" },
        { from: 1, to: 2, label: "subscribe(prev, FormData)", note: "в переходе: isPending = true" },
        { from: 2, to: 3, label: "POST /api/subscribe" },
        { from: 3, to: 2, label: "200 OK" },
        { from: 2, to: 4, label: "новое состояние { error: null }", note: "isPending = false" },
        { from: 4, to: 1, label: "ререндер, неуправляемые поля сброшены" },
      ],
    },
    keys: [
      "Action — асинхронная функция в переходе с `isPending`. `<form action={fn}>` вызывает её с `FormData` и сбрасывает форму после успеха.",
      "`useActionState(action, initial)` → `[state, dispatchAction, isPending]`: action получает прошлое состояние и данные, возвращает новое.",
      "Ошибки возвращают как состояние. Вызовы идут в очередь по одному. `permalink` — для работы формы до загрузки JavaScript.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что возвращает `useActionState`?",
      opts: [
        "`[state, dispatchAction, isPending]`",
        "`[state, setState]`",
        "Промис с результатом",
        "`{ data, error, loading }`",
      ],
      a: 0,
      why: "Состояние, которое вернул последний вызов action, функцию для запуска и флаг, что работа ещё идёт.",
    },
    {
      type: "order",
      q: "Расставь, что происходит при отправке формы с `action={formAction}`.",
      items: [
        "пользователь нажимает кнопку отправки",
        "React вызывает action с прошлым состоянием и `FormData` в переходе",
        "`isPending` становится `true`",
        "action возвращает новое состояние",
        "компонент перерисовывается с новым состоянием, поля сброшены",
      ],
      why: "Всё, что раньше писали руками в `onSubmit`, React делает сам.",
    },
    {
      type: "quiz",
      q: "Как лучше сообщить пользователю об ошибке проверки в action?",
      opts: [
        "Вернуть её как новое состояние, например `{ error: 'Нужен email' }`",
        "Бросить исключение",
        "Показать `alert`",
        "Перезагрузить страницу",
      ],
      a: 0,
      why: "Брошенная ошибка отменит очередь вызовов и уйдёт к границе ошибок. Ожидаемые ошибки — это состояние формы.",
    },
  ],
};
