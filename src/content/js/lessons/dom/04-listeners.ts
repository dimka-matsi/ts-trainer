import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom4",
  region: 6,
  level: "middle",
  title: "addEventListener: опции, preventDefault и снятие",
  q: "Какие опции есть у `addEventListener`? Как правильно снять обработчик и чем `preventDefault` отличается от `stopPropagation`?",
  answer:
    "Третий аргумент — объект опций: `capture` вешает обработчик на погружение, `once` снимает его после первого срабатывания, `passive: true` обещает не вызывать `preventDefault` — браузер тогда прокручивает страницу, не дожидаясь обработчика, `signal` снимает обработчик, когда отменят `AbortController`. `removeEventListener` снимает только ту же самую функцию с той же `capture`, поэтому анонимную стрелку снять нельзя. `preventDefault` отменяет действие браузера, например переход по ссылке, а `stopPropagation` — путь события по дереву.",
  theory: {
    p: [
      "`el.addEventListener(type, handler, options)`. Опции: `capture` — фаза погружения; `once: true` — обработчик сработает один раз и снимется сам; `passive: true` — обещание не вызывать `preventDefault`; `signal` — сигнал отмены. Один и тот же обработчик с той же `capture` повторно не добавится.",
      "Снять обработчик — `removeEventListener(type, handler, { capture })` с той же функцией и той же `capture`. Сравнение идёт по ссылке: `removeEventListener(\"click\", () => {...})` создаёт новую стрелку и ничего не снимает. Поэтому обработчик сохраняют в переменную. Удобнее — `AbortController`: создаёшь `const controller = new AbortController()`, передаёшь `{ signal: controller.signal }` во все `addEventListener`, а потом `controller.abort()` снимает их все разом. Тот же `AbortController` отменяет и сетевые запросы — это будет в регионе про Web API.",
      "`passive: true` важен для `touchstart`, `touchmove` и `wheel`. Без него браузер перед прокруткой ждёт обработчик: вдруг тот вызовет `preventDefault` и отменит прокрутку. С `passive` прокрутка идёт сразу, а вызов `preventDefault` внутри игнорируется. По стандарту DOM обработчики этих событий на `window`, `document` и `body` пассивны по умолчанию.",
      "`event.preventDefault()` отменяет действие браузера по умолчанию: переход по ссылке, отправку формы, установку галочки, контекстное меню. На путь события он не влияет — родители всё равно получат событие. `stopPropagation` — наоборот. `return false` из обработчика `addEventListener` ничего не отменяет, это работает только в свойствах вида `onclick`.",
    ],
    code: `const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();          // не перезагружать страницу
  // отправляем данные сами
});

const onScroll = () => console.log(window.scrollY);
window.addEventListener("scroll", onScroll, { passive: true });
window.removeEventListener("scroll", onScroll); // та же функция — снимется

document.addEventListener("click", () => console.log("первый клик"), { once: true });

const controller = new AbortController();
window.addEventListener("resize", () => {}, { signal: controller.signal });
window.addEventListener("keydown", () => {}, { signal: controller.signal });
controller.abort();                // оба обработчика сняты`,
    flow: {
      actors: ["Пользователь", "Обработчик", "Браузер"],
      steps: [
        { from: 0, to: 2, label: "крутит колесо мыши" },
        { from: 2, to: 1, label: "без passive: вызываю обработчик и жду", note: "вдруг он вызовет preventDefault — прокрутка ждёт" },
        { from: 1, to: 2, label: "обработчик закончил — прокручиваю" },
        { from: 2, to: 0, label: "с passive: прокручиваю сразу", note: "обработчик выполнится отдельно и не задержит прокрутку" },
      ],
    },
    keys: [
      "Опции: `capture`, `once`, `passive`, `signal`. `passive` ускоряет прокрутку, `preventDefault` в нём игнорируется.",
      "`removeEventListener` снимает только ту же функцию с той же `capture`. `AbortController` с `signal` снимает всё разом.",
      "`preventDefault` отменяет действие браузера, `stopPropagation` — путь события. `return false` в `addEventListener` не работает.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Снимется ли обработчик?",
      code: `button.addEventListener("click", () => console.log("клик"));
button.removeEventListener("click", () => console.log("клик"));`,
      opts: [
        "Нет: это две разные функции, снимается только та же ссылка",
        "Да: функции с одинаковым текстом считаются одной",
        "Да, но только после следующего клика",
        "Нет: стрелки вообще нельзя использовать как обработчики",
      ],
      a: 0,
      why: "Каждая стрелка — новый объект. Обработчик сохраняют в переменную или снимают через `signal` от `AbortController`.",
    },
    {
      type: "match",
      q: "Сопоставь опцию и что она делает.",
      pairs: [
        ["`once: true`", "снимает обработчик после первого срабатывания"],
        ["`passive: true`", "обещает не вызывать `preventDefault`, прокрутка не ждёт"],
        ["`capture: true`", "вешает обработчик на фазу погружения"],
        ["`signal`", "снимает обработчик при `abort()`"],
      ],
      why: "Все опции задаются объектом в третьем аргументе. Старая запись `true` третьим аргументом — это `capture`.",
    },
    {
      type: "quiz",
      q: "Чем `preventDefault` отличается от `stopPropagation`?",
      opts: [
        "`preventDefault` отменяет действие браузера, `stopPropagation` останавливает путь события к другим элементам",
        "Это синонимы",
        "`preventDefault` останавливает всплытие, `stopPropagation` отменяет переход по ссылке",
        "`preventDefault` работает только для форм",
      ],
      a: 0,
      why: "Можно отменить переход по ссылке и дать клику всплыть — например, чтобы роутер сам сменил страницу, а аналитика выше всё равно увидела клик.",
    },
    {
      type: "quiz",
      q: "Зачем обработчику `touchmove` опция `passive: true`?",
      opts: [
        "Браузер начнёт прокрутку сразу, не дожидаясь, отменит ли её обработчик",
        "Обработчик будет выполняться в отдельном потоке",
        "Обработчик сработает только один раз",
        "Событие перестанет всплывать",
      ],
      a: 0,
      why: "Без `passive` прокрутка ждёт обработчик, и тяжёлый код даёт рывки. С `passive` вызов `preventDefault` внутри игнорируется.",
    },
  ],
};
