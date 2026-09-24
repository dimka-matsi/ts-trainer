import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w4",
  region: 0,
  title: "Действия по умолчанию",
  q: "Что делает `event.preventDefault()` и чем он отличается от `stopPropagation()`?",
  answer: "`preventDefault()` отменяет действие браузера по умолчанию: переход по ссылке, отправку формы, установку галочки. Событие при этом продолжает всплывать. `stopPropagation()`, наоборот, останавливает всплытие, но действие браузера не отменяет. Обработчик с `{ passive: true }` обещает не вызывать `preventDefault`, и браузер может прокручивать страницу, не дожидаясь его.",
  theory: {
    p: [
      "У многих событий есть действие браузера по умолчанию. Клик по ссылке открывает адрес, отправка формы перезагружает страницу, клик по чекбоксу ставит галочку. Обработчик выполняется раньше этого действия и может его отменить.",
      "`event.preventDefault()` отменяет действие. Отменено ли оно, видно по `event.defaultPrevented`. Событие при этом не останавливается и всплывает дальше, так что родители о нём узнают.",
      "`preventDefault` и `stopPropagation` делают разное и не зависят друг от друга. Первый отменяет действие браузера, второй не пускает событие к родителям. Иногда нужны оба, иногда один.",
      "Опция `{ passive: true }` обещает браузеру, что обработчик не вызовет `preventDefault`. Для `touchstart` и `wheel` это важно: браузер начинает прокрутку сразу, не дожидаясь обработчика. Если в пассивном обработчике всё же вызвать `preventDefault`, вызов будет проигнорирован.",
    ],
    html: `<a id="link" href="https://example.com">Ссылка</a>
<form id="form"><input name="q" value="ts"> <button>Найти</button></form>
<label><input id="agree" type="checkbox"> Согласен</label>`,
    example: `document.getElementById("link").addEventListener("click", (event) => {
  event.preventDefault();
  console.log("переход отменён, defaultPrevented =", event.defaultPrevented);
});

document.getElementById("form").addEventListener("submit", (event) => {
  event.preventDefault(); // без этого страница перезагрузится
  const data = new FormData(event.currentTarget);
  console.log("ищу:", data.get("q"));
});

document.getElementById("agree").addEventListener("click", (event) => {
  event.preventDefault(); // галочка не поставится
});

document.getElementById("link").click();
document.getElementById("form").requestSubmit();`,
    keys: ["`preventDefault` отменяет действие браузера, но не всплытие.", "`stopPropagation` останавливает всплытие, но не действие.", "`passive: true` — обещание не вызывать `preventDefault`."],
  },
  tasks: [
    {
      type: "output",
      q: "Что выведется после клика по чекбоксу?",
      html: `<input id="agree" type="checkbox">`,
      code: `document.body.addEventListener("click", (e) => console.log("body, отменено:", e.defaultPrevented));
agree.addEventListener("click", (e) => e.preventDefault());
agree.click();
console.log("checked:", agree.checked);`,
      opts: ["body, отменено: true, checked: false", "checked: false", "body, отменено: false, checked: true", "body, отменено: true, checked: true"],
      a: 0,
      why: "`preventDefault` отменил установку галочки, но событие продолжило всплывать, и `body` его получил с `defaultPrevented === true`.",
    },
    {
      type: "quiz",
      q: "Нужно, чтобы клик по ссылке внутри меню не открывал адрес, но меню по-прежнему узнавало о клике. Что вызвать в обработчике на ссылке?",
      opts: ["`event.preventDefault()`", "`event.stopPropagation()`", "Оба метода", "`return false` из обработчика"],
      a: 0,
      why: "`preventDefault` отменяет переход, а всплытие не трогает, поэтому меню получит клик. `stopPropagation` как раз помешал бы меню. `return false` работает только в свойстве `onclick`, а в `addEventListener` ничего не отменяет.",
      example: `const menu = document.createElement("nav");
menu.innerHTML = '<a href="https://example.com">Пункт</a>';
document.body.append(menu);
menu.addEventListener("click", () => console.log("меню узнало о клике"));
menu.querySelector("a").addEventListener("click", (e) => e.preventDefault());
menu.querySelector("a").click();`,
    },
    {
      type: "dom",
      kind: "fix",
      goal: "Форма входа должна отменять отправку, если в email нет `@`, и показывать ошибку в `#error`. Сейчас ошибка показывается, но форма всё равно отправляется. Отменяй отправку только при ошибке, а когда email исправлен, очищай `#error`.",
      html: `<form id="login">
  <input id="email" name="email" value="">
  <button>Войти</button>
</form>
<p id="error"></p>`,
      code: `const form = document.getElementById("login");

form.addEventListener("submit", () => {
  const email = document.getElementById("email").value;
  if (!email.includes("@")) {
    document.getElementById("error").textContent = "Введите email";
  }
});`,
      tests: `const form = document.getElementById("login");
let prevented = null;
// Слушатель на document срабатывает после формы: читаем, отменила ли она отправку, и отменяем сами, чтобы страница не ушла
document.addEventListener("submit", (e) => { prevented = e.defaultPrevented; e.preventDefault(); });
form.requestSubmit();
assert(prevented === true, "Форма с ошибкой не должна отправляться: нужен preventDefault");
assert(document.getElementById("error").textContent === "Введите email", "При ошибке в #error должен быть текст «Введите email»");
document.getElementById("email").value = "ann@mail.ru";
form.requestSubmit();
assert(prevented === false, "Правильную форму отменять не нужно");
assert(document.getElementById("error").textContent === "", "Когда email исправлен, ошибка должна пропасть");`,
      hint: "Обработчик принимает `event`. При ошибке — `event.preventDefault()` и текст, иначе — пустая строка в `#error`.",
      solution: `const form = document.getElementById("login");

form.addEventListener("submit", (event) => {
  const email = document.getElementById("email").value;
  const error = document.getElementById("error");
  if (!email.includes("@")) {
    event.preventDefault();
    error.textContent = "Введите email";
  } else {
    error.textContent = "";
  }
});`,
    },
  ],
};
