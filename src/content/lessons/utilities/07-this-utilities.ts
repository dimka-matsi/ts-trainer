import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "u7",
  region: 5,
  title: "Утилиты для this",
  q: "Как типизировать `this` в функциях и объектах?",
  answer: "Тип `this` объявляют псевдо-параметром `this: T`. `ThisParameterType` его достаёт, `OmitThisParameter` убирает, как после `bind`. `ThisType<T>` — маркер, задающий тип `this` в методах объектного литерала, для него нужен `noImplicitThis`.",
  theory: {
    p: [
      "Функция может объявить тип `this` первым псевдо-параметром: `function toHex(this: Number)`. В JS его нет, он только для проверки вызовов.",
      "`ThisParameterType<F>` достаёт этот тип (или `unknown`, если его нет). `OmitThisParameter<F>` убирает `this` из сигнатуры — это тип функции после `bind`.",
      "`ThisType<T>` ничего не преобразует. Это маркер: в объектном литерале, чей контекстный тип содержит `ThisType<T>`, `this` в методах имеет тип `T`. Нужен флаг `noImplicitThis` из `strict`. Так типизируют Vue Options API и похожие фабрики.",
    ],
    example: `function toHex(this: Number) {
  return this.toString(16);
}
type T = ThisParameterType<typeof toHex>;         // Number
const five: OmitThisParameter<typeof toHex> = toHex.bind(5);
five();

function define<D, M>(o: { data: D; methods: M & ThisType<D & M> }) {
  return o;
}
define({
  data: { count: 0 },
  methods: { inc() { this.count++; } },  // this знает про count
});`,
    keys: ["`this: T` — псевдо-параметр, стирается в JS.", "`OmitThisParameter` — тип после `bind`.", "`ThisType<T>` — маркер для методов в литерале."],
  },
  tasks: [
    {
      type: "predict",
      q: "Во что раскроется тип `T`?",
      probe: "T",
      code: `function greet(this: { name: string }, msg: string) { return msg + this.name; }
type T = ThisParameterType<typeof greet>;`,
      opts: ["unknown", "{ name: string; }", "string", "Window"],
      a: 1,
      why: "`ThisParameterType` через `infer` достаёт тип псевдо-параметра `this`.",
    },
    {
      type: "predict",
      q: "Во что раскроется тип `F`?",
      probe: "F",
      code: `function greet(this: { name: string }, msg: string) { return msg + this.name; }
type F = OmitThisParameter<typeof greet>;`,
      opts: ["(this: { name: string; }, msg: string) => string", "(msg: string) => string", "() => string", "never"],
      a: 1,
      why: "`OmitThisParameter` оставляет обычные параметры и результат, убирая `this`. Такой тип у функции после `bind`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Метод `inc` не знает тип `this`. Добавь `ThisType` в тип `Store`, чтобы `this.count` типизировался.",
      code: `type Store<S, A> = {
  state: S;
  actions: A;
};

function createStore<S, A>(store: Store<S, A>) {
  return store;
}

createStore({
  state: { count: 0 },
  actions: {
    inc() {
      this.count++;
    },
  },
});`,
      forbid: ["any", "as", "ignore"],
      must: ["this.count", "ThisType"],
      hint: "`actions: A & ThisType<S & A>`.",
      solution: `type Store<S, A> = {
  state: S;
  actions: A & ThisType<S & A>;
};

function createStore<S, A>(store: Store<S, A>) {
  return store;
}

createStore({
  state: { count: 0 },
  actions: {
    inc() {
      this.count++;
    },
  },
});`,
    },
  ],
};
