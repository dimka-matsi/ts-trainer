import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "pj7",
  region: 10,
  title: "paths, project references и triple-slash",
  q: "Как настроить алиасы импортов и разбить монорепозиторий на проекты? Что такое `/// <reference types=\"...\" />`?",
  answer: "`paths` задаёт алиасы вроде `@/*` → `./src/*`, но только для проверки типов: сборщику и тестам тот же алиас нужно указать отдельно, иначе код не запустится. В TypeScript 6 `baseUrl` устарел, пути пишут прямо в `paths`. Project references разбивают большой проект на части: у каждого пакета свой tsconfig с `composite: true`, а корень ссылается на них через `references`; `tsc --build` пересобирает только изменившиеся части и кэширует результат в `.tsbuildinfo`. Triple-slash директивы — старый способ подключить типы в файл: `/// <reference types=\"node\" />`; сейчас их почти не пишут, а список `types` задают в tsconfig — и в TypeScript 6 это обязательно, потому что по умолчанию `types` пуст.",
  theory: {
    p: [
      "`paths` в tsconfig: `\"paths\": { \"@/*\": [\"./src/*\"] }` — и можно писать `import { api } from \"@/shared/api\"`. Но TypeScript не переписывает импорты в JavaScript: алиас должен знать и тот, кто запускает код, — `resolve.alias` в Vite, `moduleNameMapper` в Jest, плагин vite-tsconfig-paths. Для Node лучше стандартные subpath imports `\"imports\": { \"#/*\": … }` в package.json — TypeScript 6 их поддерживает.",
      "Project references: монорепозиторий, где `packages/ui` зависит от `packages/utils`. У каждого пакета tsconfig с `composite: true` и `declaration: true`, а у зависимого — `\"references\": [{ \"path\": \"../utils\" }]`. `tsc -b` собирает пакеты в правильном порядке, пропускает неизменённые и хранит состояние в `.tsbuildinfo`. Редактор при этом открывает большие проекты быстрее.",
      "Triple-slash директивы — комментарии в начале файла: `/// <reference types=\"node\" />` подключает пакет `@types/node`, `/// <reference path=\"./globals.d.ts\" />` — другой файл, `/// <reference lib=\"es2022\" />` — библиотеку встроенных типов. Нужны в основном в `.d.ts` библиотек; в приложениях то же делают настройками `types`, `include` и `lib`.",
      "Изменение TypeScript 6: `types` по умолчанию пустой список, а не «все пакеты `@types`». Проект, где использовались `process` или `describe`, после обновления получит ошибки, пока не добавить `\"types\": [\"node\", \"vitest/globals\"]`. `baseUrl` устарел, `rootDir` по умолчанию — папка с tsconfig.",
    ],
    example: `// Алиасы в tsconfig.json работают для проверки, а в JavaScript импорт остаётся как есть.
// Поэтому в песочнице показываем, как выглядит результат: относительный путь до модуля.
// @filename: shared/api.ts
export function getUser(id: number) {
  return { id, name: "Аня" };
}
// @filename: pages/profile.ts
import { getUser } from "../shared/api";
const user = getUser(1);
const n: number = user.name;          // ошибка: name — строка`,
    keys: ["`paths` — алиасы только для проверки; сборщику и тестам алиас указывают отдельно. `baseUrl` в TS 6 устарел.", "Project references: `composite`, `references` и `tsc -b` — сборка монорепозитория по частям с кэшем.", "`/// <reference types>` почти не нужен: в TS 6 `types` по умолчанию пуст, список задают в tsconfig."],
  },
  tasks: [
    {
      type: "quiz",
      q: "В tsconfig добавили `paths` с алиасом `@/*`. Проверка типов проходит, а приложение падает с «Cannot find module '@/utils'». Почему?",
      opts: ["TypeScript не переписывает импорты: алиас нужно настроить и в сборщике или среде запуска", "`paths` работает только в `.d.ts`", "Нужно включить `strict`", "Алиасы запрещены в ES-модулях"],
      a: 0,
      why: "`paths` влияет только на то, как TypeScript ищет типы. В JavaScript остаётся строка `@/utils`.",
    },
    {
      type: "quiz",
      q: "После обновления до TypeScript 6 появились ошибки «Cannot find name 'process'». Что изменилось?",
      opts: ["`types` по умолчанию пуст — нужно явно добавить `\"types\": [\"node\"]`", "`process` удалён из Node", "`strict` выключился", "Нужно переустановить TypeScript"],
      a: 0,
      why: "Раньше TypeScript подключал все пакеты `@types` сам. Теперь их перечисляют явно — это быстрее и предсказуемее.",
    },
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для переменной `user`?",
      probe: "user",
      code: `// @filename: shared/api.ts
export function getUser(id: number) {
  return { id, name: "Аня" };
}
// @filename: pages/profile.ts
import { getUser } from "../shared/api";
const user = getUser(1);`,
      opts: ["{ id: number; name: string; }", "any", "User", "unknown"],
      a: 0,
      why: "Тип результата выведен в другом модуле и доступен через импорт по относительному пути.",
    },
  ],
};
