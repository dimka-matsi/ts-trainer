import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "obj5",
  region: 3,
  title: "Дескрипторы, геттеры и заморозка",
  q: "Что такое дескриптор свойства? Чем `Object.freeze` отличается от `Object.seal`?",
  answer:
    "У каждого свойства есть дескриптор — флаги `writable` (можно менять значение), `enumerable` (видно при переборе) и `configurable` (можно удалить и менять флаги). Обычные свойства получают все флаги `true`, а через `Object.defineProperty` по умолчанию все `false`. `Object.freeze` запрещает добавлять, удалять и менять свойства, `Object.seal` — только добавлять и удалять, значения менять можно. Оба действуют на один уровень: вложенные объекты остаются изменяемыми.",
  theory: {
    p: [
      "Свойство — это не только значение. У него есть флаги: `writable` — можно ли записать новое значение, `enumerable` — попадает ли свойство в `Object.keys`, `for...in` и `JSON.stringify`, `configurable` — можно ли удалить свойство и менять его флаги. Посмотреть — `Object.getOwnPropertyDescriptor(obj, \"key\")`.",
      "Свойство, созданное обычным присваиванием, получает все флаги `true`. `Object.defineProperty(obj, \"key\", { value: 1 })` создаёт свойство, у которого все флаги `false`, если их не указать. Так встроенные объекты прячут служебные свойства: методы из `Array.prototype` неперечисляемые, поэтому не видны в `for...in`.",
      "Вместо `value` можно задать `get` и `set` — это свойство-аксессор. Чтение вызывает геттер, запись — сеттер. Так делают вычисляемые свойства и проверку при записи. В объектном литерале и в классе то же пишут короче: `get fullName() {}`.",
      "Три уровня защиты объекта. `Object.preventExtensions` запрещает добавлять свойства. `Object.seal` вдобавок запрещает удалять. `Object.freeze` запрещает ещё и менять значения. В строгом режиме нарушение бросает `TypeError`, в нестрогом — молча игнорируется. Защита поверхностная: вложенный объект замороженного объекта можно менять, для полной защиты нужна рекурсивная заморозка.",
    ],
    code: `const obj = { a: 1 };
Object.defineProperty(obj, "hidden", { value: 2 }); // все флаги false
console.log(Object.keys(obj), obj.hidden);          // hidden не виден в keys
console.log(JSON.stringify(obj));

const user = {
  first: "Анна",
  last: "Иванова",
  get full() { return this.first + " " + this.last; }, // аксессор
};
console.log(user.full);

const config = Object.freeze({ mode: "dark", nested: { size: 1 } });
try {
  config.mode = "light";          // строгий режим: ошибка
} catch (e) {
  console.log(e.name);
}
config.nested.size = 2;           // заморозка поверхностная
console.log(config.mode, config.nested.size);`,
    keys: [
      "Флаги свойства: `writable`, `enumerable`, `configurable`. У `defineProperty` по умолчанию все `false`.",
      "`get` и `set` делают свойство-аксессор: чтение и запись вызывают функции.",
      "`preventExtensions` < `seal` < `freeze`. Нарушение в строгом режиме — `TypeError`. Защита поверхностная.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const user = { name: "Аня", address: { city: "Казань" } };
Object.freeze(user);
try {
  user.name = "Борис";
} catch (e) {
  console.log(e.name);
}
user.address.city = "Сочи";
console.log(user.name, user.address.city);`,
      opts: ["TypeError\nАня Сочи", "Борис Сочи", "TypeError\nАня Казань", "Аня Казань"],
      a: 0,
      why: "В строгом режиме запись в замороженный объект бросает `TypeError`. Но `freeze` поверхностный: объект `address` не заморожен, и его можно менять.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const obj = { a: 1 };
Object.defineProperty(obj, "hidden", { value: 2 });
console.log(Object.keys(obj).join(","));
console.log(JSON.stringify(obj));
const d = Object.getOwnPropertyDescriptor(obj, "hidden");
console.log(d.writable, d.enumerable, d.configurable);`,
      opts: ["a\n{\"a\":1}\nfalse false false", "a,hidden\n{\"a\":1,\"hidden\":2}\ntrue true true", "a\n{\"a\":1,\"hidden\":2}\nfalse false false", "a,hidden\n{\"a\":1}\nfalse true false"],
      a: 0,
      why: "`defineProperty` без флагов создаёт свойство, у которого все флаги `false`. Неперечисляемое свойство не видно ни в `Object.keys`, ни в `JSON.stringify`.",
    },
    {
      type: "match",
      q: "Сопоставь метод и что он запрещает.",
      pairs: [
        ["`Object.preventExtensions`", "только добавлять свойства"],
        ["`Object.seal`", "добавлять и удалять"],
        ["`Object.freeze`", "добавлять, удалять и менять значения"],
      ],
      why: "Каждый следующий строже предыдущего. Все три действуют только на сам объект, а не на вложенные.",
    },
    {
      type: "run",
      goal: "Напиши `deepFreeze(obj)`: замораживает объект и все вложенные объекты и массивы, возвращает тот же объект.",
      code: `function deepFreeze(obj) {
  return Object.freeze(obj);
}`,
      tests: [
        ["(() => { const o = deepFreeze({ a: { b: 1 } }); return [Object.isFrozen(o), Object.isFrozen(o.a)]; })()", "[true,true]"],
        ["(() => { const o = deepFreeze({ list: [1, { x: 1 }] }); return [Object.isFrozen(o.list), Object.isFrozen(o.list[1])]; })()", "[true,true]"],
        ["(() => { const o = {}; return deepFreeze(o) === o; })()", "true"],
      ],
      solution: `function deepFreeze(obj) {
  for (const value of Object.values(obj)) {
    if (typeof value === "object" && value !== null) deepFreeze(value);
  }
  return Object.freeze(obj);
}`,
      hint: "Пройди по `Object.values(obj)` и для каждого значения-объекта (не `null`) вызови `deepFreeze` рекурсивно. В конце заморозь сам объект.",
    },
  ],
};
