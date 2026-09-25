import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ob5",
  region: 3,
  title: "extends против &",
  q: "Чем `interface extends` отличается от пересечения `&`?",
  answer: "Оба собирают тип из нескольких частей, но по-разному ведут себя при конфликте. `interface B extends A` проверяет, что B совместим с A, и при несовместимом поле сразу даёт ошибку в объявлении. Пересечение `A & B` ничего не проверяет: конфликтующее поле молча становится `never`, и ошибка всплывёт позже. Кроме того, `extends` работает только с объектными типами и даёт более понятные сообщения, а `&` можно применить к любым типам, включая union.",
  theory: {
    p: [
      "`interface Dog extends Animal { breed: string }` — Dog получает все поля Animal плюс свои. `type Dog = Animal & { breed: string }` — тот же результат для совместимых полей. Интерфейс может расширять и `type`, если это объектный тип.",
      "Разница при конфликте. Если в `extends` переопределить поле несовместимым типом — `age: string` вместо `number`, — TypeScript сразу сообщит об ошибке в объявлении интерфейса. Пересечение молча соединит `number & string`, получится `never`, и ошибка проявится только при попытке создать объект.",
      "Ещё отличия. `extends` — только для объектных типов и интерфейсов, а `&` применим к любым типам: `(A | B) & C`. У интерфейсов сообщения об ошибках короче — в них имя типа, а не раскрытое пересечение. Компилятор кэширует проверки интерфейсов, поэтому в больших проектах команда TypeScript советует для объектов `interface extends`.",
      "Практическое правило: наследуешь объектный тип — `interface extends`, так конфликт будет виден сразу. Комбинируешь union, функции или дженерики — пересечение.",
    ],
    example: `interface Animal { name: string; age: number }
interface Dog extends Animal { breed: string }

interface Bad extends Animal { age: string }   // ошибка: поле age несовместимо
type Weird = Animal & { age: string };          // без ошибки в объявлении

declare const w: Weird;
const age = w.age;                              // never`,
    keys: ["`interface extends` проверяет совместимость и сразу сообщает о конфликте поля.", "`&` не проверяет: конфликтующее поле молча становится `never`.", "Для наследования объектов — `extends`, для union и сложных комбинаций — `&`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `age`?",
      probe: "age",
      code: `interface Animal { name: string; age: number }
type Weird = Animal & { age: string };
declare const w: Weird;
const age = w.age;`,
      opts: ["never", "string", "number", "string | number"],
      a: 0,
      why: "Пересечение требует, чтобы поле было одновременно числом и строкой. Таких значений нет — `never`.",
    },
    {
      type: "quiz",
      q: "Где раньше обнаружится конфликт типов поля: в `interface B extends A` или в `type B = A & {…}`?",
      opts: ["В `extends`: ошибка в самом объявлении", "В `&`: ошибка в объявлении", "Одинаково: при создании объекта", "Нигде: конфликт разрешается автоматически"],
      a: 0,
      why: "`extends` проверяет совместимость наследника, а пересечение просто соединяет требования.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши `AdminUser`: всё из `User` плюс обязательное поле `permissions` — массив строк. Используй расширение интерфейса.",
      code: `interface User { id: number; name: string }
interface AdminUser {}`,
      tests: `const a: AdminUser = { id: 1, name: "Аня", permissions: ["read"] };
// @ts-expect-error — без permissions нельзя
const b: AdminUser = { id: 1, name: "Аня" };
// @ts-expect-error — без name нельзя
const c: AdminUser = { id: 1, permissions: [] };`,
      forbid: ["any", "ignore"],
      must: ["extends User"],
      hint: "`interface AdminUser extends User { permissions: string[] }`.",
      solution: `interface User { id: number; name: string }
interface AdminUser extends User { permissions: string[] }`,
    },
  ],
};
