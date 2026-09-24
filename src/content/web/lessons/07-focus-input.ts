import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w7",
  region: 0,
  title: "Фокус и ввод",
  q: "Чем `focus` отличается от `focusin` и `input` от `change`?",
  answer: "`focus` и `blur` не всплывают, поэтому для делегирования берут `focusin` и `focusout`: они всплывают. Когда фокус переходит с одного поля на другое, порядок такой: `blur` и `focusout` у старого, потом `focus` и `focusin` у нового. `input` срабатывает на каждое изменение значения, а `change` — когда значение зафиксировано: у текстового поля это потеря фокуса после правки, у чекбокса и `select` — сразу.",
  theory: {
    p: [
      "`focus` и `blur` срабатывают на самом поле и не всплывают. Если повесить их на форму, форма их не услышит. Для этого есть парные всплывающие события: `focusin` и `focusout`.",
      "При переходе фокуса с поля A на поле B события идут так: `blur` и `focusout` на A, потом `focus` и `focusin` на B. Поэтому в `focusout` поле A уже теряет фокус, и в нём удобно проверять введённое значение.",
      "`input` срабатывает на каждое изменение значения: каждую букву, вставку, удаление. `change` — когда пользователь закончил: у текстового поля при потере фокуса после правки, у чекбокса, радиокнопки и `select` сразу после выбора.",
      "Все четыре события `input`, `change`, `focusin` и `focusout` всплывают. Поэтому для формы с десятью полями достаточно одного обработчика на `form`, а поле берут из `event.target`.",
    ],
    html: `<form id="form">
  <input id="login" placeholder="Логин">
  <input id="pass" placeholder="Пароль">
</form>`,
    example: `const form = document.getElementById("form");

form.addEventListener("focus", () => console.log("focus на форме — не сработает"));
form.addEventListener("focusin", (e) => console.log("focusin:", e.target.id));
form.addEventListener("focusout", (e) => console.log("focusout:", e.target.id));
form.addEventListener("input", (e) => console.log("input:", e.target.id, e.target.value));

document.getElementById("login").focus();
document.getElementById("pass").focus();`,
    keys: ["`focus` и `blur` не всплывают, `focusin` и `focusout` — всплывают.", "Порядок: `blur`, `focusout`, потом `focus`, `focusin`.", "`input` — каждое изменение, `change` — зафиксированное значение."],
  },
  tasks: [
    {
      type: "output",
      q: "Что выведется, когда фокус попадёт в поле `login`, а затем перейдёт в `pass`?",
      html: `<form id="form"><input id="login"><input id="pass"></form>`,
      code: `form.addEventListener("focus", () => console.log("focus"));
form.addEventListener("focusin", (e) => console.log("focusin", e.target.id));
form.addEventListener("focusout", (e) => console.log("focusout", e.target.id));
login.focus();
pass.focus();`,
      opts: ["focusin login, focusout login, focusin pass", "focus, focusin login, focus, focusin pass", "focusin login, focusin pass", "focusout login, focusin login, focusin pass"],
      a: 0,
      why: "`focus` не всплывает, поэтому обработчик на форме молчит. `focusin` и `focusout` всплывают. При переходе сначала уходит фокус со старого поля, потом приходит на новое.",
    },
    {
      type: "quiz",
      q: "Пользователь напечатал в текстовом поле слово «кот» и нажал Tab. Сколько раз сработают `input` и `change`?",
      opts: ["`input` — 3 раза, `change` — 1 раз", "`input` — 1 раз, `change` — 3 раза", "Оба по 3 раза", "Оба по 1 разу"],
      a: 0,
      why: "`input` срабатывает на каждую букву. `change` у текстового поля — один раз, когда поле теряет фокус с изменённым значением.",
      example: `const field = document.createElement("input");
document.body.append(field);
field.addEventListener("input", () => console.log("input:", field.value));
field.addEventListener("change", () => console.log("change:", field.value));
// В браузере при вводе «кот» и Tab:
// input: к, input: ко, input: кот, change: кот`,
    },
    {
      type: "dom",
      kind: "fix",
      goal: "Поле, из которого ушёл фокус, должно получать класс `touched`, чтобы показать ошибки только у тронутых полей. Обработчик висит на форме, но слушает `blur`, а он не всплывает, поэтому ничего не работает. Исправь событие.",
      html: `<form id="signup">
  <input id="name" placeholder="Имя">
  <input id="mail" placeholder="Email">
</form>`,
      code: `const form = document.getElementById("signup");

form.addEventListener("blur", (event) => {
  event.target.classList.add("touched");
});`,
      tests: `const nameField = document.getElementById("name");
const mailField = document.getElementById("mail");
nameField.focus();
mailField.focus();
assert(nameField.classList.contains("touched"), "Поле «Имя» потеряло фокус и должно получить класс touched");
assert(!mailField.classList.contains("touched"), "Поле Email ещё в фокусе, класса у него быть не должно");`,
      must: ["const form = document.getElementById(\"signup\");"],
      hint: "Всплывающая пара для `blur` — `focusout`.",
      solution: `const form = document.getElementById("signup");

form.addEventListener("focusout", (event) => {
  event.target.classList.add("touched");
});`,
    },
  ],
};
