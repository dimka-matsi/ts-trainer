import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w1",
  region: 0,
  title: "Обработчики и объект события",
  q: "Чем `event.target` отличается от `event.currentTarget` и как правильно добавить обработчик?",
  answer: "Обработчик добавляют через `addEventListener(тип, функция, опции)`, и на один элемент можно повесить несколько обработчиков одного события. `event.target` — элемент, на котором событие произошло, `event.currentTarget` — элемент, чей обработчик сейчас выполняется. Они различаются, когда событие пришло от вложенного элемента, например от иконки внутри кнопки.",
  theory: {
    p: [
      "`element.addEventListener(\"click\", handler)` добавляет обработчик события. Обработчиков одного события может быть несколько, и они вызываются в том порядке, в котором их добавили.",
      "Обработчик получает объект события. В нём есть тип `type`, координаты мыши, нажатая клавиша и два важных поля. `target` — самый вложенный элемент, по которому кликнули. `currentTarget` — элемент, на котором висит этот обработчик. Если кликнуть по иконке внутри кнопки, `target` будет иконка, а `currentTarget` — кнопка.",
      "Третий аргумент — опции. `{ once: true }` снимет обработчик после первого вызова, это удобно для одноразовых действий.",
      "Есть и старый способ — свойство `onclick`. Оно хранит один обработчик: второе присваивание заменяет первое. Поэтому в коде приложений пишут `addEventListener`.",
    ],
    html: `<button id="btn">Кнопка <b>жирная</b></button>`,
    example: `const btn = document.getElementById("btn");

btn.addEventListener("click", (event) => {
  console.log("target:", event.target.tagName, "currentTarget:", event.currentTarget.tagName);
});
btn.addEventListener("click", () => console.log("один раз"), { once: true });

btn.onclick = () => console.log("onclick 1");
btn.onclick = () => console.log("onclick 2"); // заменил первый

btn.querySelector("b").click(); // клик по вложенному тегу
btn.click();`,
    keys: ["`addEventListener` можно вызвать несколько раз для одного события.", "`target` — где произошло, `currentTarget` — где висит обработчик.", "`onclick` хранит только один обработчик."],
  },
  tasks: [
    {
      type: "output",
      q: "Что выведется в консоль после клика по иконке внутри кнопки?",
      html: `<button id="btn"><span id="icon">★</span> Сохранить</button>`,
      code: `btn.addEventListener("click", (e) => console.log(e.target.id, e.currentTarget.id));
icon.click();`,
      opts: ["icon btn", "btn btn", "icon icon", "btn icon"],
      a: 0,
      why: "Кликнули по `span#icon`, поэтому `target` — иконка. Обработчик висит на кнопке, поэтому `currentTarget` — кнопка.",
    },
    {
      type: "output",
      q: "В каком порядке выведутся строки?",
      html: `<button id="btn">Кнопка</button>`,
      code: `btn.addEventListener("click", () => console.log("A"));
btn.addEventListener("click", () => console.log("B"));
btn.onclick = () => console.log("C");
btn.onclick = () => console.log("D");
btn.click();`,
      opts: ["A, B, D", "A, B, C, D", "D, A, B", "A, B, C"],
      a: 0,
      why: "Обработчики `addEventListener` срабатывают в порядке добавления. Свойство `onclick` хранит один обработчик: `D` заменил `C` и занял его место в очереди.",
    },
    {
      type: "dom",
      kind: "fix",
      goal: "Кнопка должна считать клики и показывать число в `#count`. Сейчас счётчик растёт, но на странице ничего не меняется. Добавь обработчик через `addEventListener` и выводи число в `#count`.",
      html: `<button id="inc">+1</button> <span id="count">0</span>`,
      code: `const button = document.getElementById("inc");
const count = document.getElementById("count");
let n = 0;

button.onclick = function () {
  n++;
};`,
      tests: `const b = document.getElementById("inc");
b.click(); b.click(); b.click();
const text = document.getElementById("count").textContent;
assert(text === "3", "После трёх кликов в #count должно быть 3, а там: " + text);`,
      must: ["addEventListener"],
      hint: "`button.addEventListener(\"click\", () => { n++; count.textContent = String(n); })`.",
      solution: `const button = document.getElementById("inc");
const count = document.getElementById("count");
let n = 0;

button.addEventListener("click", () => {
  n++;
  count.textContent = String(n);
});`,
    },
  ],
};
