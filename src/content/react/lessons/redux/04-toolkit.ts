import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "rdx4",
  region: 5,
  level: "middle",
  title: "Redux Toolkit: `createSlice`, Immer и `configureStore`",
  q: "Что такое Redux Toolkit и почему это стандарт? Как в `createSlice` можно «мутировать» состояние?",
  answer:
    "Redux Toolkit (RTK) — официальный современный способ писать на Redux, он убирает шаблонный код. `configureStore` создаёт стор и сам подключает thunk, Redux DevTools и проверки в разработке. `createSlice` описывает часть состояния: начальное значение и редьюсеры, а типы и генераторы действий создаёт сам. Внутри редьюсеров можно писать `state.items.push(x)`, потому что RTK использует Immer: он записывает изменения черновика и собирает из них новое неизменяемое состояние. Старый `createStore` помечен устаревшим именно для того, чтобы все переходили на RTK.",
  theory: {
    p: [
      "Классический Redux требовал много ручной работы: константы типов, генераторы действий, `switch` в редьюсере, неизменяемые обновления с кучей `...`, ручная настройка middleware и DevTools. Redux Toolkit (RTK) — официальный пакет команды Redux, который делает это за тебя. С Redux 4.2 функция `createStore` помечена устаревшей, чтобы подтолкнуть к RTK, но работать продолжает.",
      "`configureStore` создаёт стор: объединяет редьюсеры, подключает thunk и Redux DevTools, а в режиме разработки добавляет проверки — что состояние не меняют напрямую и что в нём нет несериализуемых значений вроде функций и промисов.",
      "`createSlice` описывает кусок состояния (slice): имя, начальное значение и редьюсеры. По ним он сам создаёт генераторы действий с типами вида `cart/added`. Внутри редьюсеров можно писать «мутирующий» код: `state.items.push(item)`. Это работает благодаря библиотеке Immer: она даёт редьюсеру черновик, записывает, что с ним сделали, и собирает новое неизменяемое состояние. Старое остаётся нетронутым.",
      "Правило Immer: либо меняешь черновик, либо возвращаешь новое значение, но не то и другое сразу. «Мутировать» можно только внутри `createSlice` и `createReducer`, а не в компонентах. Для TypeScript делают типизированные хуки `useAppSelector` и `useAppDispatch`, чтобы не писать тип состояния в каждом селекторе.",
    ],
    code: `const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as { id: number; qty: number }[] },
  reducers: {
    added(state, action: PayloadAction<number>) {
      // Immer: выглядит как изменение, на деле создаётся новое состояние
      state.items.push({ id: action.payload, qty: 1 });
    },
    cleared(state) {
      state.items = [];
    },
  },
});

// added(7) → { type: 'cart/added', payload: 7 }
export const { added, cleared } = cartSlice.actions;

export const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;`,
    flow: {
      actors: ["dispatch(added(7))", "Редьюсер из createSlice", "Immer: черновик", "Стор"],
      steps: [
        { from: 0, to: 1, label: "{ type: 'cart/added', payload: 7 }", note: "тип и генератор созданы автоматически" },
        { from: 1, to: 2, label: "state.items.push(…)", note: "меняется черновик, а не состояние" },
        { from: 2, to: 3, label: "новое неизменяемое состояние", note: "старое не тронуто" },
        { from: 3, to: 3, label: "запись в журнале Redux DevTools", note: "подключены configureStore" },
      ],
    },
    keys: [
      "RTK — официальный способ писать на Redux: `configureStore`, `createSlice`, меньше шаблонного кода.",
      "`configureStore` сам подключает thunk, DevTools и проверки в разработке.",
      "`createSlice` использует Immer: «мутирующий» код меняет черновик, а на выходе новое неизменяемое состояние.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      code: `const userSlice = createSlice({
  name: 'user',
  initialState: { name: '' },
  reducers: {
    renamed(state, action: PayloadAction<string>) {
      state.name = action.payload;
      return { ...state, name: action.payload };
    },
  },
});`,
      q: "Что не так с этим редьюсером?",
      opts: [
        "Он и меняет черновик, и возвращает новое значение — Immer так запрещает",
        "`state` нельзя менять внутри `createSlice`",
        "Редьюсер должен быть асинхронным",
        "Всё правильно",
      ],
      a: 0,
      why: "Immer выбросит ошибку. Нужно одно из двух: `state.name = action.payload` или `return { ...state, name: action.payload }`.",
    },
    {
      type: "sort",
      q: "Что делает Redux Toolkit сам, а что остаётся тебе?",
      groups: ["Делает RTK", "Решаешь сам"],
      items: [
        ["создаёт типы и генераторы действий", 0],
        ["подключает Redux DevTools", 0],
        ["подключает thunk", 0],
        ["решает, какие данные вообще хранить в сторе", 1],
        ["пишет логику редьюсеров", 1],
      ],
      why: "RTK убирает шаблонный код, но не проектирует состояние за тебя.",
    },
    {
      type: "quiz",
      q: "Почему в редьюсере `createSlice` можно писать `state.items.push(x)`?",
      opts: [
        "Immer даёт черновик и собирает из изменений новое неизменяемое состояние",
        "RTK отключает неизменяемость",
        "Состояние в RTK — обычный изменяемый объект",
        "`push` в RTK переопределён",
      ],
      a: 0,
      why: "Снаружи всё по правилам Redux: старое состояние не изменилось, а новое — новый объект. «Мутация» — только удобный синтаксис.",
    },
  ],
};
