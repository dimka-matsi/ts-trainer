import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "ac3",
  region: 10,
  title: "Что нового в React 18 и 19",
  q: "Что изменилось в React 18 и React 19? Что появилось в 19.2 и 19.3?",
  answer:
    "React 18 (2022) принёс конкурентный рендеринг через `createRoot`: автоматическую пакетную обработку везде, переходы, потоковый SSR с Suspense и выборочной гидрацией, а также `useId`, `useSyncExternalStore` и двойной запуск эффектов в StrictMode. React 19 (декабрь 2024) — Actions и хуки форм `useActionState`, `useFormStatus`, `useOptimistic`, хук `use`, `ref` как проп, контекст как провайдер, теги `<title>` и `<meta>` прямо в компонентах, стабильные Server Components; удалены `propTypes`, строковые ref, старый контекст и `ReactDOM.render`. В 19.2 появились `<Activity>`, `useEffectEvent` и дорожки React в Performance, в 19.3 — стабильный `<ViewTransition>`, `ref` у Fragment и `browser()`.",
  theory: {
    p: [
      "React 18 — про конкурентность. `createRoot` вместо `ReactDOM.render` включает новые возможности. Пакетная обработка обновлений работает везде, а не только в обработчиках React. Переходы — `useTransition` и `startTransition` — позволяют прервать тяжёлый рендер. На сервере — потоковый рендеринг с Suspense и выборочная гидратация. Новые хуки: `useId`, `useSyncExternalStore`, `useInsertionEffect`, `useDeferredValue`. StrictMode в разработке стал повторно монтировать эффекты.",
      "React 19 — про данные и формы. Actions: асинхронные функции в переходах, `<form action={fn}>`, хуки `useActionState`, `useFormStatus` из `react-dom` и `useOptimistic`. Хук `use` читает промисы и контекст. `ref` — обычный проп, у колбэка ref есть очистка, `<Context value>` работает как провайдер. `<title>`, `<meta>` и `<link>` можно писать в любом компоненте — React поднимет их в `<head>`. Server Components и Server Functions стали стабильными. Ошибки гидратации показываются с разницей, а не списком предупреждений.",
      "Что удалили в React 19: `propTypes` и `defaultProps` у функциональных компонентов (значения по умолчанию задают в параметрах), строковые ref, старый API контекста (`contextTypes`), `createFactory`, из `react-dom` — `render`, `hydrate`, `unmountComponentAtNode` и `findDOMNode`. `forwardRef` пока работает, но больше не нужен.",
      "19.1–19.3. В 19.1 — стек владельцев (`captureOwnerStack`) для отладки. В 19.2 (октябрь 2025) — `<Activity>`, `useEffectEvent`, `cacheSignal`, дорожки React в панели Performance, частичный пре-рендер на сервере. В 19.3 (сентябрь 2026) — стабильный `<ViewTransition>` с `addTransitionType`, `ref` у `Fragment`, `browser()` из `react-dom` для компонентов, которые рендерятся только в браузере, поддержка Trusted Types и контекст прямо в Server Components.",
    ],
    code: `// React 18: новый корень
createRoot(document.getElementById('root')!).render(<App />);

// React 19: ref как проп, контекст как провайдер, метаданные в компоненте
function Page({ ref, title }: { ref?: React.Ref<HTMLDivElement>; title: string }) {
  return (
    <ThemeContext value="dark">
      <title>{title}</title>
      <div ref={ref}>…</div>
    </ThemeContext>
  );
}

// React 19: значения по умолчанию — в параметрах, а не в defaultProps
function Button({ size = 'm' }: { size?: 's' | 'm' | 'l' }) {
  return <button className={size}>OK</button>;
}`,
    flow: {
      actors: ["React 17", "React 18 (2022)", "React 19 (декабрь 2024)", "19.2 (октябрь 2025)", "19.3 (сентябрь 2026)"],
      steps: [
        { from: 0, to: 1, label: "createRoot, конкурентный рендеринг", note: "batching везде, переходы, потоковый SSR" },
        { from: 1, to: 2, label: "Actions, use, ref как проп", note: "хуки форм, метаданные, Server Components" },
        { from: 2, to: 3, label: "Activity, useEffectEvent", note: "дорожки React в Performance" },
        { from: 3, to: 4, label: "ViewTransition стабилен", note: "ref у Fragment, browser()" },
      ],
    },
    keys: [
      "React 18: `createRoot`, конкурентный рендеринг, batching везде, переходы, потоковый SSR, `useId` и `useSyncExternalStore`.",
      "React 19: Actions и хуки форм, `use`, `ref` как проп, контекст как провайдер, метаданные, стабильные Server Components; удалены `propTypes`, строковые ref, `ReactDOM.render`.",
      "19.2 — `Activity`, `useEffectEvent`, дорожки Performance. 19.3 — стабильный `ViewTransition`, `ref` у Fragment, `browser()`.",
    ],
  },
  tasks: [
    {
      type: "sort",
      q: "В какой версии это появилось?",
      groups: ["React 18", "React 19"],
      items: [
        ["`createRoot` и конкурентный рендеринг", 0],
        ["автоматический batching в таймерах и промисах", 0],
        ["`useId`", 0],
        ["`useActionState` и `<form action={fn}>`", 1],
        ["`ref` как обычный проп", 1],
        ["хук `use`", 1],
      ],
      why: "18-я версия — про то, как React рендерит, 19-я — про данные, формы и сервер.",
    },
    {
      type: "quiz",
      q: "Что из этого удалено в React 19?",
      opts: [
        "`propTypes` у функциональных компонентов и `ReactDOM.render`",
        "`useState`",
        "Классовые компоненты",
        "`useEffect`",
      ],
      a: 0,
      why: "Классы продолжают работать. Удалены давно устаревшие API: строковые ref, старый контекст, `render` и `hydrate` из `react-dom`.",
    },
    {
      type: "quiz",
      q: "Какие возможности появились в React 19.2?",
      opts: [
        "`<Activity>`, `useEffectEvent` и дорожки React в панели Performance",
        "`createRoot` и переходы",
        "Хуки состояния",
        "JSX",
      ],
      a: 0,
      why: "19.2 вышла в октябре 2025 года. Стабильный `<ViewTransition>` пришёл позже, в 19.3.",
    },
  ],
};
