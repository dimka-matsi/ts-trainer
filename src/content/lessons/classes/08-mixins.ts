import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl8",
  region: 7,
  title: "Миксины",
  q: "Что такое миксин и как его типизировать?",
  answer: "Миксин — функция, которая принимает класс и возвращает новый класс-наследник с добавленными полями и методами: `Timestamped(User)`. Так поведение собирают из кусков, обходя ограничение «один родитель». Типизация: параметр — конструктор `B extends new (...args: any[]) => {}`, а результат — class expression `class extends Base { … }`. TypeScript сам выводит тип: экземпляр получает и поля исходного класса, и добавленные. Требование к конструктору — rest-параметр `...args: any[]`, иначе миксин не подойдёт к классам с другими аргументами.",
  theory: {
    p: [
      "В JavaScript у класса один родитель. Если нужно добавить к разным классам одно и то же поведение — метки времени, события, сериализацию, — используют миксины: функции, которые оборачивают класс и возвращают наследника.",
      "Тип конструктора: `type Constructor<T = {}> = new (...args: any[]) => T`. Миксин: `function Timestamped<B extends Constructor>(Base: B) { return class extends Base { createdAt = Date.now(); }; }`. Внутри — class expression, безымянный класс-выражение.",
      "`any[]` в аргументах конструктора — редкий случай, когда `any` оправдан: TypeScript требует именно такую форму для «конструктора миксина», чтобы подходили классы с любыми параметрами. Результат вызова `Timestamped(User)` — класс, экземпляры которого имеют и поля `User`, и `createdAt`.",
      "Миксины можно ограничить: `B extends Constructor<{ name: string }>` — только классы, у экземпляров которых есть `name`, и внутри миксина можно пользоваться `this.name`. Злоупотреблять не стоит: цепочка из пяти миксинов читается хуже, чем композиция объектов.",
    ],
    example: `type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<B extends Constructor>(Base: B) {
  return class extends Base {
    createdAt = Date.now();
  };
}

function Named<B extends Constructor<{ name: string }>>(Base: B) {
  return class extends Base {
    hello() { return "Привет, " + this.name; }
  };
}

class User { name = "Аня"; }
class Point { x = 0; }

const Smart = Named(Timestamped(User));
const u = new Smart();
u.createdAt;
u.hello();
Named(Point);                       // ошибка: у Point нет name`,
    keys: ["Миксин — функция, которая принимает класс и возвращает наследника с новым поведением.", "Параметр — конструктор `new (...args: any[]) => T`, результат — `class extends Base { … }`.", "Ограничение `Constructor<{ name: string }>` пускает только подходящие классы."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Какую задачу решают миксины?",
      opts: ["Добавляют одинаковое поведение разным классам, хотя родитель у класса один", "Делают поля приватными", "Ускоряют создание объектов", "Заменяют интерфейсы"],
      a: 0,
      why: "Миксины собирают поведение из кусков, обходя одиночное наследование.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `c`?",
      probe: "c",
      code: `type Constructor<T = {}> = new (...args: any[]) => T;
function Timestamped<B extends Constructor>(Base: B) {
  return class extends Base { createdAt = Date.now(); };
}
class User { name = "Аня"; }
const u = new (Timestamped(User))();
const c = u.createdAt;`,
      opts: ["number", "Date", "string", "unknown"],
      a: 0,
      why: "`Date.now()` возвращает число, и поле миксина получает тип `number`.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши миксин `Activatable`: добавляет поле `active = false` и метод `activate()`, который ставит `true`.",
      code: `type Constructor<T = {}> = new (...args: any[]) => T;

function Activatable<B extends Constructor>(Base: B) {
  return Base;
}

class Account { id = 1; }
const A = Activatable(Account);`,
      tests: `const a = new A();
a.activate();
const on: boolean = a.active;
const id: number = a.id;`,
      runtime: [["(() => { const a = new A(); a.activate(); return a.active; })()", "true"]],
      forbid: ["ignore"],
      hint: "`return class extends Base { active = false; activate() { this.active = true; } };`",
      solution: `type Constructor<T = {}> = new (...args: any[]) => T;

function Activatable<B extends Constructor>(Base: B) {
  return class extends Base {
    active = false;
    activate() {
      this.active = true;
    }
  };
}

class Account { id = 1; }
const A = Activatable(Account);`,
    },
  ],
};
