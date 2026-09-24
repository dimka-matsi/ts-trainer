import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "f4",
  region: 2,
  title: "this в функциях",
  q: "Как типизировать `this` и зачем нужен параметр `this: T`?",
  answer: "Первым псевдо-параметром `this: T`. Он стирается при компиляции и не занимает место аргумента, но TypeScript проверит, что функцию вызывают с правильным `this`: оторванный от объекта вызов не скомпилируется. У стрелочных функций своего `this` нет, они берут его снаружи, поэтому для колбэков, которые теряют контекст, берут стрелки.",
  theory: {
    p: [
      "В обычной функции `this` зависит от того, как её вызвали. Флаг `noImplicitThis` из `strict` запрещает пользоваться `this`, тип которого неизвестен.",
      "Параметр `this: T` пишут первым. Аргументом он не считается и при компиляции исчезает. Зато TypeScript проверяет вызовы: если вызвать метод без объекта, будет ошибка TS2684. А вот передачу метода как колбэка TypeScript не проверяет, и ошибку можно пропустить.",
      "У стрелочной функции своего `this` нет, она берёт его из места объявления. Поэтому стрелка в поле класса не теряет контекст, когда её передают как колбэк.",
      "В методах класса `this` выводится сам. Возвращаемый тип `this` значит «тип текущего объекта»: в наследнике цепочка вызовов вернёт наследника, а не базовый класс.",
    ],
    example: `type Button = { label: string; onClick(this: Button): void };

function handle(this: Button) {
  console.log(this.label);
}
const btn: Button = { label: "OK", onClick: handle };
btn.onClick();        // ок: this — btn

const detached = btn.onClick;
detached();           // ошибка TS2684: this должен быть Button

class Timer {
  seconds = 0;
  tick = () => { this.seconds++; }; // стрелка держит this
}
declare function later(cb: () => void): void;
later(new Timer().tick);`,
    keys: ["`this: T` — псевдо-параметр, при компиляции стирается.", "Вызов оторванного метода с `this: T` не скомпилируется.", "Стрелка берёт `this` снаружи."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `class Builder {
  parts: string[] = [];
  add(p: string): this {
    this.parts.push(p);
    return this;
  }
}
class HtmlBuilder extends Builder {
  tag() { return this; }
}
const r = new HtmlBuilder().add("a");`,
      opts: ["Builder", "HtmlBuilder", "this", "any"],
      a: 1,
      why: "Возвращаемый тип `this` подставляется по месту вызова. У экземпляра `HtmlBuilder` метод `add` вернёт `HtmlBuilder`, поэтому цепочка не теряет методы наследника.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Метод `inc` можно оторвать от объекта и вызвать, и тогда `this` окажется `undefined`. Сделай так, чтобы TypeScript запрещал вызов оторванного `inc`, а вызов через `counter.inc()` работал.",
      code: `type Counter = { count: number; inc(): void };

const counter: Counter = {
  count: 0,
  inc() { this.count++; },
};`,
      tests: `counter.inc();
const detached = counter.inc;
// @ts-expect-error: у оторванного метода нет this
detached();`,
      runtime: [["(counter.inc(), counter.count)", "1"]],
      forbid: ["any", "as", "ignore"],
      must: ["inc() { this.count++; },"],
      hint: "Добавь в сигнатуру метода в типе псевдо-параметр `this`.",
      solution: `type Counter = { count: number; inc(this: Counter): void };

const counter: Counter = {
  count: 0,
  inc() { this.count++; },
};`,
    },
  ],
};
