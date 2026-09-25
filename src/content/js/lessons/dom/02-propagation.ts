import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom2",
  region: 6,
  title: "Всплытие и погружение событий",
  q: "Что такое всплытие и погружение событий? Чем `event.target` отличается от `event.currentTarget`?",
  answer:
    "Событие проходит три фазы. Погружение — от `window` вниз до элемента, где оно случилось. Фаза цели — на самом элементе. Всплытие — обратно вверх до `window`. Обработчики по умолчанию срабатывают на всплытии, а с опцией `capture: true` — на погружении. `event.target` — элемент, где событие произошло, он одинаковый на всём пути. `event.currentTarget` — элемент, чей обработчик выполняется сейчас. `stopPropagation()` останавливает дальнейший путь события.",
  theory: {
    p: [
      "Клик по кнопке внутри `div` — это клик и по `div`, и по `body`, и по всему документу. Поэтому событие путешествует по дереву в три фазы. Погружение (capturing): от `window` через `document`, `html`, `body` вниз до родителя цели. Цель (target): на самом элементе. Всплытие (bubbling): от цели обратно вверх до `window`.",
      "`addEventListener(type, handler)` вешает обработчик на фазу всплытия. Третий аргумент `true` или `{ capture: true }` — на фазу погружения. Поэтому при клике по вложенной кнопке обработчик родителя с `capture` сработает раньше обработчика кнопки, а обычный обработчик родителя — позже.",
      "Объект события несёт две ссылки. `event.target` — самый глубокий элемент, где событие возникло, он не меняется на всём пути. `event.currentTarget` — элемент, на котором висит текущий обработчик. В обычной функции-обработчике `this` равен `currentTarget`, в стрелке — внешнему `this`.",
      "`event.stopPropagation()` останавливает путь: выше (или ниже при погружении) событие не пойдёт, но другие обработчики на этом же элементе выполнятся. `stopImmediatePropagation()` отменяет и их. Останавливают редко: это ломает обработчики выше, например аналитику. Всплывают не все события: `focus`, `blur`, `mouseenter`, `mouseleave`, `load` не всплывают, для фокуса есть всплывающие `focusin` и `focusout`.",
    ],
    code: `// <div id="outer"><button id="inner">Нажми</button></div>
const outer = document.getElementById("outer");
const inner = document.getElementById("inner");

outer.addEventListener("click", () => console.log("outer: всплытие"));
outer.addEventListener("click", () => console.log("outer: погружение"), { capture: true });
inner.addEventListener("click", (event) => {
  console.log("inner: цель");
  console.log(event.target === inner, event.currentTarget === inner);
});
outer.addEventListener("click", function (event) {
  console.log(event.target.id, event.currentTarget.id, this === outer); // inner outer true
});
// клик по кнопке: outer: погружение → inner: цель → outer: всплытие → …`,
    flow: {
      actors: ["window", "document", "div#outer", "button#inner"],
      steps: [
        { from: 0, to: 1, label: "погружение: window → document" },
        { from: 1, to: 2, label: "погружение: обработчики с capture: true" },
        { from: 2, to: 3, label: "фаза цели: обработчики кнопки" },
        { from: 3, to: 2, label: "всплытие: обычные обработчики div", note: "event.target всё ещё кнопка" },
        { from: 2, to: 0, label: "всплытие дальше: body, document, window" },
      ],
    },
    keys: [
      "Три фазы: погружение сверху вниз, цель, всплытие снизу вверх. По умолчанию обработчик — на всплытии, `capture: true` — на погружении.",
      "`target` — где событие возникло, `currentTarget` — где висит текущий обработчик (`this` в обычной функции).",
      "`stopPropagation` останавливает путь события. `focus`, `blur`, `mouseenter` не всплывают.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Пользователь кликнул по кнопке `#inner` внутри `#outer`. В каком порядке появятся сообщения?",
      code: `outer.addEventListener("click", () => console.log("outer bubble"));
outer.addEventListener("click", () => console.log("outer capture"), true);
inner.addEventListener("click", () => console.log("inner"));`,
      opts: ["`outer capture`, `inner`, `outer bubble`", "`inner`, `outer capture`, `outer bubble`", "`outer bubble`, `outer capture`, `inner`", "`inner`, `outer bubble`, `outer capture`"],
      a: 0,
      why: "Погружение идёт сверху: сначала обработчик с `capture` на родителе. Потом цель, потом всплытие к родителю.",
    },
    {
      type: "order",
      q: "Расставь, где побывает событие клика по кнопке внутри `div`.",
      items: [
        "`window` и `document` при погружении",
        "`div` при погружении",
        "сама кнопка — фаза цели",
        "`div` при всплытии",
        "`document` и `window` при всплытии",
      ],
      why: "Путь одинаковый туда и обратно, просто на погружении срабатывают обработчики с `capture`, а на всплытии — обычные.",
    },
    {
      type: "quiz",
      q: "Обработчик висит на `<ul>`, клик пришёлся по `<li>` внутри. Чему равны `event.target` и `event.currentTarget`?",
      opts: ["`target` — `li`, `currentTarget` — `ul`", "Оба — `ul`", "Оба — `li`", "`target` — `ul`, `currentTarget` — `li`"],
      a: 0,
      why: "`target` — где событие возникло, `currentTarget` — чей обработчик выполняется. На этом строится приём из следующего урока.",
    },
    {
      type: "quiz",
      q: "Что сделает `event.stopPropagation()` в обработчике кнопки?",
      opts: [
        "Событие не дойдёт до обработчиков родителей, но другие обработчики этой кнопки выполнятся",
        "Отменит действие браузера по умолчанию",
        "Удалит обработчик кнопки",
        "Отменит все остальные обработчики на странице",
      ],
      a: 0,
      why: "Действие по умолчанию отменяет `preventDefault` — это другое. Чтобы не вызвать и соседние обработчики на том же элементе, есть `stopImmediatePropagation`.",
    },
  ],
};
