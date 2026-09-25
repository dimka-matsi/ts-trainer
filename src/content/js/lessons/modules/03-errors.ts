import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "mod3",
  region: 8,
  title: "Обработка ошибок",
  q: "Как работают `try`, `catch` и `finally`? Поймает ли `try/catch` ошибку из `setTimeout` или промиса?",
  answer:
    "`try` выполняет код, `catch` ловит брошенное исключение, `finally` выполняется всегда — даже после `return`, и его собственный `return` перекрывает остальные. Бросать лучше объекты `Error` или своих наследников: у них есть `name`, `message` и стек вызовов, а с ES2022 — `cause` для исходной ошибки. `try/catch` ловит только синхронные ошибки своего кода: исключение из колбэка `setTimeout` или отклонённый промис без `await` пролетят мимо. Для них нужны `await` внутри `try`, `.catch` у промиса и глобальные обработчики `error` и `unhandledrejection`.",
  theory: {
    p: [
      "`try { ... } catch (e) { ... } finally { ... }`. Если в `try` брошено исключение, выполнение прыгает в `catch`. `finally` выполняется в любом случае: и после успешного `try`, и после `catch`, и даже если в них был `return`. Если в `finally` есть свой `return`, он перекрывает результат — так делать не стоит. С ES2019 можно писать `catch { }` без переменной.",
      "Встроенные ошибки: `TypeError` (не то значение, например вызов не-функции), `ReferenceError` (нет такой переменной), `SyntaxError` (например, в `JSON.parse`), `RangeError` (число вне допустимого, например бесконечная рекурсия). Свои ошибки делают наследниками `Error` и задают `name`. Опция `cause` сохраняет исходную ошибку: `new Error(\"не загрузили профиль\", { cause: e })`.",
      "`try/catch` ловит только то, что брошено, пока выполняется код внутри `try`. Колбэк `setTimeout` выполнится позже, в другой задаче, — `try` к тому времени закончен. Отклонённый промис тоже не бросает исключение сам по себе: его ловят `.catch` или `await` внутри `try`. Необработанные ошибки видны глобально: событие `error` у `window` и `unhandledrejection` для промисов.",
      "В консоли этого курса необработанная ошибка показывается строкой `Uncaught` и именем ошибки — браузер ещё добавил бы сообщение и стек. Хорошая практика: ловить ошибки там, где можно что-то сделать — показать сообщение, повторить запрос, — и не глотать их молча пустым `catch`.",
    ],
    code: `function readConfig(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error("неверный конфиг", { cause: e }); // исходная ошибка сохранена
  } finally {
    console.log("finally: выполняется всегда");
  }
}

try {
  readConfig("{плохо");
} catch (e) {
  console.log(e.message, "←", e.cause.name);
}

class NotFoundError extends Error {
  name = "NotFoundError";
}
try {
  throw new NotFoundError("нет пользователя");
} catch (e) {
  console.log(e.name, e instanceof NotFoundError, e instanceof Error);
}

try {
  setTimeout(() => {
    throw new Error("из таймера");        // ошибка: try уже закончился, её никто не поймает
  }, 0);
} catch {
  console.log("сюда не попадём");
}`,
    keys: [
      "`finally` выполняется всегда, даже после `return`. Свой `return` в `finally` перекрывает результат.",
      "Бросай `Error` и наследников с `name`. `cause` сохраняет исходную ошибку.",
      "`try/catch` ловит только синхронный код. Ошибки таймеров и промисов — через `await` в `try`, `.catch` и глобальные `error` и `unhandledrejection`.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `function test() {
  try {
    return "try";
  } finally {
    console.log("finally");
  }
}
console.log(test());
function override() {
  try {
    throw new Error("x");
  } catch {
    return "catch";
  } finally {
    return "finally";
  }
}
console.log(override());`,
      opts: ["finally\ntry\nfinally", "try\nfinally\nfinally", "finally\ntry\ncatch", "try\ncatch"],
      a: 0,
      why: "`finally` выполняется перед тем, как функция вернёт значение, поэтому `finally` печатается раньше `try`. `return` в `finally` перекрывает `return` из `catch`.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `try {
  setTimeout(() => {
    throw new Error("из таймера");
  }, 0);
} catch (e) {
  console.log("поймали");
}
console.log("после try");`,
      opts: ["после try\nUncaught Error", "поймали\nпосле try", "после try\nпоймали", "Uncaught Error\nпосле try"],
      a: 0,
      why: "`try` закончился сразу после вызова `setTimeout`. Колбэк выполнился позже, в своей задаче, и его ошибку никто не поймал.",
    },
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `class ValidationError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ValidationError";
  }
}
try {
  try {
    JSON.parse("{плохо");
  } catch (e) {
    throw new ValidationError("неверный JSON", { cause: e });
  }
} catch (e) {
  console.log(e.name, e instanceof Error);
  console.log(e.cause.name);
}`,
      opts: ["ValidationError true\nSyntaxError", "Error true\nSyntaxError", "ValidationError false\nundefined", "SyntaxError true\nValidationError"],
      a: 0,
      why: "Свой класс унаследован от `Error` и задаёт `name`. `JSON.parse` бросает `SyntaxError`, и он сохранён в `cause`.",
    },
    {
      type: "run",
      goal: "Напиши `safeParse(text, fallback)`: возвращает разобранный JSON, а если текст не JSON — `fallback`.",
      code: `function safeParse(text, fallback) {
  return JSON.parse(text);
}`,
      tests: [
        ["safeParse('{\"a\":1}', null)", "{\"a\":1}"],
        ["safeParse(\"{плохо\", { ok: false })", "{\"ok\":false}"],
        ["safeParse(\"\", [])", "[]"],
      ],
      solution: `function safeParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}`,
      hint: "Оберни `JSON.parse` в `try`, а в `catch` верни `fallback`. Пустая строка — тоже не JSON.",
    },
  ],
};
