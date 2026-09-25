import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj6",
  region: 3,
  title: "Proxy и Reflect",
  q: "Что такое `Proxy` и `Reflect`? Где их применяют?",
  answer:
    "`Proxy` — обёртка над объектом, которая перехватывает операции с ним: чтение и запись свойств, удаление, проверку `in`, перебор ключей, вызов функции. Перехватчики — ловушки `get`, `set`, `has`, `deleteProperty` и другие — задаются в объекте `handler`. `Reflect` — набор функций, которые выполняют те же операции по умолчанию, поэтому из ловушки удобно вызвать `Reflect.get(...)` и изменить только нужное. На `Proxy` построены реактивность Vue 3 и MobX, валидация, значения по умолчанию, логирование доступа.",
  theory: {
    p: [
      "`new Proxy(target, handler)` создаёт объект-посредника. Все операции идут через него: если в `handler` есть подходящая ловушка, вызывается она, иначе операция выполняется над `target` как обычно. Ловушки: `get` (чтение), `set` (запись), `has` (оператор `in`), `deleteProperty`, `ownKeys` (перебор ключей), `apply` (вызов, если цель — функция), `construct` (вызов через `new`) и другие.",
      "`Reflect` содержит функции с теми же именами, что и ловушки: `Reflect.get(target, key, receiver)`, `Reflect.set(...)`, `Reflect.has(...)`. Они делают стандартное действие. Типичная ловушка меняет поведение частично и передаёт остальное в `Reflect`. Ловушка `set` должна вернуть `true`, иначе в строгом режиме запись бросит `TypeError`.",
      "Где применяют. Реактивность: Vue 3 и MobX оборачивают данные в `Proxy`, в `get` запоминают, кто читал свойство, а в `set` сообщают об изменении. Валидация: `set` проверяет значение и бросает ошибку. Значения по умолчанию: `get` возвращает запасное значение для отсутствующих ключей. Отладка: логирование каждого обращения.",
      "Ограничения. Прокси — другой объект: `proxy !== target`. Встроенные объекты с внутренними слотами, например `Date`, через прокси работают плохо: их методы ждут настоящий объект. Каждая операция через ловушку медленнее прямой, поэтому в горячем коде прокси не используют.",
    ],
    code: `const user = { name: "Аня", age: 25 };

const logged = new Proxy(user, {
  get(target, key, receiver) {
    console.log("читаем", String(key));
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    if (key === "age" && typeof value !== "number") throw new TypeError("age — число");
    return Reflect.set(target, key, value, receiver); // true — запись удалась
  },
});

console.log(logged.name);
logged.age = 26;
console.log(user.age);             // 26 — изменился настоящий объект
try {
  logged.age = "много";
} catch (e) {
  console.log(e.name, e.message);
}
console.log(logged === user);      // false — это другой объект`,
    keys: [
      "`Proxy` перехватывает операции с объектом через ловушки `get`, `set`, `has`, `deleteProperty`, `apply` и другие.",
      "`Reflect` выполняет операцию по умолчанию — из ловушки меняют только нужное. `set` должен вернуть `true`.",
      "Применение: реактивность Vue 3 и MobX, валидация, значения по умолчанию. Прокси — другой объект и медленнее прямого доступа.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const target = { a: 1 };
const proxy = new Proxy(target, {
  get(t, key) {
    return key in t ? t[key] : "нет";
  },
  has(t, key) {
    return key.startsWith("a");
  },
});
console.log(proxy.a, proxy.b);
console.log("abc" in proxy, "a" in target, "abc" in target);
proxy.c = 3;
console.log(target.c);`,
      opts: ["1 нет\ntrue true false\n3", "1 undefined\nfalse true false\nundefined", "1 нет\ntrue true false\nнет", "1 нет\nfalse true true\n3"],
      a: 0,
      why: "`get` вернул запасное значение для отсутствующего ключа. `has` перехватывает `in` только у прокси, у самого объекта `in` честный. Ловушки `set` нет, поэтому запись прошла в `target`.",
    },
    {
      type: "quiz",
      q: "Как Vue 3 узнаёт, что компонент нужно перерисовать после `state.count++`?",
      opts: [
        "`state` — это `Proxy`: ловушка `get` запомнила, кто читал `count`, а ловушка `set` сообщила об изменении",
        "Vue сравнивает весь объект с прошлой копией каждые 16 мс",
        "Vue заменяет `count` на геттер через `Object.freeze`",
        "Браузер сам сообщает о любом изменении объекта",
      ],
      a: 0,
      why: "Прокси видит и чтения, и записи, поэтому Vue точно знает, какие компоненты зависят от какого свойства.",
    },
    {
      type: "run",
      goal: "Напиши `withDefault(obj, fallback)`: возвращает прокси, который для отсутствующих свойств отдаёт `fallback`, а для существующих — их значение. Оператор `in` должен работать честно.",
      code: `function withDefault(obj, fallback) {
  return obj;
}`,
      tests: [
        ["withDefault({ a: 1 }, 0).a", "1"],
        ["withDefault({ a: 1 }, 0).b", "0"],
        ["\"b\" in withDefault({}, 0)", "false"],
        ["withDefault({ a: undefined }, 5).a", "undefined"],
      ],
      solution: `function withDefault(obj, fallback) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      return key in target ? Reflect.get(target, key, receiver) : fallback;
    },
  });
}`,
      hint: "Нужна только ловушка `get`: если `key in target` — верни `Reflect.get(...)`, иначе `fallback`. Проверяй наличие ключа, а не значение: `undefined` может быть честным значением.",
    },
  ],
};
