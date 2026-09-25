import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa4",
  region: 7,
  title: "IntersectionObserver, ResizeObserver, MutationObserver",
  q: "Зачем нужны `IntersectionObserver`, `ResizeObserver` и `MutationObserver`? Почему они лучше обработчика `scroll`?",
  answer:
    "`IntersectionObserver` сообщает, когда элемент входит в видимую область или выходит из неё, — на нём делают ленивую загрузку картинок, бесконечную ленту и учёт показов. `ResizeObserver` сообщает об изменении размера конкретного элемента, а не окна. `MutationObserver` — об изменениях в DOM: добавлении узлов, атрибутов, текста. Они лучше обработчика `scroll` с `getBoundingClientRect`, потому что браузер сам считает пересечения и размеры, не заставляя пересчитывать раскладку на каждое событие, и вызывает колбэк пачкой, асинхронно.",
  theory: {
    p: [
      "Раньше видимость элемента проверяли так: обработчик `scroll`, в нём `el.getBoundingClientRect()` для каждого элемента. Событие приходит десятки раз в секунду, а каждый замер размеров заставляет браузер заново посчитать раскладку. Лента из сотни карточек начинала тормозить. Observers решают это: ты говоришь, за чем следить, а браузер сам сообщает об изменениях.",
      "`IntersectionObserver(callback, { root, rootMargin, threshold })` следит за пересечением элементов с областью просмотра или с `root`. `rootMargin: \"200px\"` срабатывает заранее, за 200 пикселей до появления, — чтобы картинка успела загрузиться. `threshold: 0.5` — когда видна половина. В колбэк приходит список записей с `isIntersecting` и `intersectionRatio`. Применение: ленивая загрузка, бесконечная прокрутка, учёт показов рекламы, анимация при появлении.",
      "`ResizeObserver` сообщает о новом размере элемента, по какой бы причине тот ни изменился — окно, соседний блок, новый текст. Событие `resize` у `window` такого не знает. На нём строят адаптивные компоненты, которые подстраиваются под свою ширину, и графики, перерисовывающиеся под контейнер.",
      "`MutationObserver` следит за изменениями DOM: `childList` (добавили или удалили детей), `attributes`, `characterData`, `subtree`. Колбэк получает пачку записей и вызывается микрозадачей — после текущего кода, но до отрисовки. Нужен, когда страницу меняет чужой код: виджеты, расширения. У всех трёх есть `unobserve` и `disconnect` — наблюдение снимают, когда оно не нужно.",
    ],
    code: `const lazy = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    img.src = img.dataset.src;           // грузим, когда картинка близко
    observer.unobserve(img);             // больше следить не нужно
  }
}, { rootMargin: "200px" });
document.querySelectorAll("img[data-src]").forEach((img) => lazy.observe(img));

const sizes = new ResizeObserver(([entry]) => {
  const width = entry.contentRect.width;
  entry.target.classList.toggle("compact", width < 400);
});
sizes.observe(document.querySelector(".card"));

const mutations = new MutationObserver((records) => {
  console.log("изменений:", records.length); // пачкой, микрозадачей
});
mutations.observe(document.body, { childList: true, subtree: true });`,
    flow: {
      actors: ["Пользователь", "Браузер", "IntersectionObserver", "Код"],
      steps: [
        { from: 0, to: 1, label: "прокручивает ленту" },
        { from: 1, to: 2, label: "сам считает пересечения, без лишней раскладки" },
        { from: 2, to: 3, label: "колбэк: картинка в 200px от экрана", note: "вызов пачкой, не на каждый пиксель прокрутки" },
        { from: 3, to: 1, label: "img.src = … ; unobserve(img)" },
      ],
    },
    keys: [
      "`IntersectionObserver` — видимость: ленивая загрузка, бесконечная лента, показы. `rootMargin` срабатывает заранее.",
      "`ResizeObserver` — размер конкретного элемента. `MutationObserver` — изменения DOM, колбэк микрозадачей.",
      "Observers не заставляют пересчитывать раскладку на каждое событие и вызывают колбэк пачкой. Наблюдение снимают `unobserve` и `disconnect`.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь задачу и подходящий инструмент.",
      pairs: [
        ["подгружать картинки, когда они близко к экрану", "`IntersectionObserver`"],
        ["перестроить график, когда сузился его контейнер", "`ResizeObserver`"],
        ["узнать, что чужой виджет вставил элементы в страницу", "`MutationObserver`"],
        ["плавно двигать элемент каждый кадр", "`requestAnimationFrame`"],
      ],
      why: "Каждый observer отвечает на свой вопрос: видно ли, какой размер, что поменялось в DOM.",
    },
    {
      type: "quiz",
      q: "Почему ленивую загрузку делают на `IntersectionObserver`, а не на обработчике `scroll` с `getBoundingClientRect`?",
      opts: [
        "Браузер сам считает пересечения и вызывает колбэк редко, без пересчёта раскладки на каждое событие прокрутки",
        "Событие `scroll` не срабатывает на телефонах",
        "`getBoundingClientRect` не работает для картинок",
        "`IntersectionObserver` выполняется в отдельном потоке и поэтому не может ошибиться",
      ],
      a: 0,
      why: "`scroll` приходит очень часто, а замер размеров в каждом обработчике заставляет браузер пересчитывать раскладку. Это главный источник рывков при прокрутке.",
    },
    {
      type: "quiz",
      q: "Когда вызывается колбэк `MutationObserver` после изменения DOM?",
      opts: [
        "Микрозадачей — после текущего кода, пачкой записей обо всех изменениях",
        "Синхронно, сразу при каждом изменении",
        "Макрозадачей через `setTimeout`",
        "Только после события `load`",
      ],
      a: 0,
      why: "Если код добавит сто элементов подряд, колбэк вызовется один раз со списком изменений.",
    },
    {
      type: "order",
      q: "Расставь шаги ленивой загрузки картинки через `IntersectionObserver`.",
      items: [
        "создать наблюдатель с `rootMargin`",
        "вызвать `observe` для каждой картинки с `data-src`",
        "в колбэке при `isIntersecting` переписать `data-src` в `src`",
        "вызвать `unobserve` для загруженной картинки",
      ],
      why: "Снимать наблюдение важно: загруженная картинка больше не нужна наблюдателю. Для простых случаев есть готовый атрибут `loading=\"lazy\"`.",
    },
  ],
};
