import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl14",
  region: 7,
  title: "Декораторы",
  q: "Что такое декораторы и чем стандартные отличаются от `experimentalDecorators`?",
  answer: "Декоратор — функция, которая оборачивает класс, метод, поле или аксессор и меняет его поведение: `@logged`, `@memoize`, `@Injectable()`. С TypeScript 5.0 поддерживаются стандартные декораторы по предложению TC39: функция получает сам декорируемый элемент и объект контекста (`ClassMethodDecoratorContext` с именем, видом, `addInitializer`) и может вернуть замену. Старые `experimentalDecorators` — другая, несовместимая версия с сигнатурой `(target, key, descriptor)` и `emitDecoratorMetadata`, на них построены Angular и NestJS. Стандартные не умеют декорировать параметры — это есть только в старых.",
  theory: {
    p: [
      "Декоратор пишут через `@` перед объявлением: `@logged add(a, b) { … }`. Это функция, которую вызывают при определении класса. Она может обернуть метод — добавить логирование, кэш, проверку прав — или зарегистрировать класс где-то ещё.",
      "Стандартные декораторы (TypeScript 5.0, предложение TC39): декоратор метода получает `(method, context)`, где `context` — объект с `name`, `kind`, `static`, `private` и `addInitializer`. Если декоратор вернёт функцию, она заменит метод. Типизировать их можно точно: `ClassMethodDecoratorContext<This, Fn>`.",
      "`experimentalDecorators` — старая версия по раннему черновику: сигнатура `(target, propertyKey, descriptor)`, декораторы параметров, а с `emitDecoratorMetadata` — метаданные типов, на которых работает внедрение зависимостей в Angular и NestJS. Эти две системы несовместимы: библиотека пишется под одну из них, и флаг включают под неё.",
      "Когда что. Новый код без фреймворка — стандартные декораторы, они уже в стандарте языка. Проект на Angular или NestJS — `experimentalDecorators`, как требует фреймворк. На собеседовании достаточно объяснить, что делает декоратор, и назвать разницу двух систем.",
    ],
    example: `function logged<This, Args extends unknown[], R>(
  method: (this: This, ...args: Args) => R,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => R>,
) {
  return function (this: This, ...args: Args): R {
    console.log("вызов " + String(context.name));
    return method.call(this, ...args);
  };
}

class Calc {
  @logged
  add(a: number, b: number) { return a + b; }
}

const sum: number = new Calc().add(1, 2);
const wrong: string = new Calc().add(1, 2);   // ошибка: декоратор сохранил тип`,
    keys: ["Декоратор — функция, которая оборачивает класс, метод, поле или аксессор при определении класса.", "Стандартные (TS 5.0): `(value, context)` с объектом контекста, могут вернуть замену.", "`experimentalDecorators` — старая несовместимая система с `(target, key, descriptor)`, на ней Angular и NestJS."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Что получает стандартный декоратор метода в TypeScript 5.0+?",
      opts: ["Сам метод и объект контекста с именем, видом и `addInitializer`", "`target`, имя свойства и дескриптор", "Только имя метода", "Экземпляр класса"],
      a: 0,
      why: "Сигнатура `(target, key, descriptor)` — это старые `experimentalDecorators`.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `r`?",
      probe: "r",
      code: `function logged<This, Args extends unknown[], R>(
  method: (this: This, ...args: Args) => R,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => R>,
) {
  return function (this: This, ...args: Args): R {
    return method.call(this, ...args);
  };
}
class Calc {
  @logged
  add(a: number, b: number) { return a + b; }
}
const r = new Calc().add(1, 2);`,
      opts: ["number", "unknown", "void", "any"],
      a: 0,
      why: "Декоратор возвращает функцию с тем же типом результата `R`, поэтому тип метода не меняется.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши стандартный декоратор `double`, который удваивает результат метода, возвращающего число.",
      code: `function double<This, Args extends unknown[]>(
  method: (this: This, ...args: Args) => number,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => number>,
) {
  return method;
}

class Price {
  @double
  base(n: number) { return n; }
}`,
      runtime: [["new Price().base(5)", "10"]],
      forbid: ["any", "ignore"],
      hint: "Верни новую функцию: `return function (this: This, ...args: Args) { return method.call(this, ...args) * 2; };`.",
      solution: `function double<This, Args extends unknown[]>(
  method: (this: This, ...args: Args) => number,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => number>,
) {
  return function (this: This, ...args: Args) {
    return method.call(this, ...args) * 2;
  };
}

class Price {
  @double
  base(n: number) { return n; }
}`,
    },
  ],
};
