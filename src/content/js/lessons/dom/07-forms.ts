import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom7",
  region: 6,
  level: "middle",
  title: "Формы: события, FormData и проверка",
  q: "Чем событие `input` отличается от `change`? Как собрать данные формы и проверить их без библиотек?",
  answer:
    "`input` срабатывает на каждое изменение значения, а `change` — когда изменение завершено: у текстового поля — при потере фокуса, у чекбокса и списка — сразу при выборе. Данные формы собирает `new FormData(form)`: она берёт все поля с атрибутом `name`, умеет несколько значений под одним ключом и файлы, и её можно сразу отправить на сервер как тело запроса. Встроенная проверка — атрибуты `required`, `type`, `pattern`, `min`, `maxlength` и API `checkValidity`, `reportValidity`, `setCustomValidity`. Отправку перехватывают на событии `submit` формы, а не на клике по кнопке.",
  theory: {
    p: [
      "События полей. `input` — на каждое изменение: ввод символа, вставка, выбор в списке. `change` — когда пользователь закончил: текстовое поле потеряло фокус с новым значением, чекбокс переключили, выбрали пункт в `<select>`. Для живого поиска слушают `input`, для сохранения по завершении — `change`. У формы есть `submit` (отправка кнопкой или Enter) и `reset`.",
      "Отправку ловят на `submit` формы: он срабатывает и по Enter, и по кнопке, а клик по кнопке — нет. В обработчике `event.preventDefault()` отменяет перезагрузку страницы. Поля формы доступны как `form.elements.email`. Кнопка без `type` внутри формы — это `submit`, поэтому служебные кнопки помечают `type=\"button\"`.",
      "`new FormData(form)` собирает значения всех полей с атрибутом `name`, включая файлы. Методы: `get` (первое значение), `getAll` (все значения ключа, например отмеченные чекбоксы), `append`, `set`, `has`. В объект — `Object.fromEntries(formData)`, но при повторе ключа останется последнее значение. `FormData` можно отправить на сервер как тело запроса — браузер сам поставит `multipart/form-data`.",
      "Встроенная проверка. Атрибуты `required`, `type=\"email\"`, `pattern`, `min`, `max`, `minlength` браузер проверяет перед отправкой и показывает подсказку. Из JavaScript: `input.validity` — что именно не так, `form.checkValidity()` — всё ли верно, `reportValidity()` — показать подсказки, `setCustomValidity(\"текст\")` — своя ошибка. Проверка в браузере — удобство, а не защита: сервер проверяет всё заново.",
    ],
    code: `const form = document.querySelector("form");
const email = form.elements.email;

email.addEventListener("input", () => console.log("печатает:", email.value));
email.addEventListener("change", () => console.log("закончил:", email.value));

form.addEventListener("submit", (event) => {
  event.preventDefault();                       // без перезагрузки
  if (!form.checkValidity()) return form.reportValidity();
  const data = new FormData(form);
  console.log(data.get("email"), data.getAll("tags"));
});

email.addEventListener("input", () => {
  email.setCustomValidity(email.value.endsWith("@test.ru") ? "Тестовые адреса нельзя" : "");
});`,
    flow: {
      actors: ["Пользователь", "Поле email", "Форма", "Обработчик"],
      steps: [
        { from: 0, to: 1, label: "печатает: input на каждый символ" },
        { from: 0, to: 1, label: "уходит из поля: change один раз" },
        { from: 0, to: 2, label: "Enter или кнопка: submit" },
        { from: 2, to: 3, label: "preventDefault, checkValidity, new FormData(form)", note: "проверка в браузере — удобство, сервер проверит заново" },
      ],
    },
    keys: [
      "`input` — на каждое изменение, `change` — по завершении. Отправку ловят на `submit` формы.",
      "`new FormData(form)` собирает поля с `name`, `getAll` — все значения ключа. Её можно сразу отправить на сервер.",
      "Встроенная проверка: `required`, `pattern`, `checkValidity`, `setCustomValidity`. Сервер всё равно проверяет сам.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "`FormData` работает и без страницы. Что выведет этот код?",
      code: `const data = new FormData();
data.append("tag", "js");
data.append("tag", "ts");
data.set("name", "Аня");
data.set("name", "Борис");
console.log(data.get("tag"), data.getAll("tag").length);
console.log(data.get("name"), Object.fromEntries(data).tag);`,
      opts: ["js 2\nБорис ts", "ts 2\nБорис ts", "js 2\nАня js", "js 1\nБорис js"],
      a: 0,
      why: "`append` добавляет ещё одно значение, `set` заменяет все. `get` возвращает первое значение ключа, а `Object.fromEntries` при повторе оставляет последнее.",
    },
    {
      type: "match",
      q: "Сопоставь событие и когда оно срабатывает у текстового поля.",
      pairs: [
        ["`input`", "на каждый введённый символ"],
        ["`change`", "когда поле потеряло фокус с новым значением"],
        ["`submit`", "на форме при нажатии Enter или кнопки отправки"],
        ["`invalid`", "когда поле не прошло встроенную проверку"],
      ],
      why: "Для чекбоксов и `<select>` `change` срабатывает сразу при выборе — там нет «набора текста».",
    },
    {
      type: "quiz",
      q: "Почему отправку формы ловят на `submit`, а не на `click` кнопки?",
      opts: [
        "`submit` срабатывает и по Enter в поле, и по кнопке, и проходит встроенную проверку",
        "`click` не работает на кнопках внутри формы",
        "`submit` быстрее",
        "Так требует React",
      ],
      a: 0,
      why: "Клик по кнопке пропустит отправку с клавиатуры. `submit` — единая точка для всех способов отправить форму.",
    },
  ],
};
