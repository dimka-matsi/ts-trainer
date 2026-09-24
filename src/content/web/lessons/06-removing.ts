import type { WebLesson } from "../types";

export const lesson: WebLesson = {
  id: "w6",
  region: 0,
  title: "Снятие обработчиков",
  q: "Почему `removeEventListener` иногда не снимает обработчик и как снять сразу несколько?",
  answer: "`removeEventListener` снимает обработчик, только если передать ту же самую функцию и то же значение `capture`. Анонимную стрелку снять не получится: новая стрелка — другая функция. Удобнее передать `{ signal }` от `AbortController`: один вызов `abort()` снимет все обработчики с этим сигналом.",
  theory: {
    p: [
      "`removeEventListener(тип, функция)` ищет обработчик по ссылке на функцию. Если передать новую стрелку с тем же текстом, это другая функция, и ничего не снимется. Поэтому обработчик, который потом нужно снять, сохраняют в переменную.",
      "Нужно совпадение и по `capture`. Обработчик, добавленный с `{ capture: true }`, снимается только вызовом с `{ capture: true }`. Опции `once` и `passive` на поиск не влияют.",
      "Современный способ — `AbortController`. Его `signal` передают в опциях: `addEventListener(\"click\", fn, { signal })`. Вызов `controller.abort()` снимает все обработчики с этим сигналом сразу, даже анонимные.",
      "Забытые обработчики на `window` и `document` — частая причина утечек памяти в одностраничных приложениях: компонент удалён, а его обработчики продолжают работать. Поэтому при удалении компонента обработчики снимают.",
    ],
    html: `<button id="btn">Клик</button>`,
    example: `const btn = document.getElementById("btn");

const onClick = () => console.log("именованный");
btn.addEventListener("click", onClick);
btn.addEventListener("click", () => console.log("анонимный"));

btn.removeEventListener("click", onClick);                           // снимется
btn.removeEventListener("click", () => console.log("анонимный"));    // не снимется
btn.click();

const controller = new AbortController();
window.addEventListener("resize", () => console.log("resize"), { signal: controller.signal });
document.addEventListener("keydown", () => console.log("keydown"), { signal: controller.signal });
controller.abort(); // оба сняты одним вызовом
window.dispatchEvent(new Event("resize"));`,
    keys: ["Снять можно только ту же функцию с тем же `capture`.", "`{ signal }` и `abort()` снимают много обработчиков сразу.", "Забытые обработчики на `window` — утечка памяти."],
  },
  tasks: [
    {
      type: "output",
      q: "Что выведется в консоль?",
      html: `<button id="btn">Клик</button>`,
      code: `const log = () => console.log("клик");
btn.addEventListener("click", log);
btn.removeEventListener("click", () => console.log("клик"));
btn.click();
btn.removeEventListener("click", log);
btn.click();`,
      opts: ["клик", "клик, клик", "клик, клик, клик", "Ошибка: обработчик не найден"],
      a: 0,
      why: "Первый `removeEventListener` получил новую стрелку и ничего не снял, поэтому первый клик сработал. Второй передал ту же функцию `log` и снял обработчик.",
    },
    {
      type: "output",
      q: "Что выведется в консоль?",
      html: `<button id="btn">Клик</button>`,
      code: `const h = () => console.log("h");
btn.addEventListener("click", h, { capture: true });
btn.removeEventListener("click", h);
btn.click();`,
      opts: ["h", "h, h", "Ошибка: обработчик не найден", "undefined"],
      a: 0,
      why: "Обработчик добавлен с `capture: true`, а снимают его без этой опции. Это разные записи, поэтому обработчик остался и сработал.",
    },
    {
      type: "dom",
      kind: "write",
      goal: "`mount` вешает обработчики на `window` и `document` и возвращает `destroy`. Сейчас `destroy` ничего не делает, и обработчики живут после удаления компонента. Сделай так, чтобы `destroy` снимал оба обработчика.",
      html: `<div id="widget"></div>`,
      code: `function mount(el) {
  const onResize = () => console.log("resize");
  const onKey = (e) => console.log("key", e.key);
  window.addEventListener("resize", onResize);
  document.addEventListener("keydown", onKey);

  return function destroy() {
    // сними оба обработчика
  };
}`,
      tests: `const destroy = mount(document.getElementById("widget"));
window.dispatchEvent(new Event("resize"));
document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
assert(logs().length === 2, "До destroy оба обработчика должны работать");
destroy();
window.dispatchEvent(new Event("resize"));
document.dispatchEvent(new KeyboardEvent("keydown", { key: "b" }));
assert(logs().length === 2, "После destroy обработчики не должны срабатывать, а сработали: " + logs().slice(2).join(", "));`,
      must: ["function mount(el)"],
      hint: "Создай `const controller = new AbortController()`, передай `{ signal: controller.signal }` в оба `addEventListener`, а в `destroy` вызови `controller.abort()`.",
      solution: `function mount(el) {
  const controller = new AbortController();
  const onResize = () => console.log("resize");
  const onKey = (e) => console.log("key", e.key);
  window.addEventListener("resize", onResize, { signal: controller.signal });
  document.addEventListener("keydown", onKey, { signal: controller.signal });

  return function destroy() {
    controller.abort();
  };
}`,
    },
  ],
};
