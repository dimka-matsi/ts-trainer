import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "sq4",
  region: 7,
  level: "middle",
  title: "RTK Query и выбор библиотеки",
  q: "Что такое RTK Query и чем он отличается от TanStack Query? Что выбрать?",
  answer:
    "RTK Query — библиотека серверного состояния внутри Redux Toolkit: API описывают в `createApi` как набор эндпоинтов, а она генерирует хуки вроде `useGetProductsQuery` и хранит кэш в Redux-сторе. Связь запросов и мутаций задаётся тегами: запрос объявляет `providesTags`, мутация — `invalidatesTags`, и нужные данные перезапрашиваются сами. Неиспользуемые данные по умолчанию живут 60 секунд. Если проект уже на Redux Toolkit — RTK Query естественный выбор, кэш виден в Redux DevTools. Если Redux нет — TanStack Query: он не требует стора и гибче. Брать обе библиотеки сразу не стоит.",
  theory: {
    p: [
      "RTK Query входит в Redux Toolkit. API описывают один раз: `createApi` с базовым запросом и эндпоинтами — `query` для чтения и `mutation` для изменений. По ним генерируются хуки: `useGetProductsQuery`, `useUpdateProductMutation`. Кэш хранится в Redux-сторе, его видно в Redux DevTools вместе с остальными действиями.",
      "Инвалидация через теги. Запрос списка объявляет `providesTags: ['Product']`, мутация — `invalidatesTags: ['Product']`. После мутации все запросы с этим тегом перезапрашиваются автоматически. Можно точнее, по id: `{ type: 'Product', id: 7 }`. Похоже на `invalidateQueries`, но связи описаны декларативно в одном месте.",
      "Поведение кэша. Одинаковые запросы объединяются, данные делят все компоненты. Когда компонентов, использующих запрос, не осталось, данные живут `keepUnusedDataFor` — по умолчанию 60 секунд. Обновление при фокусе окна и восстановлении сети включается отдельно. RTK Query сознательно не нормализует кэш: данные проще связать тегами.",
      "Что выбрать. Проект на Redux Toolkit — RTK Query: одна экосистема, один стор, общие DevTools. Нет Redux — TanStack Query: не нужен стор, больше возможностей, например бесконечные списки, свои DevTools. Самый простой вариант — SWR. Главное правило: одна библиотека серверного состояния на проект, и серверные данные не копируют в клиентское хранилище.",
    ],
    code: `export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getProducts: build.query<Product[], void>({
      query: () => 'products',
      providesTags: ['Product'],
    }),
    updateProduct: build.mutation<Product, Partial<Product> & { id: number }>({
      query: ({ id, ...patch }) => ({ url: 'products/' + id, method: 'PATCH', body: patch }),
      invalidatesTags: ['Product'], // список перезапросится сам
    }),
  }),
});

export const { useGetProductsQuery, useUpdateProductMutation } = api;`,
    flow: {
      actors: ["ProductList: useGetProductsQuery", "Кэш RTK Query в сторе", "useUpdateProductMutation", "Сервер"],
      steps: [
        { from: 0, to: 1, label: "getProducts", note: "providesTags: Product" },
        { from: 1, to: 3, label: "GET /api/products" },
        { from: 2, to: 3, label: "PATCH /api/products/7" },
        { from: 3, to: 2, label: "200: обновлено" },
        { from: 2, to: 1, label: "invalidatesTags: Product", note: "все запросы с тегом устарели" },
        { from: 1, to: 3, label: "GET /api/products", note: "перезапрос сам" },
        { from: 1, to: 0, label: "свежий список" },
      ],
    },
    keys: [
      "RTK Query — в Redux Toolkit: `createApi` с эндпоинтами, сгенерированные хуки, кэш в Redux-сторе.",
      "Теги: запрос `providesTags`, мутация `invalidatesTags` — перезапрос автоматически. Неиспользуемые данные живут 60 секунд.",
      "Есть Redux Toolkit — RTK Query, нет — TanStack Query. Одна библиотека на проект, серверные данные не копируют в хранилище.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Проект уже на Redux Toolkit, нужен кэш запросов к API. Что логичнее выбрать?",
      opts: [
        "RTK Query: одна экосистема и один стор, кэш виден в Redux DevTools",
        "TanStack Query и копировать данные в Redux",
        "Писать `createAsyncThunk` на каждый запрос с ручным кэшем",
        "Хранить ответы в контексте",
      ],
      a: 0,
      why: "Две библиотеки для одной задачи — лишний код и два источника правды. В проекте на RTK его собственный инструмент ложится естественнее.",
    },
    {
      type: "match",
      q: "Сопоставь понятие RTK Query и его смысл.",
      pairs: [
        ["`createApi`", "описание всех эндпоинтов API в одном месте"],
        ["`providesTags`", "какие данные даёт запрос"],
        ["`invalidatesTags`", "какие данные устаревают после мутации"],
        ["`keepUnusedDataFor`", "сколько неиспользуемые данные живут в кэше"],
      ],
      why: "Теги связывают чтение и изменение: мутация говорит, что устарело, а запросы с этим тегом обновляются сами.",
    },
    {
      type: "quiz",
      q: "Сколько по умолчанию RTK Query хранит данные, которые больше не использует ни один компонент?",
      opts: ["60 секунд", "5 минут", "Бесконечно", "0 секунд"],
      a: 0,
      why: "`keepUnusedDataFor` по умолчанию 60 секунд. 5 минут — это `gcTime` у TanStack Query, их часто путают.",
    },
  ],
};
