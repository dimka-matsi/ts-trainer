import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl4",
  region: 7,
  title: "private, protected и #field",
  q: "В чём разница между `private`, `protected` и `#field`?",
  answer: "`public` (по умолчанию) — доступно всем, `protected` — самому классу и наследникам, `private` — только самому классу. Но `private` и `protected` — проверки TypeScript: после компиляции поле обычное, и через `obj[\"secret\"]` или из JavaScript его можно прочитать. `#field` — настоящее приватное поле JavaScript: оно недоступно снаружи даже во время работы программы и не видно в `JSON.stringify`. Выбирают по задаче: для защиты от случайного использования хватает `private`, для настоящей инкапсуляции — `#`.",
  theory: {
    p: [
      "Модификаторы доступа TypeScript: `public` — всем (его обычно не пишут), `protected` — классу и наследникам, `private` — только внутри класса. Нарушение — ошибка компиляции. `readonly` сочетается с любым из них.",
      "Важно: это только проверка типов. После компиляции `private` исчезает, поле становится обычным свойством. Доступ через скобки `obj[\"secret\"]` TypeScript разрешает специально — как лазейку для тестов, — а JavaScript-код видит поле всегда.",
      "`#secret` — приватное поле самого JavaScript (ES2022). Оно недоступно снаружи класса даже во время работы: обратиться к нему можно только внутри тела класса. Его нет в `Object.keys` и `JSON.stringify`, а проверить наличие можно через `#secret in obj`.",
      "Что выбрать. `private` — привычно, работает с parameter properties, достаточно для защиты от случайного использования внутри команды. `#` — когда нужна настоящая инкапсуляция: библиотека, данные, которые не должны утечь в сериализацию. На собеседовании ждут главного: `private` стирается, `#` — нет.",
    ],
    example: `class Account {
  #pin = "1234";                    // приватно и во время работы
  private balance = 100;            // приватно только для TypeScript
  protected owner = "Аня";

  check(pin: string) { return pin === this.#pin; }
}

class Savings extends Account {
  who() { return this.owner; }      // protected доступен наследнику
}

const acc = new Account();
acc.balance;                        // ошибка: private
acc["balance"];                     // можно: лазейка для тестов
acc.#pin;                           // ошибка: недоступно вне класса`,
    keys: ["`public` — всем, `protected` — классу и наследникам, `private` — только классу.", "`private` и `protected` стираются при компиляции, доступ через `obj[\"x\"]` TypeScript разрешает.", "`#field` — настоящее приватное поле JavaScript, недоступное снаружи и во время работы."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что будет с `private balance` после компиляции в JavaScript?",
      opts: ["Станет обычным свойством: `private` — только проверка TypeScript", "Станет `#balance`", "Удалится из объекта", "Будет зашифровано"],
      a: 0,
      why: "Модификаторы доступа TypeScript не существуют во время работы. Настоящая приватность — только у `#`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `o`?",
      probe: "o",
      code: `class Account {
  protected owner = "Аня";
}
class Savings extends Account {
  who() { return this.owner; }
}
const o = new Savings().who();`,
      opts: ["string", "\"Аня\"", "never", "unknown"],
      a: 0,
      why: "`protected` доступен наследнику. Поле без аннотации с изменяемым значением расширено до `string`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Токен не должен быть доступен снаружи даже во время работы программы и не должен попадать в `JSON.stringify`. Сделай его настоящим приватным полем.",
      code: `class Client {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
  header() {
    return "Bearer " + this.token;
  }
}`,
      runtime: [["JSON.stringify(new Client('abc'))", "\"{}\""], ["new Client('abc').header()", "\"Bearer abc\""]],
      forbid: ["any", "ignore"],
      must: ["#token"],
      hint: "Объяви `#token: string` и обращайся к нему как `this.#token`.",
      solution: `class Client {
  #token: string;
  constructor(token: string) {
    this.#token = token;
  }
  header() {
    return "Bearer " + this.#token;
  }
}`,
    },
  ],
};
