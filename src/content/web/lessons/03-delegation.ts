import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w3",
  region: 0,
  title: "Делегирование событий",
  q: "Что такое делегирование событий и зачем оно нужно?",
  answer: "Вместо обработчика на каждом элементе вешают один на общего родителя и по `event.target` определяют, где был клик. Это работает благодаря всплытию. Так меньше обработчиков, и работают элементы, добавленные позже. Нужный элемент ищут через `event.target.closest(селектор)`, потому что клик мог прийти во вложенный тег.",
  theory: {
    p: [
      "Событие всплывает до родителей, поэтому родитель узнаёт о клике по любому своему потомку. Делегирование использует это: один обработчик на списке вместо обработчика на каждом пункте.",
      "`event.target` — самый вложенный элемент, это может быть иконка или `span` внутри кнопки. Чтобы найти нужный элемент, вызывают `event.target.closest(\".del\")`: метод поднимается от `target` вверх и возвращает первый подходящий элемент или `null`.",
      "Данные для обработчика удобно хранить в `data-`-атрибутах: `<li data-id=\"3\">` читается как `li.dataset.id`. Так обработчик понимает, с каким пунктом работать.",
      "Главный плюс — элементы, добавленные позже, работают без новых обработчиков. Ограничения: не всплывающие события (`focus`, `blur`) так не поймать, а `stopPropagation` ниже по дереву ломает делегирование.",
    ],
    html: `<ul id="todo">
  <li data-id="1">Купить хлеб <button class="del">×</button></li>
  <li data-id="2">Позвонить <button class="del">×</button></li>
</ul>`,
    example: `const list = document.getElementById("todo");

list.addEventListener("click", (event) => {
  const button = event.target.closest(".del");
  if (!button) return;               // кликнули не по кнопке удаления
  const item = button.closest("li");
  console.log("удаляю", item.dataset.id);
  item.remove();
});

const li = document.createElement("li");
li.dataset.id = "3";
li.innerHTML = 'Новая задача <button class="del">×</button>';
list.append(li);
li.querySelector(".del").click();     // работает и для нового элемента`,
    keys: ["Один обработчик на родителе вместо многих на детях.", "Нужный элемент ищут через `event.target.closest(...)`.", "Элементы, добавленные позже, работают сами."],
  },
  tasks: [
    {
      type: "output",
      q: "Что выведется после клика по тексту «О нас»?",
      html: `<ul id="menu">
  <li data-page="home"><span>Главная</span></li>
  <li data-page="about"><span>О нас</span></li>
</ul>`,
      code: `menu.addEventListener("click", (e) => {
  console.log(e.target.dataset.page, e.target.closest("li").dataset.page);
});
menu.querySelector('[data-page="about"] span').click();`,
      opts: ["undefined about", "about about", "about undefined", "null about"],
      a: 0,
      why: "Кликнули по `span`, у него нет `data-page`, поэтому первое значение `undefined`. `closest(\"li\")` поднимается до пункта меню, у которого атрибут есть.",
    },
    {
      type: "quiz",
      q: "Почему делегирование работает для элементов, которые добавили в список после установки обработчика?",
      opts: [
        "Обработчик висит на родителе, а событие всплывает к нему от любого потомка",
        "Браузер копирует обработчики на новые элементы",
        "`closest` сам добавляет обработчики",
        "Не работает: для новых элементов нужен новый обработчик",
      ],
      a: 0,
      why: "Новый элемент — тоже потомок списка. Клик по нему всплывает до списка, и один обработчик на списке его получает.",
      example: `const list = document.createElement("ul");
document.body.append(list);
list.addEventListener("click", (e) => console.log("клик по", e.target.textContent));

const later = document.createElement("li");
later.textContent = "новый пункт";
list.append(later);
later.click(); // клик по новый пункт`,
    },
    {
      type: "dom",
      kind: "fix",
      goal: "Вкладки работают, но у каждой кнопки свой обработчик, и вкладка, добавленная позже, не реагирует. Перепиши на делегирование: один обработчик на `#tabs`. По клику кнопка получает класс `active` (у остальных он снимается), а её `data-tab` пишется в `#content`.",
      html: `<div id="tabs">
  <button data-tab="a" class="active">A</button>
  <button data-tab="b">B</button>
  <button data-tab="c">C</button>
</div>
<p id="content">a</p>`,
      code: `const buttons = document.querySelectorAll("#tabs button");

buttons.forEach((b) => {
  b.addEventListener("click", () => {
    buttons.forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    document.getElementById("content").textContent = b.dataset.tab;
  });
});`,
      tests: `const tabs = document.getElementById("tabs");
tabs.querySelector('[data-tab="b"]').click();
assert(document.getElementById("content").textContent === "b", "После клика по B в #content должно быть b");
const d = document.createElement("button");
d.dataset.tab = "d";
d.textContent = "D";
tabs.append(d);
d.click();
assert(document.getElementById("content").textContent === "d", "Вкладка D, добавленная позже, тоже должна работать");
assert(d.classList.contains("active") && tabs.querySelectorAll(".active").length === 1, "Активной должна остаться только D");`,
      must: ["closest"],
      hint: "Обработчик на `#tabs`, внутри `const button = event.target.closest(\"button\")`. Если `button` нет — выйти.",
      solution: `const tabs = document.getElementById("tabs");

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  tabs.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
  button.classList.add("active");
  document.getElementById("content").textContent = button.dataset.tab;
});`,
    },
  ],
};
