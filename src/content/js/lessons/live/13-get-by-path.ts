import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "lc13",
  region: 9,
  level: "middle",
  title: "get по пути: `a.b[0].c`",
  q: "Напиши `get(obj, path, defaultValue)`, как в lodash: достать вложенное значение по строке `\"a.b[0].c\"`.",
  answer:
    "Разбираем путь на ключи: заменяем `[0]` на `.0` и делим по точке, пропуская пустые части. Затем идём по ключам от объекта вглубь; если на каком-то шаге значение `null` или `undefined`, возвращаем значение по умолчанию. В конце тоже: если результат `undefined`, отдаём значение по умолчанию. Для «безопасного» чтения в самом коде давно есть `?.`, а `get` нужен, когда путь приходит строкой — из конфигурации, формы или шаблона.",
  theory: {
    p: [
      "Путь `\"user.addresses[0].city\"` — строка, её нужно превратить в список ключей `[\"user\", \"addresses\", \"0\", \"city\"]`. Проще всего регуляркой заменить `[` на точку и убрать `]`, затем `split(\".\")` и `filter(Boolean)` для пустых частей. Путь можно принимать и массивом ключей — так в lodash.",
      "Обход — цикл по ключам с проверкой: если текущее значение `null` или `undefined`, дальше идти нельзя — возвращаем значение по умолчанию. `reduce` тоже подходит, но цикл с ранним выходом понятнее.",
      "Тонкость значения по умолчанию: его отдают, только если результат `undefined`. Значения `0`, `\"\"`, `false` и `null` — настоящие, их возвращают как есть. Парная задача — `set(obj, path, value)`: создавать недостающие объекты или массивы по пути. Её часто дают продолжением.",
    ],
    code: `function parsePath(path) {
  return path.replace(/\\[(\\w+)\\]/g, ".$1").split(".").filter(Boolean);
}
console.log(parsePath("user.addresses[0].city"));
console.log(parsePath("[1].x"));

const data = { user: { addresses: [{ city: "Казань" }] } };
console.log(data.user?.addresses?.[0]?.city);  // в коде хватает ?.
console.log(data.user?.phones?.[0] ?? "нет");`,
    keys: [
      "Путь превращают в массив ключей: `[0]` → `.0`, `split(\".\")`, отбросить пустые.",
      "Идём по ключам и останавливаемся на `null` или `undefined` — возвращаем значение по умолчанию.",
      "Значение по умолчанию — только для `undefined` в итоге: `0`, `\"\"` и `false` возвращают как есть.",
    ],
  },
  tasks: [
    {
      type: "run",
      goal: "Напиши `get(obj, path, defaultValue)`: `path` — строка вида `\"a.b[0].c\"`. Если по пути ничего нет или встретился `null`/`undefined` — верни `defaultValue`.",
      code: `function get(obj, path, defaultValue) {
  return obj[path] ?? defaultValue;
}`,
      tests: [
        ["get({ a: { b: [{ c: 5 }] } }, \"a.b[0].c\")", "5"],
        ["get({ a: null }, \"a.b.c\", \"нет\")", "\"нет\""],
        ["get({ a: { count: 0 } }, \"a.count\", 10)", "0"],
        ["get({ list: [[1, 2], [3, 4]] }, \"list[1][0]\")", "3"],
        ["get({}, \"x.y\")", "undefined"],
      ],
      solution: `function get(obj, path, defaultValue) {
  const keys = path.replace(/\\[(\\w+)\\]/g, ".$1").split(".").filter(Boolean);
  let current = obj;
  for (const key of keys) {
    if (current == null) return defaultValue;
    current = current[key];
  }
  return current === undefined ? defaultValue : current;
}`,
      hint: "Сначала `parsePath` из теории. Потом цикл по ключам: если `current == null` — верни `defaultValue`, иначе шагни `current = current[key]`. В конце проверь на `undefined`.",
    },
    {
      type: "quiz",
      q: "Что должна вернуть `get({ a: { count: 0 } }, \"a.count\", 10)`?",
      opts: ["`0`: значение есть, по умолчанию подставляют только для `undefined`", "`10`: ноль ложный", "`undefined`", "`null`"],
      a: 0,
      why: "Если проверять результат через `||`, настоящий ноль заменится на `10`. Это та же ловушка, что `||` против `??`.",
    },
  ],
};
