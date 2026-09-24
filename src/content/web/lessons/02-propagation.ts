import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w2",
  region: 0,
  title: "Всплытие и погружение",
  q: "Что такое всплытие и погружение событий и как их остановить?",
  answer: "Событие проходит три фазы: погружение от `window` вниз до элемента, фазу цели и всплытие обратно вверх. Обычные обработчики срабатывают на всплытии, с опцией `{ capture: true }` — на погружении. `stopPropagation()` останавливает путь события дальше, но остальные обработчики на текущем элементе ещё выполнятся. `stopImmediatePropagation()` отменяет и их.",
  theory: {
    p: [
      "Клик по кнопке внутри `div` — событие и для кнопки, и для всех её родителей. Сначала оно идёт сверху вниз, от `window` до кнопки: это погружение. Потом срабатывает на самой кнопке: фаза цели. Затем поднимается обратно до `window`: это всплытие. Номер фазы лежит в `event.eventPhase`: 1, 2 и 3.",
      "Обработчик из `addEventListener` по умолчанию срабатывает на всплытии. С опцией `{ capture: true }` он сработает раньше, на погружении. Поэтому родитель с `capture` узнаёт о клике до самой кнопки.",
      "`event.stopPropagation()` останавливает событие: родители выше его не получат. Другие обработчики на том же элементе всё равно выполнятся. Чтобы остановить и их, вызывают `stopImmediatePropagation()`.",
      "Всплывают не все события. `focus`, `blur`, `mouseenter` и `mouseleave` не всплывают, это видно по `event.bubbles === false`. Останавливать всплытие без причины не стоит: обработчики выше, например аналитика или закрытие меню по клику снаружи, перестанут работать.",
    ],
    html: `<div id="outer"><div id="inner"><button id="btn">Клик</button></div></div>`,
    example: `for (const id of ["outer", "inner", "btn"]) {
  const el = document.getElementById(id);
  el.addEventListener("click", () => console.log("погружение:", id), { capture: true });
  el.addEventListener("click", () => console.log("всплытие:", id));
}
document.getElementById("btn").click();`,
    keys: ["Порядок: погружение сверху вниз, цель, всплытие снизу вверх.", "Обработчик по умолчанию — на всплытии, с `capture: true` — на погружении.", "`stopPropagation` не отменяет обработчики на текущем элементе."],
  },
  tasks: [
    {
      type: "output",
      q: "В каком порядке выведутся строки после клика по кнопке?",
      html: `<div id="outer"><div id="inner"><button id="btn">Клик</button></div></div>`,
      code: `outer.addEventListener("click", () => console.log("outer"));
inner.addEventListener("click", () => console.log("inner capture"), { capture: true });
btn.addEventListener("click", () => console.log("btn"));
btn.click();`,
      opts: ["inner capture, btn, outer", "btn, inner capture, outer", "outer, inner capture, btn", "btn, outer, inner capture"],
      a: 0,
      why: "Обработчик с `capture` срабатывает на пути вниз, раньше самой кнопки. Обработчик `outer` без `capture` ждёт всплытия и срабатывает последним.",
    },
    {
      type: "output",
      q: "Что выведется после клика по кнопке?",
      html: `<div id="outer"><button id="btn">Клик</button></div>`,
      code: `btn.addEventListener("click", (e) => {
  console.log("1");
  e.stopPropagation();
});
btn.addEventListener("click", () => console.log("2"));
outer.addEventListener("click", () => console.log("outer"));
btn.click();`,
      opts: ["1, 2", "1", "1, 2, outer", "1, outer"],
      a: 0,
      why: "`stopPropagation` не пускает событие к родителю, поэтому `outer` молчит. Второй обработчик на той же кнопке всё равно срабатывает: его отменил бы только `stopImmediatePropagation`.",
    },
    {
      type: "dom",
      kind: "fix",
      goal: "Модальное окно должно закрываться по клику на затемнение вокруг него (`#backdrop`). Сейчас оно закрывается и при клике по тексту или кнопке внутри окна: клик всплывает до `#backdrop`. Закрывай окно, только если кликнули по самому затемнению.",
      html: `<div id="backdrop" class="open">
  <div id="modal"><p>Текст окна</p><button id="ok">OK</button></div>
</div>`,
      code: `const backdrop = document.getElementById("backdrop");

backdrop.addEventListener("click", () => {
  backdrop.classList.remove("open");
});`,
      tests: `const backdrop = document.getElementById("backdrop");
document.querySelector("#modal p").click();
assert(backdrop.classList.contains("open"), "Клик по тексту внутри окна не должен его закрывать");
document.getElementById("ok").click();
assert(backdrop.classList.contains("open"), "Клик по кнопке внутри окна не должен его закрывать");
backdrop.click();
assert(!backdrop.classList.contains("open"), "Клик по затемнению должен закрывать окно");`,
      hint: "Сравни `event.target` с `event.currentTarget`: они равны, только когда кликнули по самому `#backdrop`.",
      solution: `const backdrop = document.getElementById("backdrop");

backdrop.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    backdrop.classList.remove("open");
  }
});`,
    },
  ],
};
