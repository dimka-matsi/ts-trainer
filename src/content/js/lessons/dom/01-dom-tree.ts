import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom1",
  region: 6,
  title: "DOM: дерево, поиск и изменение",
  q: "Что такое DOM? Чем `querySelectorAll` отличается от `getElementsByClassName`, а `textContent` — от `innerHTML`?",
  answer:
    "DOM — объектная модель документа: браузер превращает HTML в дерево объектов-узлов, и JavaScript читает и меняет страницу через это дерево. `querySelectorAll` возвращает статический `NodeList` — снимок на момент вызова, а `getElementsByClassName` — живую `HTMLCollection`, которая сама обновляется при изменении страницы. `textContent` читает и записывает только текст, а `innerHTML` разбирает строку как HTML — поэтому вставлять через него данные пользователя опасно: это прямой путь к XSS.",
  theory: {
    p: [
      "DOM (Document Object Model) — дерево объектов, которое браузер строит из HTML. Каждый тег — узел-элемент, текст между тегами — текстовый узел, есть узлы-комментарии. Корень — `document`, под ним `document.documentElement` (`<html>`), `document.head` и `document.body`. Меняя объекты дерева, JavaScript меняет страницу.",
      "Поиск. `document.getElementById(\"id\")` — один элемент или `null`. `querySelector(css)` — первый элемент по CSS-селектору или `null`, `querySelectorAll(css)` — статический `NodeList`, который не меняется после вызова. Старые `getElementsByClassName` и `getElementsByTagName` возвращают живую `HTMLCollection`: добавишь элемент с этим классом — он появится в коллекции. `el.closest(css)` ищет вверх по дереву ближайшего предка, подходящего под селектор, включая сам элемент.",
      "Навигация. `children` — только дочерние элементы, `childNodes` — все узлы, включая текстовые: переносы строк и пробелы между тегами тоже узлы. `parentElement`, `nextElementSibling` и `firstElementChild` ходят по элементам, пропуская текст.",
      "Изменение. `textContent` работает с чистым текстом: запись экранирует всё, и теги останутся текстом. `innerHTML` разбирает строку как разметку — вставка туда пользовательского ввода открывает XSS. Элементы создают через `document.createElement` и вставляют методами `append`, `prepend`, `before`, `after`, удаляют — `el.remove()`. Классы — `el.classList.add/remove/toggle`, атрибуты `data-*` — через `el.dataset`.",
    ],
    code: `// <ul id="list"><li class="item">1</li><li class="item">2</li></ul>
const list = document.getElementById("list");
const live = document.getElementsByClassName("item");  // живая коллекция
const fixed = document.querySelectorAll(".item");      // снимок

const li = document.createElement("li");
li.className = "item";
li.textContent = "<b>3</b>";   // теги останутся текстом — безопасно
list.append(li);

console.log(live.length, fixed.length); // 3 2
console.log(list.children.length);      // 3 — только элементы
li.closest("ul") === list;              // true: ближайший предок ul`,
    flow: {
      actors: ["HTML-текст", "Парсер браузера", "Дерево DOM", "JavaScript"],
      steps: [
        { from: 0, to: 1, label: "<ul><li>1</li></ul> приходит по сети" },
        { from: 1, to: 2, label: "строит узлы: ul → li → текст «1»" },
        { from: 3, to: 2, label: "querySelector(\"li\"): найти узел" },
        { from: 3, to: 2, label: "li.textContent = \"2\": изменить узел", note: "браузер перерисует страницу по новому дереву" },
      ],
    },
    keys: [
      "DOM — дерево объектов-узлов, построенное из HTML. Текст и переносы строк — тоже узлы.",
      "`querySelectorAll` — статический снимок, `getElementsBy…` — живая коллекция. `closest` ищет предка по селектору.",
      "`textContent` безопасен, `innerHTML` разбирает HTML — пользовательские данные через него не вставляют.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "На странице два элемента с классом `item`. Что выведет код?",
      code: `const live = document.getElementsByClassName("item");
const fixed = document.querySelectorAll(".item");
const div = document.createElement("div");
div.className = "item";
document.body.append(div);
console.log(live.length, fixed.length);`,
      opts: ["`3 2`", "`3 3`", "`2 2`", "`2 3`"],
      a: 0,
      why: "`getElementsByClassName` возвращает живую коллекцию — она увидела новый элемент. `querySelectorAll` — снимок на момент вызова.",
    },
    {
      type: "quiz",
      q: "Разметка — `<ul>`, внутри на отдельных строках два `<li>`. Чему равны `ul.children.length` и `ul.childNodes.length`?",
      opts: ["`2` и `5`", "`2` и `2`", "`5` и `2`", "`2` и `3`"],
      a: 0,
      why: "`childNodes` содержит и текстовые узлы: перенос строки перед первым `<li>`, между ними и после второго. Итого три текстовых узла и два элемента.",
    },
    {
      type: "match",
      q: "Сопоставь метод и что он возвращает.",
      pairs: [
        ["`getElementById`", "один элемент или `null`"],
        ["`querySelector`", "первый элемент по селектору или `null`"],
        ["`querySelectorAll`", "статический `NodeList`"],
        ["`getElementsByClassName`", "живую `HTMLCollection`"],
      ],
      why: "Живая коллекция пересчитывается при каждом обращении и меняется вместе со страницей. Снимок — нет.",
    },
    {
      type: "quiz",
      q: "Почему нельзя писать `comment.innerHTML = userText`?",
      opts: [
        "Строка разберётся как HTML, и вредный код из неё может выполниться — это XSS",
        "`innerHTML` не работает с кириллицей",
        "`innerHTML` медленнее `textContent` в сто раз",
        "`innerHTML` удаляет элемент со страницы",
      ],
      a: 0,
      why: "Например, `<img src=x onerror=...>` в тексте запустит обработчик. Для текста — `textContent`. Подробно атаки разобраны в направлении «Безопасность».",
    },
  ],
};
