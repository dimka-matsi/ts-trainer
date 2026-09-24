export const ACHIEVEMENTS = [
  { id: "falsy", t: "Нашёл ловушку", d: 'Запустил `!value` и увидел, куда уходят "" и 0.' },
  { id: "typeofnull", t: "typeof null", d: 'Поймал `null` через `typeof value === "object"`.' },
  { id: "exhaustive", t: "Ничего не забыл", d: "Прошёл уровень с `assertNever`." },
  { id: "any", t: "any пробрался", d: "Увидел, как `Array.isArray` выключает проверки." },
  { id: "guard", t: "Страж границы", d: "Провёл `unknown` через все проверки." },
  { id: "clean", t: "Чистая работа", d: "Прошёл уровень на три звезды." },
  { id: "all", t: "Болото пройдено", d: "Все шесть уровней «Болота союзов»." },
  { id: "firsttype", t: "Первый тип", d: "Решил первое упражнение «Напиши тип»." },
  { id: "basics", t: "Фундамент", d: "Прошёл все уроки региона «Основы»." },
  { id: "utils", t: "Мастер утилит", d: "Прошёл все уроки «Мастерской утилит»." },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];
