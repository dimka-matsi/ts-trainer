import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "cl7",
  region: 7,
  title: "Тип this и this-guards",
  q: "Что значит возвращаемый тип `this` и как работает `this is T` в методе?",
  answer: "Тип `this` в классе означает «тип текущего объекта», а не класса, где метод объявлен. Метод, который возвращает `this`, у наследника возвращает наследника — так строят цепочки вызовов (fluent API): `new HtmlBuilder().add(\"a\").bold()` работает, хотя `add` объявлен в родителе. `this is T` в возвращаемом типе метода — type guard для самого объекта: после `if (node.isDir())` TypeScript знает, что `node` — `DirNode`.",
  theory: {
    p: [
      "Метод `add(p) { …; return this; }` без аннотации возвращает тип `this` — полиморфный тип текущего объекта. Если `HtmlBuilder extends Builder`, то `new HtmlBuilder().add(\"x\")` — это `HtmlBuilder`, и после него доступны методы наследника. С аннотацией `: Builder` цепочка бы оборвалась.",
      "`this` можно использовать и в параметрах и полях: `sameAs(other: this)` принимает объект того же класса, что и текущий. У наследника это будет наследник.",
      "This-guard: метод с результатом `this is DirNode`. Вызов в условии `if (node.isDir())` сужает сам объект, как type guard сужает аргумент. Так работают иерархии узлов — файлы и папки, элементы дерева — без проверок снаружи.",
      "Отличие от параметра `this:` в функциях (урок региона «Функции»): там описывают, с каким `this` функцию можно вызвать. А тип `this` в классе — это «тип того, у кого вызвали».",
    ],
    example: `class Builder {
  protected parts: string[] = [];
  add(p: string) {
    this.parts.push(p);
    return this;                        // тип: this
  }
}
class HtmlBuilder extends Builder {
  bold() { return this.add("<b>"); }
}
const b = new HtmlBuilder().add("a").bold();   // цепочка не обрывается

class FileNode {
  isDir(): this is DirNode { return this instanceof DirNode; }
}
class DirNode extends FileNode { children: FileNode[] = []; }
declare const node: FileNode;
if (node.isDir()) node.children;
node.children;                          // ошибка: без проверки это не папка`,
    keys: ["Тип `this` — тип текущего объекта: у наследника это наследник.", "Методы, которые возвращают `this`, дают цепочки вызовов с методами наследника.", "`this is T` в результате метода сужает сам объект после вызова в условии."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `b`?",
      probe: "b",
      code: `class Builder {
  private parts: string[] = [];
  add(p: string) { this.parts.push(p); return this; }
}
class HtmlBuilder extends Builder {
  bold() { return this; }
}
const b = new HtmlBuilder().add("a");`,
      opts: ["HtmlBuilder", "Builder", "this", "void"],
      a: 0,
      why: "`add` возвращает `this`, а вызван он у `HtmlBuilder`, поэтому и результат — `HtmlBuilder`.",
    },
    {
      type: "quiz",
      q: "Зачем методу возвращать тип `this`, а не имя своего класса?",
      opts: ["Чтобы у наследников цепочка вызовов продолжалась с их собственными методами", "Так быстрее", "Имя класса нельзя писать в типе результата", "Чтобы метод стал статическим"],
      a: 0,
      why: "С явным `: Builder` результат у наследника «откатится» к родителю, и методы наследника станут недоступны.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Цепочка `new QueryBuilder().where(\"a\").limit(10)` не компилируется: `where` возвращает базовый класс. Исправь тип результата.",
      code: `class Query {
  protected parts: string[] = [];
  where(cond: string): Query {
    this.parts.push("WHERE " + cond);
    return this;
  }
}

class QueryBuilder extends Query {
  limit(n: number) {
    this.parts.push("LIMIT " + n);
    return this;
  }
}

const q = new QueryBuilder().where("a").limit(10);`,
      forbid: ["any", "as", "ignore"],
      must: ["new QueryBuilder().where(\"a\").limit(10)"],
      hint: "Верни тип `this` вместо `Query` — или просто убери аннотацию.",
      solution: `class Query {
  protected parts: string[] = [];
  where(cond: string): this {
    this.parts.push("WHERE " + cond);
    return this;
  }
}

class QueryBuilder extends Query {
  limit(n: number) {
    this.parts.push("LIMIT " + n);
    return this;
  }
}

const q = new QueryBuilder().where("a").limit(10);`,
    },
  ],
};
