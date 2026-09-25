/**
 * Сверка с документацией React: каждая страница справочника react.dev привязана к уроку, карточке
 * или помечена как пропущенная с причиной. verify проверяет, что уроки и карточки существуют.
 * Сверено со справочником react.dev 25.09.2026 (React 19.3).
 */

export type RefCoverage = { lesson: string } | { card: string } | { skip: string };

export interface ReferencePage {
  /** Раздел справочника. */
  group: string;
  /** Название страницы, как в оглавлении. */
  page: string;
  url: string;
  covered: RefCoverage[];
}

const R = "https://react.dev/reference/";

const L = (lesson: string): RefCoverage => ({ lesson });
const skip = (why: string): RefCoverage => ({ skip: why });

const group = (name: string, base: string, rows: [page: string, path: string, ...covered: RefCoverage[]][]): ReferencePage[] =>
  rows.map(([page, path, ...covered]) => ({ group: name, page, url: R + base + path, covered }));

export const REACT_REFERENCE: ReferencePage[] = [
  ...group("react: хуки", "react/", [
    ["useActionState", "useActionState", L("ac1")],
    ["useCallback", "useCallback", L("hk7")],
    ["useContext", "useContext", L("ctx1"), L("ctx2")],
    ["useDebugValue", "useDebugValue", L("hk8")],
    ["useDeferredValue", "useDeferredValue", L("rn5")],
    ["useEffect", "useEffect", L("hk2"), L("hk3"), L("hk4")],
    ["useEffectEvent", "useEffectEvent", L("hk3")],
    ["useId", "useId", L("hk8")],
    ["useImperativeHandle", "useImperativeHandle", L("hk5")],
    ["useInsertionEffect", "useInsertionEffect", L("hk6")],
    ["useLayoutEffect", "useLayoutEffect", L("hk6")],
    ["useMemo", "useMemo", L("hk7")],
    ["useOptimistic", "useOptimistic", L("ac2")],
    ["useReducer", "useReducer", L("st2")],
    ["useRef", "useRef", L("hk5")],
    ["useState", "useState", L("st1")],
    ["useSyncExternalStore", "useSyncExternalStore", L("ext1")],
    ["useTransition", "useTransition", L("rn5")],
  ]),
  ...group("react: компоненты", "react/", [
    ["<Activity>", "Activity", L("rn7")],
    ["<Fragment> (<>...</>)", "Fragment", L("jsx5")],
    ["<Profiler>", "Profiler", L("rp1")],
    ["<StrictMode>", "StrictMode", L("jsx5")],
    ["<Suspense>", "Suspense", L("rn6")],
    ["<ViewTransition>", "ViewTransition", L("rn7")],
  ]),
  ...group("react: API", "react/", [
    ["act", "act", L("tst2")],
    ["addTransitionType", "addTransitionType", L("rn7")],
    ["cache", "cache", L("ssr4")],
    ["cacheSignal", "cacheSignal", L("ssr4")],
    ["captureOwnerStack", "captureOwnerStack", L("ac3")],
    ["createContext", "createContext", L("ctx1")],
    ["lazy", "lazy", L("rn6")],
    ["memo", "memo", L("hk7")],
    ["startTransition", "startTransition", L("rn5")],
    ["use", "use", L("rn6"), L("ctx3")],
  ]),
  ...group("react: директивы", "rsc/", [
    ["'use client'", "use-client", L("ssr2")],
    ["'use server'", "use-server", L("ssr3")],
    ["Server Components", "server-components", L("ssr2")],
    ["Server Functions", "server-functions", L("ssr3")],
  ]),
  ...group("react: устаревшие API", "react/", [
    ["Children", "Children", L("pt1")],
    ["cloneElement", "cloneElement", L("pt1")],
    ["Component", "Component", L("pt4"), L("pt3")],
    ["createElement", "createElement", L("jsx1")],
    ["createRef", "createRef", skip("ref для классовых компонентов; в функциях его место занял useRef, урок hk5")],
    ["forwardRef", "forwardRef", L("hk5")],
    ["isValidElement", "isValidElement", skip("служебная проверка «это элемент React?», на собеседованиях почти не встречается")],
    ["PureComponent", "PureComponent", L("pt4")],
  ]),
  ...group("react-dom: хуки", "react-dom/hooks/", [
    ["useFormStatus", "useFormStatus", L("ac2")],
  ]),
  ...group("react-dom: компоненты", "react-dom/components/", [
    ["Общие пропсы (className, style, ref, события, dangerouslySetInnerHTML)", "common", L("jsx1"), L("jsx4"), L("hk5")],
    ["<form>", "form", L("ac1")],
    ["<input>", "input", L("st5")],
    ["<option>", "option", skip("работает как в HTML, выбранное значение задают через value у <select>, урок st5")],
    ["<progress>", "progress", skip("обычный элемент HTML без особенностей React")],
    ["<select>", "select", L("st5")],
    ["<textarea>", "textarea", L("st5")],
    ["<link>", "link", L("ssr4")],
    ["<meta>", "meta", L("ssr4")],
    ["<script>", "script", L("ssr4")],
    ["<style>", "style", L("ssr4")],
    ["<title>", "title", L("ssr4")],
  ]),
  ...group("react-dom: API", "react-dom/", [
    ["createPortal", "createPortal", L("jsx5")],
    ["flushSync", "flushSync", L("rn1")],
    ["preconnect", "preconnect", L("ssr4")],
    ["prefetchDNS", "prefetchDNS", L("ssr4")],
    ["preinit", "preinit", L("ssr4")],
    ["preinitModule", "preinitModule", L("ssr4")],
    ["preload", "preload", L("ssr4")],
    ["preloadModule", "preloadModule", L("ssr4")],
    ["browser", "browser", L("ssr1")],
  ]),
  ...group("react-dom: клиентские API", "react-dom/client/", [
    ["createRoot", "createRoot", L("rn1"), L("rn4")],
    ["hydrateRoot", "hydrateRoot", L("ssr1")],
  ]),
  ...group("react-dom: серверные API", "react-dom/server/", [
    ["renderToPipeableStream", "renderToPipeableStream", L("ssr1")],
    ["renderToReadableStream", "renderToReadableStream", L("ssr1")],
    ["renderToString", "renderToString", L("ssr1")],
    ["renderToStaticMarkup", "renderToStaticMarkup", skip("HTML без гидратации, например для писем; на собеседованиях почти не встречается")],
    ["resume", "resume", skip("продолжение частичного пре-рендера — внутренняя кухня фреймворков, упомянут в уроке ac3")],
    ["resumeToPipeableStream", "resumeToPipeableStream", skip("продолжение частичного пре-рендера для Node.js — то же, что resume")],
  ]),
  ...group("react-dom: статические API", "react-dom/static/", [
    ["prerender", "prerender", skip("генерация статического HTML — задача фреймворков; SSG разобран в карточке react-csr-ssr-ssg"), { card: "react-csr-ssr-ssg" }],
    ["prerenderToNodeStream", "prerenderToNodeStream", skip("то же, что prerender, для потоков Node.js")],
    ["resumeAndPrerender", "resumeAndPrerender", skip("частичный пре-рендер для фреймворков")],
    ["resumeAndPrerenderToNodeStream", "resumeAndPrerenderToNodeStream", skip("частичный пре-рендер для фреймворков, вариант для потоков Node.js")],
  ]),
  ...group("Правила React", "rules/", [
    ["Компоненты и хуки должны быть чистыми", "components-and-hooks-must-be-pure", L("jsx2"), L("rp2")],
    ["React вызывает компоненты и хуки", "react-calls-components-and-hooks", L("jsx2")],
    ["Правила хуков", "rules-of-hooks", L("hk1")],
  ]),
  ...group("React Compiler", "react-compiler/", [
    ["Конфигурация", "configuration", L("rp2")],
    ["Директивы", "directives", L("rp2")],
    ["Компиляция библиотек", "compiling-libraries", skip("нужно авторам библиотек, а не приложений")],
  ]),
  ...group("ESLint Plugin React Hooks", "eslint-plugin-react-hooks/", [
    ["Правила линтера", "", L("hk1"), L("hk3"), L("rp2")],
  ]),
];
