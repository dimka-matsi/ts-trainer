import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "rdx5",
  region: 5,
  level: "middle",
  title: "`createAsyncThunk` и нормализация",
  q: "Как в Redux Toolkit загружать данные? Что будет, если хранить всё состояние в одном большом объекте, и зачем нормализация?",
  answer:
    "`createAsyncThunk` оборачивает асинхронную функцию и сам отправляет три действия: `pending`, `fulfilled` с данными и `rejected` с ошибкой; их обрабатывают в `extraReducers`. Списки хранят нормализованно, как таблицу в базе: объект `entities` по id и массив `ids` для порядка. Тогда изменение одного элемента меняет одну запись, а не ссылки на всё подряд. Если же держать всё в одном вложенном объекте и выбирать его целиком, любое изменение даёт новые ссылки по всей цепочке, и компоненты перерисовываются слишком часто.",
  theory: {
    p: [
      "`createAsyncThunk('orders/fetch', async () => …)` создаёт thunk и три типа действий: `orders/fetch/pending`, `orders/fetch/fulfilled`, `orders/fetch/rejected`. Слайс ловит их в `extraReducers` и переключает статус загрузки. Писать `try/catch` и отправлять действия руками больше не нужно.",
      "Нормализация — хранить данные как таблицу, а не как вложенное дерево. Вместо массива заказов, где в каждом лежит полный объект пользователя, хранят `entities` — объект по id — и `ids` — порядок. Связи — через id. Так одна сущность лежит в одном месте, и её обновление меняет одну запись.",
      "Почему это важно для ререндеров. Неизменяемое обновление вложенного поля создаёт новые объекты по всей цепочке до корня. Если компонент выбирает весь список или большой объект, он перерисуется при изменении любого элемента. Поэтому состояние дробят на небольшие слайсы, а компоненты выбирают минимум: строка таблицы — свой элемент по id, список — массив `ids`.",
      "В RTK для этого есть `createEntityAdapter`: он создаёт структуру `{ ids, entities }`, готовые редьюсеры `addOne`, `setAll`, `removeOne` и селекторы `selectAll`, `selectById`. Список отрисовывает `ids`, а каждая строка сама выбирает свой заказ по id — изменится один заказ, перерисуется одна строка.",
    ],
    code: `export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const res = await fetch('/api/orders');
  return (await res.json()) as Order[];
});

const ordersAdapter = createEntityAdapter<Order>();

const ordersSlice = createSlice({
  name: 'orders',
  initialState: ordersAdapter.getInitialState({ status: 'idle' as 'idle' | 'loading' | 'failed' }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'idle';
        ordersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchOrders.rejected, (state) => { state.status = 'failed'; });
  },
});
// Состояние: { ids: [7, 9], entities: { 7: { ... }, 9: { ... } }, status: 'idle' }`,
    flow: {
      actors: ["Компонент", "createAsyncThunk", "API", "Слайс orders"],
      steps: [
        { from: 0, to: 1, label: "dispatch(fetchOrders())" },
        { from: 1, to: 3, label: "orders/fetch/pending", note: "status = 'loading'" },
        { from: 1, to: 2, label: "GET /api/orders" },
        { from: 2, to: 1, label: "заказы" },
        { from: 1, to: 3, label: "orders/fetch/fulfilled", note: "setAll: { ids, entities }" },
        { from: 3, to: 0, label: "список выбирает ids, строка — свой заказ", note: "изменится один заказ — перерисуется одна строка" },
      ],
    },
    keys: [
      "`createAsyncThunk` сам отправляет `pending`, `fulfilled` и `rejected`, их обрабатывают в `extraReducers`.",
      "Нормализация: `entities` по id и `ids` для порядка, связи через id. Одна сущность — одно место.",
      "Мелкие слайсы и точные селекторы: изменение одного элемента не перерисовывает всё. `createEntityAdapter` даёт готовые редьюсеры и селекторы.",
    ],
  },
  tasks: [
    {
      type: "order",
      q: "Расставь, что происходит при успешной загрузке через `createAsyncThunk`.",
      items: [
        "компонент вызывает `dispatch(fetchOrders())`",
        "отправляется `orders/fetch/pending`",
        "выполняется запрос к API",
        "отправляется `orders/fetch/fulfilled` с данными",
        "`extraReducers` кладёт данные в состояние",
      ],
      why: "Три действия жизненного цикла RTK отправляет сам, тебе остаётся описать реакцию на них.",
    },
    {
      type: "quiz",
      q: "Что будет, если хранить весь state в одном большом вложенном объекте и выбирать его целиком?",
      opts: [
        "Любое изменение создаёт новые ссылки по цепочке, и компоненты перерисовываются слишком часто",
        "Redux перестанет работать",
        "Состояние не сохранится",
        "Ничего: так и рекомендуют",
      ],
      a: 0,
      why: "Неизменяемое обновление меняет ссылки от изменённого поля до корня. Широкий селектор видит «изменение» почти всегда.",
    },
    {
      type: "quiz",
      q: "Как выглядит нормализованный список заказов?",
      opts: [
        "`{ ids: [7, 9], entities: { 7: {…}, 9: {…} } }`",
        "Массив заказов, в каждом полная копия пользователя",
        "`{ orders: '7,9' }`",
        "Отдельная переменная на каждый заказ",
      ],
      a: 0,
      why: "Как таблица в базе: запись по id и отдельный порядок. Пользователь лежит в своей таблице, а заказ хранит только его id.",
    },
  ],
};
