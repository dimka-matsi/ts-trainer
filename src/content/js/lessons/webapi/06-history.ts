import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "wa6",
  region: 7,
  level: "middle",
  title: "URL, History API и роутинг на клиенте",
  q: "Как работает роутинг в SPA? Что делают `pushState` и событие `popstate`?",
  answer:
    "SPA меняет адрес без перезагрузки через History API: `history.pushState(state, \"\", url)` добавляет запись в историю, `replaceState` заменяет текущую. Сам по себе `pushState` ничего не загружает и не вызывает `popstate` — роутер после вызова сам рисует нужную страницу. `popstate` срабатывает, когда пользователь нажимает «назад» или «вперёд», и роутер рисует страницу по новому адресу. Сервер при этом должен на любой путь отдавать `index.html`, иначе обновление страницы на `/profile` даст 404. Для разбора адресов есть `URL` и `URLSearchParams`.",
  theory: {
    p: [
      "`new URL(\"https://shop.ru/catalog?page=2#top\")` разбирает адрес на части: `protocol`, `host`, `pathname`, `search`, `hash`. `url.searchParams` — объект `URLSearchParams` с методами `get`, `getAll`, `set`, `append`, `delete`; при изменении он обновляет `url.search`. `URLSearchParams` сам кодирует значения, поэтому склеивать адрес строками не нужно.",
      "History API. `history.pushState(state, \"\", \"/profile\")` меняет адрес и добавляет запись в историю — без запроса к серверу. `replaceState` заменяет текущую запись. `state` — любые данные, которые вернутся при возврате на эту запись в `history.state`. Важно: `pushState` не вызывает `popstate` и ничего не рисует — это делает роутер.",
      "Событие `popstate` приходит на `window`, когда пользователь идёт «назад» или «вперёд» по записям, созданным `pushState`. Роутер читает `location.pathname` и показывает нужную страницу. Ссылки внутри SPA перехватывают: клик по `<a>` — `preventDefault`, `pushState`, отрисовка. Старый способ — роутинг по `#hash` и событие `hashchange`: сервер части после `#` не видит, поэтому настройка сервера не нужна.",
      "Серверная часть. При обновлении страницы на `/profile` браузер запрашивает этот путь у сервера. Если сервер знает только `/`, будет 404. Поэтому для SPA сервер на все неизвестные пути отдаёт `index.html` — так называемый fallback. Новее History API есть Navigation API (`navigation.navigate`, событие `navigate`), которое упрощает перехват переходов; прежде чем использовать, проверь поддержку браузерами.",
    ],
    code: `const url = new URL("https://shop.ru/catalog?page=2&sort=price#top");
console.log(url.pathname, url.searchParams.get("page"), url.hash);
url.searchParams.set("page", "3");
url.searchParams.append("tag", "кот и пёс");      // закодируется само
console.log(url.search);

// роутер SPA в браузере
function navigate(path) {
  history.pushState({ from: location.pathname }, "", path); // popstate НЕ сработает
  render(location.pathname);
}
window.addEventListener("popstate", () => render(location.pathname)); // «назад» и «вперёд»
document.addEventListener("click", (event) => {
  const link = event.target.closest("a[data-link]");
  if (!link) return;
  event.preventDefault();
  navigate(link.getAttribute("href"));
});`,
    flow: {
      actors: ["Пользователь", "Роутер", "История", "Сервер"],
      steps: [
        { from: 0, to: 1, label: "клик по ссылке /profile" },
        { from: 1, to: 2, label: "pushState: новая запись, без запроса" },
        { from: 0, to: 2, label: "кнопка «назад» → popstate" },
        { from: 2, to: 1, label: "роутер рисует страницу по location.pathname" },
        { from: 0, to: 3, label: "F5 на /profile: запрос к серверу", note: "сервер должен отдать index.html, иначе 404" },
      ],
    },
    keys: [
      "`URL` и `URLSearchParams` разбирают и собирают адреса и сами кодируют значения.",
      "`pushState` и `replaceState` меняют адрес без загрузки и не вызывают `popstate`. `popstate` — только «назад» и «вперёд».",
      "Сервер SPA отдаёт `index.html` на любой путь, иначе обновление страницы даст 404.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const url = new URL("https://shop.ru/catalog?page=2&sort=price#top");
console.log(url.pathname, url.searchParams.get("page"), url.hash);
url.searchParams.set("page", "3");
url.searchParams.delete("sort");
url.searchParams.append("q", "a b");
console.log(url.search);
console.log(url.searchParams.get("missing"));`,
      opts: ["/catalog 2 #top\n?page=3&q=a+b\nnull", "catalog 2 top\n?page=3&q=a b\nundefined", "/catalog 2 #top\n?page=3&sort=price&q=a%20b\nnull", "/catalog ?page=2 #top\n?page=3&q=a+b\nnull"],
      a: 0,
      why: "`pathname` начинается со слеша, `hash` — с `#`. `URLSearchParams` кодирует пробел как `+`. Отсутствующий параметр — `null`, а не `undefined`.",
    },
    {
      type: "quiz",
      q: "Что произойдёт после `history.pushState({}, \"\", \"/about\")`?",
      opts: [
        "Адрес сменится и появится запись в истории, но страница не загрузится и `popstate` не сработает",
        "Браузер загрузит страницу `/about` с сервера",
        "Сработает `popstate`, и роутер нарисует страницу",
        "Адрес сменится только после перезагрузки",
      ],
      a: 0,
      why: "Отрисовка после `pushState` — задача самого роутера. `popstate` приходит только при движении по истории.",
    },
    {
      type: "run",
      goal: "Напиши `buildQuery(params)`: строка запроса из объекта без знака `?`. Параметры со значением `null` и `undefined` пропускаются, значения кодируются как в `URLSearchParams`.",
      code: `function buildQuery(params) {
  return Object.entries(params).map(([key, value]) => key + "=" + value).join("&");
}`,
      tests: [
        ["buildQuery({ q: \"a b\", page: 2, skip: undefined, empty: null })", "\"q=a+b&page=2\""],
        ["buildQuery({ tag: \"c&d\" })", "\"tag=c%26d\""],
        ["buildQuery({})", "\"\""],
      ],
      solution: `function buildQuery(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) search.append(key, String(value));
  }
  return search.toString();
}`,
      hint: "Создай `new URLSearchParams()` и добавляй пары через `append`, пропуская значения, для которых `value == null`. `toString()` вернёт закодированную строку.",
    },
  ],
};
