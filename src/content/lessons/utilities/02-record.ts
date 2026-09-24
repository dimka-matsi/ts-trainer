import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u2",
  region: 5,
  title: "Record",
  q: "Чем `Record<K, V>` отличается от index signature?",
  answer: "`Record<K, V>` создаёт объект с ключами `K` и значениями `V`. Если `K` — union литералов, все ключи обязательны, и компилятор поймает пропущенный. `Record<string, V>` эквивалентен index signature.",
  theory: {
    p: [
      "`Record<K, V>` строит объект с ключами `K` и значениями `V`. Если `K` — union литералов, каждый ключ обязателен: забытый ключ даст ошибку. Это удобно для словарей переводов, конфигов по окружениям, маппинга статусов на цвета.",
      "С широким ключом `Record<string, V>` ведёт себя как index signature `{ [key: string]: V }`. Чтение по любому ключу имеет тип `V`, хотя ключа может не быть; флаг `noUncheckedIndexedAccess` добавляет `| undefined`.",
      "Внутри: `{ [P in K]: V }`, где `K extends keyof any` — то есть `string | number | symbol`.",
    ],
    example: `type Cat = "miffy" | "boris";
interface Info { age: number }

const cats: Record<Cat, Info> = {
  miffy: { age: 10 },
  boris: { age: 5 },  // уберёшь — ошибка
};

const cache: Record<string, number> = {};
const v = cache["nope"];  // number, хотя там undefined

type MyRecord<K extends keyof any, V> = { [P in K]: V };`,
    keys: ["Union ключей — все ключи обязательны.", "`Record<string, V>` = index signature.", "Чтение по отсутствующему ключу типизируется как `V`."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `Rec`?",
      probe: "Rec",
      code: `type Rec = Record<"a" | "b", boolean>;`,
      opts: ["{ [key: string]: boolean; }", "{ a: boolean; b: boolean; }", "{ a?: boolean; b?: boolean; }", "Record<string, boolean>"],
      a: 1,
      why: "Mapped type проходит по каждому члену union ключей и создаёт обязательное свойство.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Словарь должен покрывать все языки. Добавь недостающий перевод.",
      code: `type Lang = "en" | "ru" | "pl";

const hello: Record<Lang, string> = {
  en: "Hello",
  ru: "Привет",
};`,
      forbid: ["any", "as", "ignore"],
      must: ["Record<Lang, string>"],
      hint: "Компилятор подсказывает, какого ключа не хватает.",
      solution: `type Lang = "en" | "ru" | "pl";

const hello: Record<Lang, string> = {
  en: "Hello",
  ru: "Привет",
  pl: "Cześć",
};`,
    },
    {
      type: "code",
      kind: "write",
      goal: "Напиши `MyRecord<K, V>` без встроенного `Record`.",
      code: `type MyRecord<K, V> = unknown;`,
      tests: `type t1 = Expect<Equal<MyRecord<"x" | "y", number>, { x: number; y: number }>>;
type t2 = Expect<Equal<MyRecord<string, boolean>, { [k: string]: boolean }>>;`,
      forbid: ["any", "ignore", {"re": "\\bRecord\\b", "msg": "Без встроенного Record"}],
      hint: "Ключи нужно ограничить: `K extends keyof any`.",
      solution: `type MyRecord<K extends keyof any, V> = { [P in K]: V };`,
    },
  ],
};
