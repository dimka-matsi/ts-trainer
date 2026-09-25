import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "val6",
  region: 0,
  title: "Поверхностное и глубокое копирование",
  q: "Чем поверхностная копия отличается от глубокой? Как глубоко скопировать объект и чем плох `JSON.parse(JSON.stringify(obj))`?",
  answer:
    "Поверхностная копия — `{ ...obj }` или `Object.assign({}, obj)` — создаёт новый объект, но вложенные объекты остаются общими с оригиналом. Глубокая копия копирует всё дерево. Встроенный способ — `structuredClone(obj)`: он понимает даты и циклические ссылки, но не копирует функции. Трюк с `JSON` теряет `undefined` и функции, превращает даты в строки, `NaN` — в `null` и падает на циклических ссылках.",
  theory: {
    p: [
      "Раз объекты передаются по ссылке, для независимой копии нужен новый объект. Spread `{ ...obj }` и `Object.assign({}, obj)` копируют свойства верхнего уровня. Если свойство — объект, копируется ссылка на него. Это поверхностная копия: изменить `copy.name` безопасно, а `copy.address.city` изменит и оригинал.",
      "Для массивов то же самое: `[...arr]` и `arr.slice()` копируют только сам массив, объекты внутри общие. Для неизменяемых обновлений копируют путь до изменяемого места: `{ ...user, address: { ...user.address, city } }` — так пишут редьюсеры в React и Redux.",
      "Глубокая копия копирует все уровни. Встроенный способ — `structuredClone(obj)`: он есть в браузерах и Node.js, копирует даты, массивы, вложенные объекты и циклические ссылки. Функции и элементы DOM он не копирует — бросает ошибку, а у экземпляров классов теряется прототип.",
      "Старый трюк `JSON.parse(JSON.stringify(obj))` работает только для простых данных. Он выбрасывает свойства со значением `undefined` и функции, превращает дату в строку, `NaN` и `Infinity` — в `null`, а на циклической ссылке бросает `TypeError`. На собеседовании часто просят написать свой `deepClone` — эта задача есть в регионе «Live coding».",
    ],
    code: `const user = { name: "Аня", address: { city: "Казань" } };

const shallow = { ...user };
shallow.address.city = "Сочи";
console.log(user.address.city); // Сочи — вложенный объект общий

const deep = structuredClone(user);
deep.address.city = "Омск";
console.log(user.address.city); // Сочи — глубокая копия независима

const viaJson = JSON.parse(JSON.stringify({ when: new Date(0), skip: undefined }));
console.log(typeof viaJson.when, "skip" in viaJson); // string false`,
    keys: [
      "Spread и `Object.assign` копируют один уровень: вложенные объекты остаются общими.",
      "Глубокая копия — `structuredClone`: даты и циклы копирует, функции — нет.",
      "`JSON.parse(JSON.stringify(x))` теряет `undefined` и функции, портит даты и `NaN`, падает на циклах.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const user = { name: "Аня", address: { city: "Казань" } };
const copy = { ...user };
copy.name = "Борис";
copy.address.city = "Сочи";
console.log(user.name);
console.log(user.address.city);`,
      opts: ["Аня\nСочи", "Борис\nСочи", "Аня\nКазань", "Борис\nКазань"],
      a: 0,
      why: "Spread создал новый объект, поэтому `name` у копии своё. Но в `address` скопирована ссылка, и объект адреса у оригинала и копии общий.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const data = { date: new Date(0), count: undefined, ratio: NaN };
const copy = JSON.parse(JSON.stringify(data));
console.log(typeof copy.date);
console.log("count" in copy);
console.log(copy.ratio);`,
      opts: ["string\nfalse\nnull", "object\ntrue\nNaN", "string\ntrue\nundefined", "object\nfalse\nnull"],
      a: 0,
      why: "`JSON.stringify` записывает дату строкой, пропускает свойства со значением `undefined`, а `NaN` записывает как `null`. После `JSON.parse` назад ничего не восстанавливается.",
    },
    {
      type: "quiz",
      q: "Что сделает `structuredClone` с объектом, у которого есть свойство-функция?",
      opts: ["Бросит ошибку: функции не копируются", "Скопирует функцию", "Молча пропустит функцию", "Превратит функцию в строку"],
      a: 0,
      why: "`structuredClone` копирует только данные. На функции, элементе DOM и других некопируемых значениях он бросает `DataCloneError`.",
    },
    {
      type: "run",
      goal: "Напиши `updateCity(user, city)`: возвращает новый объект пользователя с новым городом в `address` и не меняет исходный объект.",
      code: `function updateCity(user, city) {
  const copy = { ...user };
  copy.address.city = city;
  return copy;
}`,
      tests: [
        ["(() => { const u = { name: \"Аня\", address: { city: \"Казань\", zip: \"420000\" } }; const r = updateCity(u, \"Сочи\"); return [u.address.city, r.address.city, r.address.zip, r.name]; })()", "[\"Казань\",\"Сочи\",\"420000\",\"Аня\"]"],
        ["(() => { const u = { name: \"Аня\", address: { city: \"Казань\" } }; const r = updateCity(u, \"Сочи\"); return r !== u && r.address !== u.address; })()", "true"],
      ],
      solution: `function updateCity(user, city) {
  return { ...user, address: { ...user.address, city } };
}`,
      hint: "Скопируй и сам объект, и `address`: `{ ...user, address: { ...user.address, city } }`.",
    },
  ],
};
