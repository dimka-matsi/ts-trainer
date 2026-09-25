import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "dom6",
  region: 6,
  title: "Web Components и Shadow DOM",
  q: "Что такое Web Components? Зачем нужен Shadow DOM?",
  answer:
    "Web Components — стандарты браузера для своих элементов без фреймворка. Custom Elements — класс, унаследованный от `HTMLElement`, который регистрируют через `customElements.define(\"user-card\", UserCard)`; у него есть колбэки жизненного цикла `connectedCallback`, `disconnectedCallback` и `attributeChangedCallback`. Shadow DOM — изолированное поддерево элемента: его стили не протекают наружу, а внешние стили не ломают его. `<template>` и `<slot>` задают разметку и места для содержимого снаружи. Такие элементы работают в любом фреймворке, поэтому на них делают дизайн-системы.",
  theory: {
    p: [
      "Custom Elements. Класс `class UserCard extends HTMLElement` с методами жизненного цикла: `connectedCallback` — элемент вставлен в документ, `disconnectedCallback` — удалён (здесь снимают обработчики), `attributeChangedCallback` — изменился атрибут из списка `static observedAttributes`. Регистрация — `customElements.define(\"user-card\", UserCard)`. В имени обязателен дефис, чтобы не пересечься с будущими тегами HTML.",
      "Shadow DOM. `this.attachShadow({ mode: \"open\" })` создаёт теневой корень — отдельное поддерево. Стили внутри него действуют только на него, а стили страницы не проникают внутрь, кроме наследуемых свойств вроде `color` и шрифта и CSS-переменных. Так встроенные элементы вроде `<video>` прячут свои кнопки. Снаружи настраивают через CSS-переменные и `::part()`.",
      "`<template>` хранит разметку, которую браузер не отображает, пока её не склонируют. `<slot>` внутри теневого дерева — место, куда попадут дети элемента из обычного DOM: `<user-card><span slot=\"name\">Аня</span></user-card>`. События из теневого дерева при всплытии наружу «перенацеливаются»: снаружи `event.target` — сам компонент.",
      "Где применяют: дизайн-системы, которые должны работать в React, Vue и без фреймворка, виджеты для встраивания на чужие сайты. Минусы: нет встроенной реактивности и шаблонизации, серверный рендеринг теневого дерева — через декларативный Shadow DOM (`<template shadowrootmode=\"open\">`). Поверх стандартов пишут библиотеки вроде Lit.",
    ],
    code: `class UserCard extends HTMLElement {
  static observedAttributes = ["name"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = \`
      <style>p { color: var(--card-color, teal); } /* не утечёт наружу */</style>
      <p>Привет, <slot name="name">гость</slot>!</p>
      <span></span>\`;
  }
  connectedCallback() { console.log("вставлен в страницу"); }
  disconnectedCallback() { console.log("удалён — снимаем обработчики"); }
  attributeChangedCallback(attr, oldValue, newValue) {
    this.shadowRoot.querySelector("span").textContent = newValue;
  }
}
customElements.define("user-card", UserCard);

// <user-card name="admin"><b slot="name">Аня</b></user-card>`,
    flow: {
      actors: ["Страница", "user-card", "Теневой корень", "Слот"],
      steps: [
        { from: 0, to: 1, label: "<user-card> вставлен → connectedCallback" },
        { from: 1, to: 2, label: "attachShadow: своё поддерево со своими стилями" },
        { from: 0, to: 3, label: "<b slot=\"name\"> из страницы показан в слоте" },
        { from: 2, to: 0, label: "клик внутри: снаружи event.target — сам user-card", note: "стили страницы внутрь не проникают" },
      ],
    },
    keys: [
      "Custom Elements: класс от `HTMLElement`, `customElements.define`, имя с дефисом, колбэки жизненного цикла.",
      "Shadow DOM изолирует разметку и стили. Настройка снаружи — CSS-переменные и `::part()`.",
      "`<template>` и `<slot>` — шаблон и места для содержимого. Работает в любом фреймворке, поверх — библиотеки вроде Lit.",
    ],
  },
  tasks: [
    {
      type: "match",
      q: "Сопоставь колбэк Custom Element и когда он вызывается.",
      pairs: [
        ["`connectedCallback`", "элемент вставлен в документ"],
        ["`disconnectedCallback`", "элемент удалён из документа"],
        ["`attributeChangedCallback`", "изменился атрибут из `observedAttributes`"],
        ["`constructor`", "элемент создан, до вставки"],
      ],
      why: "Обработчики и подписки ставят в `connectedCallback` и снимают в `disconnectedCallback` — элемент могут вставлять и удалять много раз.",
    },
    {
      type: "quiz",
      q: "На странице есть правило `p { color: red }`. Какого цвета будет `<p>` внутри теневого дерева компонента со своим `p { color: teal }`?",
      opts: ["Бирюзовым: стили страницы не проникают в теневое дерево", "Красным: стили страницы всегда главнее", "Зависит от порядка подключения стилей", "Чёрным: в теневом дереве стили не работают"],
      a: 0,
      why: "Shadow DOM изолирует селекторы. Внутрь проходят только наследуемые свойства и CSS-переменные.",
    },
    {
      type: "quiz",
      q: "Почему дизайн-систему для компании, где есть команды на React, Vue и Angular, могут сделать на Web Components?",
      opts: [
        "Это стандарт браузера: свой элемент работает в любом фреймворке и без него",
        "Web Components быстрее любого фреймворка",
        "Web Components не нужен JavaScript",
        "Фреймворки запрещают свои компоненты",
      ],
      a: 0,
      why: "Для фреймворка свой элемент — просто тег. Одну реализацию не нужно переписывать под каждый стек.",
    },
  ],
};
