import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "ct6",
  region: 8,
  title: "Branded types и умные конструкторы",
  q: "Как получить номинальную типизацию в TypeScript? Как не перепутать `UserId` и `OrderId`, если оба — числа?",
  answer: "TypeScript сравнивает типы по форме, поэтому `type UserId = number` ничем не отличается от `OrderId`. Номинальность добавляют «брендом» — пересечением с фиктивным полем: `number & { readonly [brand]: \"UserId\" }`. Такое значение нельзя получить из обычного числа без явного шага, поэтому бренд создают в умном конструкторе — функции, которая проверяет значение и только потом ставит бренд: `parseEmail(s): Email | null`. Во время работы программы бренда нет, это чистая проверка типов.",
  theory: {
    p: [
      "Структурная типизация: `type UserId = number` и `type OrderId = number` — оба просто `number`. Функция `loadUser(id: UserId)` примет и id заказа, и цену. Ошибку «перепутали идентификаторы» компилятор не заметит.",
      "Бренд — пересечение с полем, которого нет во время работы: `type UserId = number & { readonly [brand]: \"UserId\" }`, где `brand` — `declare const brand: unique symbol`. Обычное число к такому типу не подходит, а разные бренды не подходят друг к другу. Арифметика продолжает работать: `id + 1` — это `number`.",
      "Откуда брать брендированные значения? Из умного конструктора: функция проверяет входные данные и только потом говорит «это `Email`» через `as`. `as` в одном проверенном месте — нормально; `as` по всему коду — нет. Тогда `Email` в типе означает «прошёл проверку».",
      "Где пригодится: идентификаторы разных сущностей, деньги в разных валютах, проверенные строки (`Email`, `NonEmptyString`, `SafeHtml`), единицы измерения. Бренд существует только в типах, в JavaScript остаётся обычное число или строка.",
    ],
    example: `declare const brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [brand]: B };

type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;

const toUserId = (n: number) => n as UserId;
function loadUser(id: UserId) {}

loadUser(toUserId(1));
loadUser(42);                    // ошибка: обычное число — не UserId
declare const orderId: OrderId;
loadUser(orderId);               // ошибка: бренд другой`,
    keys: ["Структурная типизация не отличает `UserId` от `OrderId`, если оба — `number`.", "Бренд — пересечение с фиктивным полем `[brand]`, его нет во время работы.", "Брендированные значения создаёт умный конструктор: проверка, затем единственный `as`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `n`?",
      probe: "n",
      code: `declare const brand: unique symbol;
type UserId = number & { readonly [brand]: "UserId" };
declare const id: UserId;
const n = id + 1;`,
      opts: ["number", "UserId", "never", "number & { readonly [brand]: \"UserId\"; }"],
      a: 0,
      why: "Арифметика работает с числовой частью, результат — обычное `number`, бренд теряется.",
    },
    {
      type: "quiz",
      q: "Почему `type UserId = number` не защищает от путаницы с `OrderId`?",
      opts: ["Это просто другое имя для `number`: типы сравниваются по форме", "Алиасы не работают с числами", "Нужно писать `interface`", "Защищает, если включён `strict`"],
      a: 0,
      why: "Алиас не создаёт новый тип. Нужен бренд, чтобы формы различались.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши умный конструктор `parseEmail`: если в строке есть `@`, вернуть её как `Email`, иначе `null`.",
      code: `declare const brand: unique symbol;
type Email = string & { readonly [brand]: "Email" };

function parseEmail(s: string): Email | null {
  return null;
}`,
      tests: `declare function send(to: Email): void;
const e = parseEmail("a@b.ru");
if (e) send(e);
// @ts-expect-error — обычную строку отправить нельзя
send("a@b.ru");`,
      runtime: [["parseEmail('a@b.ru')", "\"a@b.ru\""], ["parseEmail('nope')", "null"]],
      forbid: ["any", "ignore"],
      hint: "`return s.includes(\"@\") ? (s as Email) : null;`",
      solution: `declare const brand: unique symbol;
type Email = string & { readonly [brand]: "Email" };

function parseEmail(s: string): Email | null {
  return s.includes("@") ? (s as Email) : null;
}`,
    },
  ],
};
