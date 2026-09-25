import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "arr6",
  region: 4,
  title: "Intl: сортировка строк, числа и множественное число",
  q: "Как правильно отсортировать строки на русском, отформатировать число и выбрать форму слова: «1 файл, 2 файла, 5 файлов»?",
  answer:
    "Для всего, что зависит от языка, есть встроенный `Intl`. Строки сортируют через `localeCompare` или `Intl.Collator`: обычный `sort()` сравнивает коды символов, и `ё` окажется после `я`, а «файл10» перед «файл2». Числа, деньги и проценты форматирует `Intl.NumberFormat`, даты — `Intl.DateTimeFormat`, относительное время — `Intl.RelativeTimeFormat`. Форму слова выбирает `Intl.PluralRules(\"ru\")`: он говорит, к какой категории относится число — `one`, `few` или `many`.",
  theory: {
    p: [
      "`arr.sort()` без функции сравнивает коды символов. Для русского это плохо: `ё` идёт после `я`, заглавные раньше строчных. `a.localeCompare(b, \"ru\")` сравнивает по правилам языка. Если сортировать много, быстрее один раз создать `const collator = new Intl.Collator(\"ru\", { numeric: true })` и передать `collator.compare`. Опция `numeric` сравнивает числа внутри строк как числа: «файл2» раньше «файл10».",
      "`Intl.NumberFormat(\"ru-RU\", { style: \"currency\", currency: \"RUB\" }).format(1234.5)` даст «1 234,50 ₽» — с пробелом-разделителем разрядов и запятой. Есть стили `percent` и `unit`, компактная запись («1,2 тыс.»). Внимание: разделители — неразрывные пробелы, поэтому в тестах такие строки сравнивают аккуратно.",
      "`Intl.DateTimeFormat` форматирует дату по языку и часовому поясу, `Intl.RelativeTimeFormat` пишет «3 дня назад». `Intl.PluralRules(\"ru\").select(n)` возвращает категорию числа: `one` (1, 21, 101), `few` (2–4, 22–24), `many` (0, 5–20, 11–14) и `other` для дробных. По ней выбирают форму слова — самописное `n % 10 === 1` легко ошибается на 11.",
      "Всё это встроено в браузеры и Node.js, без библиотек. Объекты `Intl` дорогие в создании, поэтому их создают один раз и переиспользуют, а не в каждой итерации цикла.",
    ],
    code: `const words = ["ёж", "яблоко", "Арбуз", "арка"];
console.log([...words].sort());                              // по кодам: ё в конце
console.log([...words].sort((a, b) => a.localeCompare(b, "ru")));

const files = ["файл10", "файл2", "файл1"];
const collator = new Intl.Collator("ru", { numeric: true });
console.log(files.sort(collator.compare));                   // [файл1, файл2, файл10]

const rules = new Intl.PluralRules("ru");
console.log([1, 2, 5, 11, 21, 22].map((n) => n + ":" + rules.select(n)).join(" "));

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" });
console.log(money.format(1234.5));                           // 1 234,50 ₽`,
    keys: [
      "Строки по-русски сортируют `localeCompare` или `Intl.Collator`, `numeric: true` — числа внутри строк как числа.",
      "`Intl.NumberFormat` и `Intl.DateTimeFormat` форматируют по языку, разделители — неразрывные пробелы.",
      "`Intl.PluralRules(\"ru\")` даёт категорию `one`, `few`, `many` для выбора формы слова. Объекты `Intl` создают один раз.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      output: true,
      q: "Что выведет этот код?",
      code: `const files = ["файл10", "файл2", "файл1"];
console.log([...files].sort().join(" "));
const collator = new Intl.Collator("ru", { numeric: true });
console.log([...files].sort(collator.compare).join(" "));
console.log(["я", "ё", "а"].sort().join(""), ["я", "ё", "а"].sort((a, b) => a.localeCompare(b, "ru")).join(""));`,
      opts: ["файл1 файл10 файл2\nфайл1 файл2 файл10\nаяё аёя", "файл1 файл2 файл10\nфайл1 файл2 файл10\nаёя аёя", "файл10 файл2 файл1\nфайл1 файл2 файл10\nаяё аяё", "файл1 файл10 файл2\nфайл1 файл10 файл2\nаёя аёя"],
      a: 0,
      why: "Обычная сортировка сравнивает символы: `\"1\"` из «10» меньше `\"2\"`, а код буквы `ё` больше кода `я`. `numeric: true` сравнивает числа как числа, `localeCompare` ставит `ё` после `е`.",
    },
    {
      type: "quiz",
      q: "Почему `n % 10 === 1 ? \"файл\" : \"файлов\"` — плохой способ выбрать форму слова?",
      opts: [
        "Для 11 получится «11 файл», и нет формы «файла» для 2–4. Правильно — `Intl.PluralRules(\"ru\")`",
        "Оператор `%` не работает с большими числами",
        "Так нельзя писать в строгом режиме",
        "Способ правильный, `Intl` нужен только для дат",
      ],
      a: 0,
      why: "В русском три формы для целых чисел и исключения 11–14. `PluralRules` знает правила языка и не ошибается.",
    },
    {
      type: "run",
      goal: "Напиши `pluralize(n, forms)`: `forms` — три формы слова `[\"файл\", \"файла\", \"файлов\"]`. Верни строку вида `\"3 файла\"` с правильной формой по правилам русского языка.",
      code: `function pluralize(n, forms) {
  return n + " " + (n === 1 ? forms[0] : forms[2]);
}`,
      tests: [
        ["pluralize(1, [\"файл\", \"файла\", \"файлов\"])", "\"1 файл\""],
        ["pluralize(3, [\"файл\", \"файла\", \"файлов\"])", "\"3 файла\""],
        ["pluralize(11, [\"файл\", \"файла\", \"файлов\"])", "\"11 файлов\""],
        ["pluralize(21, [\"файл\", \"файла\", \"файлов\"])", "\"21 файл\""],
        ["pluralize(22, [\"файл\", \"файла\", \"файлов\"])", "\"22 файла\""],
        ["pluralize(0, [\"файл\", \"файла\", \"файлов\"])", "\"0 файлов\""],
      ],
      solution: `const rules = new Intl.PluralRules("ru");
const INDEX = { one: 0, few: 1, many: 2, other: 1 };

function pluralize(n, forms) {
  return n + " " + forms[INDEX[rules.select(n)]];
}`,
      hint: "Создай один раз `new Intl.PluralRules(\"ru\")` и сопоставь категории `one`, `few`, `many` индексам форм 0, 1, 2.",
    },
  ],
};
