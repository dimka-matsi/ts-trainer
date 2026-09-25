import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom8",
  region: 6,
  level: "middle",
  title: "Размеры, координаты и прокрутка",
  q: "Чем отличаются `offsetWidth`, `clientWidth`, `scrollWidth` и `getBoundingClientRect`? Чем `clientX` отличается от `pageX`?",
  answer:
    "`offsetWidth` — ширина элемента с рамкой и полосой прокрутки, `clientWidth` — внутренняя видимая область без рамки и полосы, `scrollWidth` — полная ширина содержимого вместе со скрытым за прокруткой. `getBoundingClientRect()` даёт координаты и размеры относительно окна, с учётом трансформаций и дробных пикселей. У событий мыши `clientX` считается от окна, а `pageX` — от начала документа, то есть с учётом прокрутки. Чтение размеров заставляет браузер пересчитать раскладку, поэтому чтения и записи стилей группируют.",
  theory: {
    p: [
      "Размеры элемента. `offsetWidth` и `offsetHeight` — внешний размер: содержимое, внутренние отступы, рамка и полоса прокрутки. `clientWidth` и `clientHeight` — внутренняя видимая область: без рамки и полосы прокрутки. `scrollWidth` и `scrollHeight` — всё содержимое, включая то, что скрыто за прокруткой. Если `scrollHeight > clientHeight`, у элемента есть что прокручивать. Все они округлены до целых пикселей.",
      "`el.getBoundingClientRect()` возвращает `{ x, y, width, height, top, left, bottom, right }` относительно окна просмотра — в дробных пикселях и с учётом `transform`. Чтобы получить координаты относительно документа, к ним прибавляют прокрутку: `rect.top + window.scrollY`.",
      "Прокрутка. `window.scrollY` и `el.scrollTop` — на сколько прокручено; их можно записывать. `el.scrollIntoView({ behavior: \"smooth\", block: \"center\" })` прокручивает к элементу, `window.scrollTo({ top: 0, behavior: \"smooth\" })` — к началу. Координаты событий мыши: `clientX/clientY` — от окна, `pageX/pageY` — от документа, `offsetX/offsetY` — от элемента-цели.",
      "Любое чтение размеров или координат требует актуальной раскладки. Если перед этим меняли стили, браузер вынужден пересчитать раскладку прямо сейчас — это принудительный reflow. Чередование «записал стиль — прочитал размер» в цикле даёт layout thrashing и тормоза. Правило: сначала все чтения, потом все записи. Подробно — в направлении «Оптимизация».",
    ],
    code: `const box = document.querySelector(".box");
console.log(box.offsetWidth, box.clientWidth, box.scrollWidth);

const rect = box.getBoundingClientRect();
console.log(rect.top, rect.top + window.scrollY); // от окна и от документа

document.addEventListener("click", (event) => {
  console.log(event.clientX, event.pageX);         // pageX = clientX + scrollX
});

box.scrollIntoView({ behavior: "smooth", block: "center" });

// плохо: чтение после записи в каждой итерации — reflow на каждом шаге
for (const item of document.querySelectorAll(".item")) {
  item.style.width = box.offsetWidth + "px";
}
// хорошо: одно чтение, потом записи
const width = box.offsetWidth;
for (const item of document.querySelectorAll(".item")) item.style.width = width + "px";`,
    flow: {
      actors: ["Код", "Стили", "Раскладка", "Экран"],
      steps: [
        { from: 0, to: 1, label: "item.style.width = …: раскладка устарела" },
        { from: 0, to: 2, label: "box.offsetWidth: нужен свежий размер" },
        { from: 2, to: 2, label: "принудительный reflow прямо сейчас", note: "в цикле — на каждой итерации" },
        { from: 2, to: 3, label: "отрисовка после всех изменений" },
      ],
    },
    keys: [
      "`offsetWidth` — с рамкой и полосой, `clientWidth` — внутренняя видимая часть, `scrollWidth` — всё содержимое.",
      "`getBoundingClientRect` — относительно окна, дробные пиксели, с `transform`. `clientX` — от окна, `pageX` — от документа.",
      "Чтение размеров после записи стилей вызывает reflow. Сначала читаем, потом пишем.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь свойство и что оно измеряет.",
      pairs: [
        ["`offsetWidth`", "ширина с рамкой и полосой прокрутки"],
        ["`clientWidth`", "видимая внутренняя ширина без рамки и полосы"],
        ["`scrollWidth`", "ширина всего содержимого, включая скрытое"],
        ["`getBoundingClientRect().width`", "ширина на экране с учётом `transform`, дробная"],
      ],
      why: "Если элемент уменьшен через `transform: scale(0.5)`, `offsetWidth` не изменится, а ширина из `getBoundingClientRect` станет вдвое меньше.",
    },
    {
      type: "quiz",
      q: "Страница прокручена на 500 пикселей вниз, пользователь кликнул в 100 пикселях от верха окна. Чему равны `clientY` и `pageY`?",
      opts: ["`clientY` — 100, `pageY` — 600", "Оба 100", "`clientY` — 600, `pageY` — 100", "Оба 600"],
      a: 0,
      why: "`clientY` считается от окна просмотра, `pageY` — от начала документа и включает прокрутку.",
    },
    {
      type: "quiz",
      q: "Цикл по 1000 элементов: в каждой итерации меняется стиль элемента и читается `offsetHeight` контейнера. Почему это медленно?",
      opts: [
        "Каждое чтение после записи заставляет браузер пересчитать раскладку — тысяча пересчётов вместо одного",
        "`offsetHeight` делает сетевой запрос",
        "Цикл `for` медленный в JavaScript",
        "Браузер перерисовывает экран после каждой записи",
      ],
      a: 0,
      why: "Раскладка считается лениво, но чтение размера требует её немедленно. Чтения выносят до цикла, а записи делают пачкой.",
    },
  ],
};
