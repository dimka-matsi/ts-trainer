import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w5",
  region: 0,
  title: "Пользовательские события",
  q: "Как создать и отправить своё событие и передать в нём данные?",
  answer: "Событие создают через `new CustomEvent(\"имя\", { detail, bubbles: true })` и отправляют методом `dispatchEvent`. Данные лежат в `event.detail`. По умолчанию своё событие не всплывает, поэтому для подписки на родителе нужен `bubbles: true`. `dispatchEvent` синхронный: все обработчики выполнятся до следующей строки кода.",
  theory: {
    p: [
      "Своё событие создают конструктором `CustomEvent`: первым аргументом имя, вторым настройки. Данные передают в поле `detail`, обработчик читает их как `event.detail`. Имя удобно давать с префиксом, например `cart:add`, чтобы не спутать со встроенными событиями.",
      "Событие отправляют методом `element.dispatchEvent(event)`. По умолчанию `bubbles: false`: событие получат только обработчики на самом элементе. Чтобы его поймал родитель или `document`, нужно `bubbles: true`.",
      "`dispatchEvent` работает синхронно: все обработчики выполняются сразу, и только потом код идёт дальше. Этим встроенный вызов отличается от кликов пользователя, которые браузер обрабатывает в своей очереди.",
      "С `cancelable: true` обработчик может вызвать `preventDefault`, и тогда `dispatchEvent` вернёт `false`. Так компонент спрашивает разрешения: «я собираюсь удалить элемент, никто не против?»",
    ],
    html: `<div id="app"><button id="add">В корзину</button></div>`,
    example: `const app = document.getElementById("app");

app.addEventListener("cart:add", (event) => {
  console.log("добавлен товар", event.detail.id);
});

document.getElementById("add").addEventListener("click", (event) => {
  const custom = new CustomEvent("cart:add", { detail: { id: 42 }, bubbles: true });
  event.currentTarget.dispatchEvent(custom);
  console.log("после dispatchEvent");
});

document.getElementById("add").click();`,
    keys: ["`new CustomEvent(имя, { detail })` и `dispatchEvent`.", "Без `bubbles: true` родители событие не получат.", "`dispatchEvent` синхронный, с `cancelable` возвращает `false` при отмене."],
  },
  tasks: [
    {
      type: "output",
      q: "В каком порядке выведутся строки?",
      code: `document.addEventListener("ping", () => console.log("обработчик"));
console.log("до");
document.dispatchEvent(new CustomEvent("ping"));
console.log("после");`,
      opts: ["до, обработчик, после", "до, после, обработчик", "обработчик, до, после", "до, после"],
      a: 0,
      why: "`dispatchEvent` вызывает обработчики сразу, синхронно. Код после него продолжится, только когда они отработают.",
    },
    {
      type: "output",
      q: "Что выведется в консоль?",
      html: `<div id="parent"><span id="child">x</span></div>`,
      code: `parent.addEventListener("hello", () => console.log("родитель"));
child.addEventListener("hello", () => console.log("ребёнок"));
child.dispatchEvent(new CustomEvent("hello"));
child.dispatchEvent(new CustomEvent("hello", { bubbles: true }));`,
      opts: ["ребёнок, ребёнок, родитель", "ребёнок, родитель, ребёнок, родитель", "ребёнок, ребёнок", "родитель, ребёнок"],
      a: 0,
      why: "Первое событие создано без `bubbles`, поэтому его получает только сам элемент. Второе всплывает и доходит до родителя.",
    },
    {
      type: "dom",
      kind: "write",
      goal: "Перед удалением элемента отправь событие `item:remove` с `detail: { id }`, которое всплывает и может быть отменено. Если кто-то его отменил, элемент удалять нельзя.",
      html: `<ul id="list"><li id="item">Задача</li></ul>
<button id="del">Удалить</button>`,
      code: `const item = document.getElementById("item");

document.getElementById("del").addEventListener("click", () => {
  item.remove();
});`,
      tests: `let got = null;
let block = true;
document.addEventListener("item:remove", (e) => {
  got = e.detail;
  if (block) e.preventDefault();
});
document.getElementById("del").click();
assert(got && got.id === "item", "Событие item:remove должно дойти до document с detail.id = \\"item\\"");
assert(document.getElementById("item"), "Если событие отменили, элемент удалять нельзя");
block = false;
document.getElementById("del").click();
assert(!document.getElementById("item"), "Если никто не отменил событие, элемент должен удалиться");`,
      must: ["CustomEvent", "dispatchEvent"],
      hint: "`new CustomEvent(\"item:remove\", { detail: { id: item.id }, bubbles: true, cancelable: true })`, а удаляй, только если `dispatchEvent` вернул `true`.",
      solution: `const item = document.getElementById("item");

document.getElementById("del").addEventListener("click", () => {
  const event = new CustomEvent("item:remove", {
    detail: { id: item.id },
    bubbles: true,
    cancelable: true,
  });
  if (item.dispatchEvent(event)) item.remove();
});`,
    },
  ],
};
