import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "asy8",
  region: 5,
  title: "Колбэки, callback hell и промисификация",
  q: "Что такое callback hell? Как превратить функцию с колбэком в функцию с промисом?",
  answer:
    "До промисов асинхронный результат передавали колбэком. В Node.js договорились о стиле «ошибка первой»: `callback(err, result)`. Несколько зависимых шагов превращались во вложенную «пирамиду» с обработкой ошибки на каждом уровне — это callback hell. Промисификация оборачивает такую функцию: возвращает `new Promise`, передаёт свой колбэк, который вызывает `reject(err)` или `resolve(result)`. В Node.js для этого есть `util.promisify`, а многие API уже имеют промисные версии, например `fs/promises`.",
  theory: {
    p: [
      "Колбэк — функция, которую передают, чтобы её вызвали, когда результат готов. В Node.js сложилось соглашение «ошибка первой» (error-first): `readFile(path, (err, data) => { ... })` — если `err` не `null`, случилась ошибка, иначе в `data` результат.",
      "Проблемы колбэков. Последовательные шаги вкладываются друг в друга, отступ растёт — «пирамида судьбы». Ошибку нужно проверять на каждом уровне, `try/catch` снаружи её не поймает. Колбэк может быть вызван дважды или не вызван вовсе — промис от этого защищает, он выполняется ровно один раз.",
      "Промисификация — обёртка, которая превращает функцию с колбэком в функцию с промисом. Внутри: `return new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)))`. После этого работают `await`, `try/catch` и комбинаторы. В Node.js это `util.promisify`, а для файлов, таймеров и DNS есть готовые модули `fs/promises`, `timers/promises`.",
      "Обратная задача тоже встречается: вызвать колбэк по результату промиса — `promise.then((r) => cb(null, r), (e) => cb(e))`. А в браузере колбэки никуда не делись: обработчики событий и `setTimeout` — тоже колбэки.",
    ],
    code: `function loadUser(id, callback) {          // старый стиль: ошибка первой
  setTimeout(() => {
    if (id <= 0) callback(new Error("нет пользователя"));
    else callback(null, { id, name: "Аня" });
  }, 10);
}

loadUser(1, (err, user) => {               // пирамида начинается здесь
  if (err) return console.log("ошибка", err.message);
  console.log("колбэк:", user.name);
});

function loadUserAsync(id) {                // промисификация вручную
  return new Promise((resolve, reject) => {
    loadUser(id, (err, user) => (err ? reject(err) : resolve(user)));
  });
}

(async () => {
  try {
    const user = await loadUserAsync(1);
    console.log("await:", user.name);
    await loadUserAsync(0);
  } catch (e) {
    console.log("try/catch поймал:", e.message);
  }
})();`,
    keys: [
      "Соглашение Node.js: колбэк `(err, result)`, ошибка первой.",
      "Callback hell: вложенность, ошибка на каждом уровне, риск двойного вызова. Промис выполняется один раз.",
      "Промисификация: `new Promise` и колбэк, который вызывает `reject` или `resolve`. В Node.js — `util.promisify`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function risky(callback) {
  setTimeout(() => callback(new Error("сбой")), 0);
}
try {
  risky((err) => {
    if (err) console.log("колбэк получил:", err.message);
  });
} catch (e) {
  console.log("try поймал");
}
console.log("дальше");`,
      opts: ["дальше\nколбэк получил: сбой", "try поймал\nдальше", "колбэк получил: сбой\nдальше", "дальше\ntry поймал"],
      a: 0,
      why: "Ошибка не брошена, а передана колбэку, и случилось это позже, в таймере. `try` снаружи к этому моменту закончился и ничего не ловит.",
    },
    {
      type: "quiz",
      q: "Какую проблему колбэков решает промис сам по себе?",
      opts: [
        "Результат приходит ровно один раз: повторные `resolve` и `reject` игнорируются",
        "Код становится синхронным",
        "Промис выполняется в отдельном потоке",
        "Ошибки перестают возникать",
      ],
      a: 0,
      why: "Чужая функция может вызвать колбэк дважды или с ошибкой и результатом сразу. Промис фиксирует первый исход, а цепочки и `await` убирают вложенность.",
    },
    {
      type: "run",
      goal: "Напиши `promisify(fn)`: `fn` принимает аргументы и последним — колбэк `(err, result)`. Верни функцию, которая принимает те же аргументы без колбэка и возвращает промис.",
      code: `function promisify(fn) {
  return (...args) => fn(...args);
}`,
      tests: [
        ["promisify((a, b, cb) => setTimeout(() => cb(null, a + b), 5))(2, 3)", "5"],
        ["promisify((cb) => cb(new Error(\"нет\")))().catch((e) => e.message)", "\"нет\""],
        ["(() => { const obj = { k: 10, get(cb) { cb(null, this.k); } }; return promisify(obj.get).call(obj); })()", "10"],
      ],
      solution: `function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
  };
}`,
      hint: "Верни обычную функцию (чтобы сохранить `this`), внутри — `new Promise`. Вызови `fn.call(this, ...args, колбэк)`, где колбэк вызывает `reject(err)` или `resolve(result)`.",
    },
  ],
};
