import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl3",
  region: 7,
  title: "override и порядок инициализации",
  q: "Зачем модификатор `override` и флаг `noImplicitOverride`? В каком порядке инициализируются поля при наследовании?",
  answer: "`override` (TypeScript 4.3) явно помечает метод, который переопределяет метод родителя. Если родитель переименовал метод или в имени опечатка, `override` даст ошибку «такого метода в базовом классе нет». Флаг `noImplicitOverride` требует ставить `override` всегда при переопределении, чтобы случайное совпадение имён не прошло незамеченным. Порядок инициализации: сначала конструктор родителя с его полями, потом поля наследника, потом тело конструктора наследника — поэтому родитель, вызвавший переопределённый метод из конструктора, увидит неинициализированные поля наследника.",
  theory: {
    p: [
      "Без `override` метод наследника просто совпадает по имени с методом родителя. Если потом в родителе метод переименуют, метод наследника тихо станет новым, а переопределение пропадёт. С `override` TypeScript проверит, что в родителе такой метод есть.",
      "`noImplicitOverride` делает `override` обязательным: переопределение без него — ошибка. Так видно каждое место, где поведение родителя меняется, и случайное совпадение имени ловится сразу.",
      "Порядок создания объекта наследника: вызывается `super()` — конструктор родителя с инициализацией его полей; затем инициализируются поля наследника; затем выполняется остальное тело конструктора наследника. До `super()` обращаться к `this` нельзя.",
      "Отсюда ловушка: если конструктор родителя вызывает метод, переопределённый в наследнике, этот метод сработает, когда поля наследника ещё не проинициализированы. Поэтому из конструктора не вызывают переопределяемые методы. Поведение полей зависит и от `useDefineForClassFields`, который включён для современного `target`.",
    ],
    example: `// @flags: noImplicitOverride
class Base {
  greet() { return "привет"; }
}

class Child extends Base {
  greet() { return "здравствуй"; }         // ошибка: нужен override
}

class Child2 extends Base {
  override greett() { return "опечатка"; } // ошибка: в Base нет greett
}

class Child3 extends Base {
  override greet() { return "ок"; }
}`,
    keys: ["`override` проверяет, что переопределяемый метод есть у родителя, — ловит опечатки и переименования.", "`noImplicitOverride` делает `override` обязательным при переопределении.", "Порядок: конструктор и поля родителя → поля наследника → тело конструктора наследника."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что сделает TypeScript с `override save()`, если в родительском классе метода `save` нет?",
      opts: ["Выдаст ошибку: переопределять нечего", "Создаст метод как обычно", "Добавит `save` в родителя", "Ничего: `override` только комментарий"],
      a: 0,
      why: "В этом и смысл `override`: он подтверждает, что метод действительно переопределяет родительский.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `class Base {
  greet(): string | null { return null; }
}
class Child extends Base {
  override greet(): string { return "привет"; }
}
const r = new Child().greet();`,
      opts: ["string", "string | null", "null", "never"],
      a: 0,
      why: "Наследник может сузить тип результата: `string` подходит под `string | null`. Вызов на `Child` даёт его тип.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "С флагом `noImplicitOverride` класс не компилируется. Помечай переопределение явно.",
      code: `// @flags: noImplicitOverride
class Logger {
  log(msg: string) { return msg; }
}

class PrefixLogger extends Logger {
  log(msg: string) { return "[app] " + msg; }
}`,
      runtime: [["new PrefixLogger().log('старт')", "\"[app] старт\""]],
      forbid: ["any", "ignore"],
      must: ["override log"],
      hint: "Добавь `override` перед `log` в наследнике.",
      solution: `// @flags: noImplicitOverride
class Logger {
  log(msg: string) { return msg; }
}

class PrefixLogger extends Logger {
  override log(msg: string) { return "[app] " + msg; }
}`,
    },
  ],
};
