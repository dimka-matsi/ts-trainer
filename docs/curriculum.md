# TypeScript: учебный план по Handbook

Живая версия: документ «TypeScript: учебный план по Handbook» в Claude (https://claude.ai/code/artifact/e2b2f451-bbff-431d-a94a-81fb631ea4cd). Этот файл — его копия для репозитория на 24 сентября 2026. При расхождениях правь здесь и синхронизируй документ.

## Сверка с TypeScript Handbook

Каждый раздел документации привязан к уроку, уровню, теме плана на карте или помечен как пропущенный с причиной. Сама сверка лежит в `src/content/handbook.ts`, verify проверяет, что все ссылки существуют. На 25 сентября 2026: 131 раздел, 123 в уроках и уровнях, 1 закрыт карточкой (Types for Tooling — `ts-why`), 7 пропущено (обзорные страницы, туториалы по инструментам, синтаксис JavaScript, заметки к старым версиям). Все 11 регионов готовы: 98 уроков и 6 уровней.

При сверке 24.09.2026 добавлены уроки: присваивания и анализ потока (na), типы `object` и `Function` (fo), деструктуризация параметров (fd), классы в дженериках и аннотации `in`/`out` (g7). В план добавлены темы: ReadonlyArray, Symbol и `unique symbol`, итераторы и генераторы (регион 4); поля и `strictPropertyInitialization`, `override`, геттеры и `static`-блоки, тип `this` и this-guards, class expressions, mixins, ES-модули и CommonJS, namespaces, декораторы (регион 8); JSX (регион 10); декларации для библиотеки, JSDoc и проверка JS, triple-slash директивы (регион 11).

## Как пользоваться планом

План повторяет порядок [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) и раскладывает его на 11 регионов продукта: девять по Handbook, затем «TS и React» и «Компилятор и проект». Каждый регион — набор уроков, каждый урок закрывает одну тему и отвечает на конкретные вопросы с собеседования.

У каждой темы четыре поля:

- **Что знать** — суть в 1–2 фразах, то, что нужно уметь объяснить вслух.
- **Вопросы на собесе** — как тему спрашивают на самом деле.
- **Подвохи** — где путаются даже опытные разработчики.
- **Статус** — есть ли тема в продукте: готово, в работе или план.

Критерий из Handbook: читать типичный синтаксис, объяснять влияние важных флагов компилятора и правильно предсказывать поведение системы типов. Для собеседования добавляем четвёртый: уметь ответить вслух за 40–60 секунд.

## Карта: Handbook → регионы продукта

| # | Регион | Разделы Handbook | Статус |
| --- | --- | --- | --- |
| 1 | Основы | [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html), [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html) | Готово: 11 уроков |
| 2 | Болото союзов | [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | Готово: 6 уровней и 5 уроков |
| 3 | Функции | [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) | Готово: 11 уроков |
| 4 | Объекты | [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) | Готово: 10 уроков |
| 5 | Кузница дженериков | [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), [Keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html), [Typeof](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), [Indexed Access](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) | Готово: 7 уроков |
| 6 | Мастерская утилит | [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) | Готово: 8 уроков |
| 7 | Башня условий | [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) | Готово: 7 уроков |
| 8 | Классы и модули | [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html), [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html), [Enums](https://www.typescriptlang.org/docs/handbook/enums.html), [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html), [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) | Готово: 14 уроков |
| 9 | Контракты | [strict-флаги](https://www.typescriptlang.org/tsconfig/#strict), паттерны типизации API, branded types | Готово: 7 уроков |
| 10 | TS и React | [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) | Готово: 10 уроков |
| 11 | Компилятор и проект | [tsconfig](https://www.typescriptlang.org/tsconfig/), [Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html), [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html) | Готово: 8 уроков |

Utility Types стоят раньше Mapped и Conditional Types намеренно: утилитами пользуются каждый день, а их внутреннее устройство разбирается в регионе 7.

`.d.ts`, `declare` и module augmentation живут в регионе 8 рядом с модулями, флаги `strict` — в регионе 9, остальной tsconfig — в регионе 11.

## Регион 1. Основы — готово, 11 уроков

Порядок уроков выстроен так, чтобы каждый опирался только на предыдущие: union идёт раньше объектов, литералы раньше `type`/`interface`, `null` и совместимость раньше `as`. Проверяет `scripts/verify-order.ts`.

| # | Урок (id) | Что знать | Вопрос на собесе | Подвохи |
| --- | --- | --- | --- | --- |
| 1 | Статическая проверка (b1) | TypeScript проверяет код до запуска, при компиляции типы удаляются | Что делает TypeScript и чего он не делает во время работы программы? | `tsc` создаёт JS даже при ошибках без `noEmitOnError` |
| 2 | Примитивы, массивы, any (b2) | `string`, `number`, `boolean`, `T[]` = `Array<T>`; `noImplicitAny` | Чем опасен `any`? | `String` — другой тип; `[number]` — кортеж |
| 3 | Аннотации и вывод (b3) | Вывод из значения и `return`, контекстная типизация, `declare` в примерах | Когда писать типы явно? | У `async` результат `Promise<T>` |
| 4 | Union-типы (b5) | Без проверки доступно только общее для всех вариантов | Почему у union только общие свойства? | Тип результата зависит от описания функции, а не от аргумента |
| 5 | Объектные типы (b4) | `?` — необязательное свойство, при чтении `T \| undefined`; имя типа через `type` | `a?: T` против `a: T \| undefined` | `?.` и `!` — разные вещи |
| 6 | Литералы, as const, enum (b8) | `let` и поля объекта расширяют литералы, `as const` — нет | Почему `method` стал `string`? | `enum` остаётся в JS как объект |
| 7 | type и interface (b6) | `interface` сливается, `type` называет любой тип, `&` и `never` | Что выбрать и почему? | Конфликт полей в `&` даёт `never` |
| 8 | null и strictNullChecks (b9) | `null`/`undefined` видны в типе, `?.`, `??`, `!` | Что даёт `strictNullChecks`? | `\|\|` теряет `0`, `??` — нет |
| 9 | Совместимость типов (b10) | Структурная типизация, лишние поля в литерале, `unknown` | Что такое структурная типизация? | Лишнее поле ловится только у объекта, написанного на месте |
| 10 | Type assertions (b7) | `as` и `!` ничего не проверяют, branded types | Когда оправдан `as`? | `as unknown as T` — сигнал о неверных типах |
| 11 | `satisfies` (b11) | Проверяет значение как аннотация, но оставляет выведенный тип | Чем `satisfies` отличается от `: T` и `as T`? | Точный тип сохраняется, если в `T` union литералов |

## Регион 2. Болото союзов — готово: 6 уровней и 5 уроков

То, что не ложится на сортировщик, сделано уроками `na`, `n1`–`n4` в `lessons/narrowing/`. Они открываются из тем региона на карте.

| Подтема Handbook | Что знать | Вопрос на собесе | Уровень |
| --- | --- | --- | --- |
| `typeof` type guards | Сужает примитивы; `typeof null === "object"` | Какие способы сужения знаешь? | 1, 2 |
| Truthiness narrowing | `0`, `NaN`, `""`, `0n`, `null`, `undefined` — falsy | Чем опасен `if (!value)`? | 2 |
| Equality narrowing | `===`, `==` сужают; `x === y` оставляет общий тип | Как `== null` влияет на тип? | Урок n1 |
| Оператор `in` | Сужает по наличию свойства | Как отличить объекты без метки? | 3 |
| `instanceof` | Нужен класс, который есть в рантайме | Почему нельзя с интерфейсом? | 3, 5 |
| Assignments | Присваивание проверяется против объявленного типа | Почему после `x = 1` можно присвоить строку? | Урок na |
| Control flow analysis | Недостижимые ветки вычитаются из типа | Что такое control flow analysis? | 1, урок na |
| Type predicates | `x is T`, TS доверяет телу | В чём риск `x is T`? | Урок n2 |
| Assertion functions | `asserts x is T` сужает после вызова | Чем отличается от type guard? | Урок n3 |
| Discriminated unions | Общее поле с литеральными типами | Зачем они нужны? | 4 |
| `never` и exhaustiveness | Присваивание в `never` в `default` | Как не забыть новый вариант? | 4 |
| Состояния loading / success / error | Discriminated union вместо набора флагов `isLoading`, `data`, `error` | Как исключить «данные без успеха»? | Урок n4 |

Уровень 6 «Граница» дополнительно покрывает сужение `unknown` для данных из сети.

## Регион 3. Функции — готово, 11 уроков

Источник: [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html). Урок «Дженерик-функции» даёт основы (`<T>`, вывод, `extends`), регион 5 разбирает дженерики глубже.

| # | Урок | Что знать | Вопрос на собесе | Подвохи |
| --- | --- | --- | --- | --- |
| 1 | Сигнатуры функций | Стрелка, call signature `{ (x): R; prop }`, construct signature `new () => T` | Как описать функцию со свойством? | Функция с меньшим числом параметров совместима |
| 2 | Необязательные параметры и значения по умолчанию | `x?` даёт `T \| undefined` внутри, `x = v` — `T` | Чем `x?: number` отличается от `x = 0`? | `x: T \| undefined` без `?` обязателен |
| 3 | Дженерик-функции (fg) | Параметр типа связывает вход и выход, выводится из аргументов, `extends` ограничивает | Зачем дженерик-функции? | Параметр типа, который встречается один раз, лишний |
| 4 | Перегрузки | Снаружи видны только перегрузки, проверка сверху вниз | Union или перегрузки? | Union-аргумент не проходит через перегрузки |
| 5 | `this` в функциях | Псевдо-параметр `this: T`, стрелки берут `this` снаружи, тип `this` в методах | Как типизировать `this`? | Передачу метода как колбэка TS не проверяет, только вызов |
| 6 | `void`, `never` и колбэки | `() => void` принимает функции с результатом | Почему `forEach(x => arr.push(x))` компилируется? | Стрелка, которая только бросает, — `never`, объявление `function` — `void` |
| 6а | Типы `object` и `Function` (fo) | `object` — не-примитивы, вызов `Function` даёт `any` | Чем `Function` хуже `() => void`? | Вместо `Function` — сигнатура или дженерик |
| 6б | Деструктуризация параметров (fd) | Тип после всего шаблона, значения по умолчанию в шаблоне | Как типизировать `({ a, b })`? | `{ a: number }` внутри шаблона — переименование |
| 7 | `async` и `Promise<T>` | Результат всегда `Promise<T>`, `Promise.all` сохраняет кортеж | Как типизировать ошибку промиса? | В `catch` — `unknown`, забытый `await` |
| 8 | Rest-параметры и кортежи | Spread требует известной длины, `...args: A` пробрасывает аргументы | Почему `Math.atan2(...args)` падает без `as const`? | `number[]` не подходит для фиксированного числа параметров |
| 9 | Ковариантность и контравариантность | Результат ковариантен, параметры контравариантны под `strictFunctionTypes` | Почему параметры методов бивариантны? | Метод-сигнатура проверяется слабее свойства-функции |

## Регион 4. Объекты — готово, 10 уроков

Уроки: `Object`, `{}` и `object` (ob1), `readonly` и `const` (ob2), index signatures (ob3), лишние свойства и слабые типы (ob4), `extends` против `&` (ob5), дженерик-объектные типы (ob6), кортежи и variadic tuples (ob7), `ReadonlyArray` (ob8), `Symbol` и `unique symbol` (ob9), итераторы и генераторы (ob10).

Источник: [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| `Object`, `{}` и `object` | `{}` и `Object` принимают всё, кроме `null`/`undefined`; `object` — только не-примитивы | Чем отличаются? |
| Модификаторы свойств | `?`, `readonly` (не глубокий), index signatures | Защищает ли `readonly` вложенные объекты? Чем `readonly` отличается от `const`? |
| Excess property checks | Только для свежих литералов | Как обойти и почему не стоит? |
| `extends` и `&` | Поведение при конфликте полей | Чем отличаются? |
| Generic object types | `Box<T>` | Зачем дженерик-интерфейсы? |
| `ReadonlyArray` | `readonly T[]` | Как запретить мутацию массива в пропсах? |
| Кортежи | Опциональные и rest-элементы, `readonly`, имена, variadic `[...T, U]` | Чем кортеж отличается от массива? |

## Регион 5. Кузница дженериков — готово, 7 уроков

Основы (`<T>`, вывод из аргументов, `extends`) даёт урок «Дженерик-функции» в регионе 3. Здесь — то, на чём держатся утилиты.

| # | Урок (id) | Что знать | Вопрос на собесе | Подвохи |
| --- | --- | --- | --- | --- |
| 1 | keyof и тип поля T[K] (g1) | `keyof T` — union имён, `T["k"]` — тип поля, `T[number]` — тип элемента | Что делают `keyof` и `T["name"]`? | Union имён в скобках даёт union типов |
| 2 | Параметр-ключ (g2) | `K extends keyof T`, результат `T[K]` | Как типизировать `getValue(obj, key)`? | С `key: keyof T` результат — union всех полей |
| 3 | typeof в позиции типа (g3) | Тип из значения, `(typeof ARR)[number]` | Как получить тип из значения? | Без `as const` значения расширяются |
| 4 | Параметры по умолчанию (g4) | `<T, E = Error>`, вывод нескольких параметров | Зачем значение по умолчанию у параметра типа? | Указать явно только часть параметров нельзя |
| 5 | Дженерик-интерфейсы и классы (g5) | `class C<K, V>`, ограничения параметров класса | Как типизировать дженерик-кэш? | Статика не видит параметры класса |
| 6 | const у параметра типа (g6) | `<const T>` выводит как `as const` (TS 5.0) | Что даёт `<const T>`? | Для массивов ограничение `readonly ...[]` |
| 7 | Классы в дженериках и in/out (g7) | `create<T>(C: new () => T)`, аннотации вариантности (TS 4.7) | Зачем `in` и `out`? | Параметр-метод проверяется в обе стороны, аннотацию проверяют на свойстве-функции |

## Регион 7. Башня условий — готово, 7 уроков

Уроки: conditional types (tc1), дистрибутивность и `IsNever` (tc2), `infer` с ограничениями и `UnionToIntersection` (tc3), mapped types и переименование ключей (tc4), template literal types и параметры маршрута (tc5), рекурсивные типы: JSON, `DeepReadonly`, пути (tc6), задачи с собеседований: `TupleToUnion`, `Last`, типизированный EventEmitter (tc7).

| Регион | Тема | Что знать | Вопрос или задача |
| --- | --- | --- | --- |
| 5 | Generics | Связь входа и выхода, constraints, дефолты, `const` type parameters, `NoInfer` | Типизируй `getValue<T, K extends keyof T>(obj, key)` |
| 5 | Несколько параметров и дефолты | `<T, E = Error>`, вывод нескольких параметров | Зачем дефолт у параметра типа? |
| 5 | Дженерик-классы и интерфейсы | `class Cache<K, V>`, `interface Repo<T>` | Типизируй дженерик-репозиторий |
| 5 | keyof | Для `[k: string]` даёт `string \| number` | Почему? |
| 5 | typeof | Тип из значения | Тип из объекта-константы |
| 5 | Indexed Access | `T[K]`, `T[number]` | Union элементов кортежа |
| 7 | Conditional Types | `extends ? :`, `infer`, дистрибутивность, `[T] extends [U]` | Почему `IsNever<never>` = `never`? |
| 7 | Mapped Types | Модификаторы, key remapping через `as` | Напиши `MyOmit` без `Omit` |
| 7 | Template Literal Types | `infer` в шаблоне, intrinsic-утилиты | Вытащи `:id` из маршрута |
| 7 | Рекурсивные типы | Рекурсивные алиасы и conditional types, лимит глубины | Опиши тип JSON-значения |

Лайв-кодинг: `DeepReadonly`, `DeepPartial`, `TupleToUnion`, `UnionToIntersection`, `ElementType<T>` через `infer`, типизированный `get(obj, 'a.b.c')`, типобезопасный EventEmitter, имена обработчиков `onThemeChanged` из ключей настроек.

## Регион 6. Utility Types — готово

Порядок уроков: `Partial`/`Required`/`Readonly` (там же объясняются `keyof`, `T[K]` и mapped types), `Record`, `Exclude`/`Extract` (conditional types), `Pick`/`Omit`, `ReturnType` (`infer`, `typeof` в позиции типа), `Awaited`/`NoInfer`, утилиты для `this`, строковые утилиты.

22 утилиты из [справочника](https://www.typescriptlang.org/docs/handbook/utility-types.html), 8 уроков. Определения сверены с `lib.es5.d.ts` TypeScript 5.9.3.

| Урок | Утилита | С версии | Как устроено |
| --- | --- | --- | --- |
| 1 | `Partial<T>` | 2.1 | `{ [K in keyof T]?: T[K] }` |
| 1 | `Required<T>` | 2.8 | `{ [K in keyof T]-?: T[K] }` |
| 1 | `Readonly<T>` | 2.1 | `{ readonly [K in keyof T]: T[K] }` |
| 2 | `Record<K, T>` | 2.1 | `{ [P in K]: T }`, `K extends keyof any` |
| 3 | `Pick<T, K>` | 2.1 | `{ [P in K]: T[P] }`, `K extends keyof T` |
| 3 | `Omit<T, K>` | 3.5 | `Pick<T, Exclude<keyof T, K>>`, `K extends keyof any` |
| 4 | `Exclude<U, E>` | 2.8 | `U extends E ? never : U` |
| 4 | `Extract<T, U>` | 2.8 | `T extends U ? T : never` |
| 4 | `NonNullable<T>` | 2.8 | `T & {}` |
| 5 | `Parameters<F>` | 3.1 | `infer P` в параметрах |
| 5 | `ReturnType<F>` | 2.8 | `infer R` в результате |
| 5 | `ConstructorParameters<C>` | 3.1 | `infer P` в `abstract new` |
| 5 | `InstanceType<C>` | 2.8 | `infer R` в `abstract new` |
| 6 | `Awaited<T>` | 4.5 | Рекурсия по методу `then` |
| 6 | `NoInfer<T>` | 5.4 | intrinsic |
| 7 | `ThisParameterType<F>` | 3.3 | `infer U` в `this: infer U` |
| 7 | `OmitThisParameter<F>` | 3.3 | Conditional + `infer` |
| 7 | `ThisType<T>` | 2.3 | Пустой маркерный интерфейс |
| 8 | `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize` | 4.1 (по памяти) | intrinsic |

## Регион 8. Классы и модули — готово, 14 уроков

Уроки: поля и parameter properties (cl1), `implements` и `extends` (cl2), `override` и порядок инициализации (cl3), `private` против `#field` (cl4), абстрактные классы и construct signatures (cl5), геттеры, сеттеры и `static` (cl6), тип `this` и this-guards (cl7), миксины (cl8), `enum` против объекта `as const` (cl9), модули и `import type` (cl10), `.d.ts` и `declare` (cl11), declaration merging и расширение модулей (cl12), namespaces (cl13), декораторы (cl14).

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Поля и конструкторы | `strictPropertyInitialization`, parameter properties | Что делает `constructor(private x: number)`? |
| `implements` и `extends` | `implements` только проверяет форму | Чем отличаются? |
| `private`, `protected` и `#private` | TS-модификаторы стираются, `#` работает в рантайме | В чём разница? |
| `static`, геттеры и сеттеры | Статические члены не видят параметры типа класса | Где встречал? |
| `abstract`, `this`-типы | `this is T` в методах | Абстрактный класс или интерфейс? |
| Модули | `import type` | Зачем `import type`? |
| Enums | Reverse mapping, `const enum` | Почему выбирают union + `as const`? |
| `.d.ts`, `declare`, `@types` | Ambient-декларации описывают то, что уже есть в рантайме | Как типизировать JS-библиотеку без типов? |
| Declaration merging | Module augmentation, `declare global` | Как расширить тип библиотеки? |
| `namespace` | Знать концепцию, в новом коде не использовать | Чем отличается от модуля? |
| Decorators | Экспериментальные и стандартные (5.0+) | Где встречал? |

## Регион 9. Контракты — готово, 7 уроков

Уроки: данные из сети как `unknown` (ct1), схема как единственный источник правды (ct2), `unknown` в `catch` (ct3), что включает `strict` (ct4), флаги сверх `strict` (ct5), branded types и умные конструкторы (ct6), `Result` вместо исключений (ct7).

Темы: type guards и `asserts` для данных из сети, флаги `strict`, `unknown` в `catch`, ответ API без `any` (валидация в рантайме), branded types.

| Флаг | В `strict` | Что делает |
| --- | --- | --- |
| `noImplicitAny` | Да | Ошибка на неявный `any` |
| `strictNullChecks` | Да | `null`/`undefined` — отдельные типы |
| `strictFunctionTypes` | Да | Контравариантность параметров (кроме методов) |
| `strictBindCallApply` | Да | Типизация `bind`/`call`/`apply` |
| `strictPropertyInitialization` | Да | Инициализация полей класса |
| `strictBuiltinIteratorReturn` | Да | `TReturn` встроенных итераторов — `undefined`, а не `any` |
| `noImplicitThis` | Да | Ошибка на `this: any` |
| `useUnknownInCatchVariables` | Да | `catch (e)` даёт `unknown` |
| `alwaysStrict` | Да | `"use strict"` |
| `noUncheckedIndexedAccess` | Нет | `arr[i]` → `T \| undefined` |
| `exactOptionalPropertyTypes` | Нет | `a?: T` не принимает явный `undefined` |
| `noImplicitOverride` | Нет | Требует `override` |
| `isolatedModules`, `verbatimModuleSyntax` | Нет | Поштучная компиляция, `import type` |

Состав `strict` сверен с опциями компилятора TypeScript 5.9.3; для TS 6 сверить с [заметками к TS 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html).

## Регион 10. TS и React — готово, 10 уроков

Уроки: JSX в `.tsx` и `React.JSX` (tr1), пропсы и `children` (tr2), события (tr3), `useState` и `useReducer` (tr4), `useRef` в React 19 (tr5), контекст без `undefined` (tr6), взаимоисключающие пропсы (tr7), дженерик-компоненты (tr8), `ComponentProps` и `ref` (tr9), полиморфный `as` (tr10). Код проверяется настоящими типами `@types/react` 19.

В roadmap Middle/Senior это Must know, поэтому регион идёт в порядке работ сразу после дженериков.

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Пропсы и `children` | `ReactNode` шире `ReactElement`, `JSX.Element` — результат JSX | Какой тип у `children`? |
| События | `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent`, `KeyboardEvent` | Как типизировать `onChange`? |
| `useState`, `useReducer` | Discriminated union для `action` | Как сузить `action` по `type`? |
| `useRef` | Ref на DOM с `null` против изменяемого значения | Почему `ref.current` иногда readonly? |
| `useContext` | Контекст без `undefined` через свой хук с проверкой | Как не проверять контекст в каждом компоненте? |
| Взаимоисключающие пропсы | Union с `never`-полями | Как запретить `href` вместе с `onClick`? |
| Дженерик-компоненты и хуки | `<T,>` в `.tsx`, вывод из пропсов | Напиши `Select<T>` и `useFetch<T>` |
| `ComponentProps`, `ref` | `ComponentProps<"button">`, `forwardRef` и `ref` как проп | Как сделать обёртку над `button`? |
| Полиморфный `as`-prop, HOC, render props | `ElementType`, `ComponentPropsWithoutRef<C>` | Как типизировать `<Box as="a">`? |

## Регион 11. Компилятор и проект — готово, 8 уроков

Уроки: `tsc` против Babel, esbuild и SWC и TypeScript 7 (pj1), запуск `.ts` в Node и `erasableSyntaxOnly` (pj2), `target` и `lib` (pj3), `module`, `moduleResolution` и импорт CommonJS (pj4), библиотеки с типами и `skipLibCheck` (pj5), JSDoc, `checkJs` и миграция (pj6), `paths`, project references и triple-slash (pj7), разбор tsconfig и TypeScript 6 (pj8). Версии Node и TypeScript сверены с официальными заметками к релизам 25.09.2026.

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Компиляция и транспиляция | `tsc` проверяет типы, Babel, SWC и esbuild только стирают их | Чем `tsc` отличается от Babel? |
| `isolatedModules`, `verbatimModuleSyntax` | Каждый файл компилируется отдельно, нужен `import type` | Зачем эти флаги при сборке через SWC? |
| Type stripping | Node запускает `.ts`, просто стирая типы; `erasableSyntaxOnly` запрещает `enum`, `namespace` и parameter properties | Что нельзя писать, если код запускается через type stripping? |
| `target`, `module`, `moduleResolution`, `lib`, `jsx` | Во что компилировать и как искать модули | Чем `target` отличается от `lib`? |
| `esModuleInterop` | Импорт CommonJS как default | Что будет без него? |
| `skipLibCheck`, `declaration`, `sourceMap`, `noEmit`, `incremental` | Скорость, `.d.ts` для библиотек, отладка | Когда включать `skipLibCheck`? |
| `paths`, project references | Алиасы и разбиение на проекты | Как ускорить проверку монорепы? |
| Разбор tsconfig | Объяснить каждую опцию своего проекта | Расскажи про tsconfig своего проекта |

Версии Node для type stripping и состояние TypeScript 7 (нативный компилятор) сверять с официальными заметками к релизам, а не по памяти.

## Механики упражнений

| Механика | Как выглядит | Навык | Где |
| --- | --- | --- | --- |
| Сортировщик | Условия в `if`, значения катятся по веткам | Понимание сужения | Регион 2 |
| Предскажи тип | Код и 4 варианта; после ответа показывается тип от компилятора | Предсказывать систему типов | Все уроки |
| Почини код | Ошибки компиляции, убрать без `any` и `as` | Читать ошибки TS | Регионы 1, 9 |
| Напиши тип | Скрытые тесты `Expect<Equal<...>>` | Лайв-кодинг | Регионы 5–7, утилиты |

| Итоговый экзамен | 12 случайных вопросов региона, одна попытка, разбор ошибок, порог 80% | Проверить регион целиком | Готовые регионы |
| Флеш-карточки | Вопрос → ответ вслух → сверка с образцом, «знал» убирает карточку из колоды | Отвечать на собесе за минуту | Все регионы, 112 карточек |

Урок: теория с примером → песочница → 2–4 упражнения → вопрос для ответа вслух. Регион заканчивается итоговым экзаменом. Карточки есть и для регионов «скоро»: по ним можно готовиться до появления уроков.

## Что спрашивают на собеседованиях

Сверка на 24 сентября 2026: roadmap «TypeScript — полная теория для Middle/Senior Frontend», [GreatFrontEnd: TypeScript Interview Questions for Senior Developers](https://www.greatfrontend.com/blog/typescript-interview-questions-for-senior-frontend-developers), [45 TypeScript interview questions](https://listiak.dev/blog/the-45-typescript-interview-questions-interview-cheat-sheet-i-wish-i-had), [ENIGMA AI: вопросы по TypeScript](https://enigmai.ru/prep/tech/typescript/).

На senior-собеседовании меньше спрашивают определения и больше просят смоделировать задачу типами: состояние запроса, взаимоисключающие пропсы, карта вариантов через `satisfies`, безопасная граница с сетью.

| Частый вопрос | Где в плане |
| --- | --- |
| `type` против `interface`, `any` против `unknown`, `never` | Регион 1 |
| `satisfies`, `as const`, `enum` против union | Регион 1 |
| Что остаётся от типов в рантайме, как браузер исполняет TS | Регионы 1, 11 |
| Состояние loading / success / error | Регион 2 |
| Type guards, `x is T`, `asserts` | Регионы 2, 9 |
| `getValue<T, K extends keyof T>`, дефолты дженериков | Регион 5 |
| Свои `Partial`, `Pick`, `Omit`, `Record` | Регион 6 |
| `infer`, `ElementType<T>`, распаковка промиса | Регионы 6, 7 |
| Имена событий через template literal и mapped types | Регион 7 |
| Ковариантность и контравариантность | Регион 3 |
| `readonly` против `const`, `Object`/`{}`/`object` | Регион 4 |
| `private` против `#field`, `.d.ts`, `declare`, `import type` | Регион 8 |
| Сервер вернул не ту форму, `unknown` в `catch`, branded types | Регион 9 |
| Взаимоисключающие пропсы, дженерик-компоненты, события, хуки | Регион 10 |
| tsconfig, `tsc` против Babel и SWC | Регион 11 |

## Порядок дальше

Все регионы готовы (25 сентября 2026). Дальше — поддерживать актуальность: сверять новые версии TypeScript (сейчас в песочнице 5.9, вышли 6.0 и 7.0) и разделы Handbook, добавлять задачи с собеседований.

- [x] Регион 1: урок `satisfies`
- [x] Регион 2: equality narrowing, type predicates, assertion functions, состояния loading / success / error
- [x] Регион 5: Generics, `keyof`, `typeof`, indexed access
- [x] Регион 10: TS и React
- [x] Регион 7: conditional, mapped, template literal, рекурсивные типы и задачи для лайв-кодинга
- [x] Регион 3: функции
- [x] Регион 4: объекты
- [x] Регион 9: guards, `strict`, API без `any`, branded types
- [x] Регион 11: компилятор и tsconfig
- [x] Регион 8: классы и модули
