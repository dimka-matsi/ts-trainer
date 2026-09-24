# TypeScript: учебный план по Handbook

Живая версия: документ «TypeScript: учебный план по Handbook» в Claude (https://claude.ai/code/artifact/e2b2f451-bbff-431d-a94a-81fb631ea4cd). Этот файл — его копия для репозитория на 24 сентября 2026. При расхождениях правь здесь и синхронизируй документ.

## Как пользоваться планом

План повторяет порядок [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) и раскладывает его на 9 регионов продукта. Каждый регион — набор уроков, каждый урок закрывает одну тему и отвечает на конкретные вопросы с собеседования.

У каждой темы четыре поля:

- **Что знать** — суть в 1–2 фразах, то, что нужно уметь объяснить вслух.
- **Вопросы на собесе** — как тему спрашивают на самом деле.
- **Подвохи** — где путаются даже опытные разработчики.
- **Статус** — есть ли тема в продукте: готово, в работе или план.

Критерий из Handbook: читать типичный синтаксис, объяснять влияние важных флагов компилятора и правильно предсказывать поведение системы типов. Для собеседования добавляем четвёртый: уметь ответить вслух за 40–60 секунд.

## Карта: Handbook → регионы продукта

| # | Регион | Разделы Handbook | Статус |
| --- | --- | --- | --- |
| 1 | Основы | [The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html), [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) | Готово: 10 уроков |
| 2 | Болото союзов | [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | Готово: 6 уровней |
| 3 | Функции | [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) | План |
| 4 | Объекты | [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html) | План |
| 5 | Кузница дженериков | [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), [Keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html), [Typeof](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), [Indexed Access](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html) | План |
| 6 | Мастерская утилит | [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) | Готово: 8 уроков |
| 7 | Башня условий | [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html) | План |
| 8 | Классы и модули | [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html), [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html), [Enums](https://www.typescriptlang.org/docs/handbook/enums.html), [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html), [Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) | План |
| 9 | Контракты | [tsconfig](https://www.typescriptlang.org/tsconfig/), [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html), паттерны типизации API | План |

Utility Types стоят раньше Mapped и Conditional Types намеренно: утилитами пользуются каждый день, а их внутреннее устройство разбирается в регионе 7.

## Регион 1. Основы — готово

| # | Урок | Что знать | Вопрос на собесе | Подвохи |
| --- | --- | --- | --- | --- |
| 1 | Статическая проверка | TS проверяет код до запуска и стирает типы при компиляции | Что делает TypeScript и чего он не делает в рантайме? | Типов нет в рантайме, `tsc` эмитит JS даже с ошибками |
| 2 | Примитивы, массивы, any | `string`, `number`, `boolean`, `T[]` = `Array<T>`; `noImplicitAny` | Чем опасен `any`? | `String` — другой тип; `[number]` — кортеж |
| 3 | Аннотации и вывод | Вывод из инициализатора и `return`, contextual typing | Когда писать аннотации? | Аннотация расширяет тип; `async` → `Promise<T>` |
| 4 | Объектные типы | `?` — опциональное свойство, при чтении `T \| undefined` | `a?: T` против `a: T \| undefined` | `?.` и `!` — разные вещи |
| 5 | Union-типы | Разрешены только общие для всех членов операции | Почему у union «пересечение» свойств? | Без сужения нельзя вызвать метод одного члена |
| 6 | type и interface | `interface` сливается, `type` умеет union, mapped, conditional | Что выбрать и почему? | Неявная index signature у `type`; конфликт в `&` даёт `never` |
| 7 | Type assertions | `as` и `!` стираются без проверки | Когда оправдан `as`? | `as unknown as T` — красный флаг |
| 8 | Литералы, as const, enum | `let` и свойства расширяют литералы, `as const` — нет | Почему `req.method` стал `string`? | `enum` добавляет рантайм-код |
| 9 | null и strictNullChecks | `null`/`undefined` — отдельные типы | Что даёт `strictNullChecks`? | `\|\|` теряет `0`, `??` — нет |
| 10 | Совместимость типов | Структурная типизация, excess property checking, `unknown`/`never` | Что такое структурная типизация? | Нужны branded types для номинальности |

## Регион 2. Болото союзов — готово, 4 подтемы добавить

| Подтема Handbook | Что знать | Вопрос на собесе | Уровень |
| --- | --- | --- | --- |
| `typeof` type guards | Сужает примитивы; `typeof null === "object"` | Какие способы сужения знаешь? | 1, 2 |
| Truthiness narrowing | `0`, `NaN`, `""`, `0n`, `null`, `undefined` — falsy | Чем опасен `if (!value)`? | 2 |
| Equality narrowing | `===`, `==` сужают; `x === y` оставляет общий тип | Как `== null` влияет на тип? | Добавить |
| Оператор `in` | Сужает по наличию свойства | Как отличить объекты без метки? | 3 |
| `instanceof` | Нужен класс, который есть в рантайме | Почему нельзя с интерфейсом? | 3, 5 |
| Assignments | Присваивание проверяется против объявленного типа | Почему после `x = 1` можно присвоить строку? | Добавить |
| Control flow analysis | Недостижимые ветки вычитаются из типа | Что такое control flow analysis? | 1 |
| Type predicates | `x is T`, TS доверяет телу | В чём риск `x is T`? | Добавить |
| Assertion functions | `asserts x is T` сужает после вызова | Чем отличается от type guard? | Добавить |
| Discriminated unions | Общее поле с литеральными типами | Зачем они нужны? | 4 |
| `never` и exhaustiveness | Присваивание в `never` в `default` | Как не забыть новый вариант? | 4 |

Уровень 6 «Граница» дополнительно покрывает сужение `unknown` для данных из сети.

## Регион 3. Функции — план

Источник: [More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html).

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Function type expressions, call signatures | Call signature в объектном типе даёт функцию со свойствами | Как описать функцию со свойством? |
| Construct signatures | `new (s: string) => T` | Как типизировать фабрику классов? |
| Generic functions | Вывод, constraints, явный `<T>` | Когда дженерик лишний? |
| Опциональные параметры | В колбэках опциональность почти не нужна | Почему? |
| Перегрузки | Сигнатура реализации снаружи не видна | Union или перегрузки? |
| `this` в функциях | Псевдо-параметр `this: T` | Как типизировать `this`? |
| `void`, `object`, `unknown`, `never`, `Function` | Возврат `void` в типе функции разрешает возвращать значение | Почему `forEach(x => arr.push(x))` компилируется? |
| Rest-параметры | Spread требует кортежа | Почему `Math.atan2(...args)` падает без `as const`? |

## Регион 4. Объекты — план

Источник: [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Модификаторы свойств | `?`, `readonly` (не глубокий), index signatures | Защищает ли `readonly` вложенные объекты? |
| Excess property checks | Только для свежих литералов | Как обойти и почему не стоит? |
| `extends` и `&` | Поведение при конфликте полей | Чем отличаются? |
| Generic object types | `Box<T>` | Зачем дженерик-интерфейсы? |
| `ReadonlyArray` | `readonly T[]` | Как запретить мутацию массива в пропсах? |
| Кортежи | Опциональные и rest-элементы, `readonly`, имена | Чем кортеж отличается от массива? |

## Регионы 5 и 7. Type Manipulation — план

| Регион | Тема | Что знать | Вопрос или задача |
| --- | --- | --- | --- |
| 5 | Generics | Связь входа и выхода, constraints, дефолты, `const` type parameters, `NoInfer` | Типизируй `getProp(obj, key)` |
| 5 | keyof | Для `[k: string]` даёт `string \| number` | Почему? |
| 5 | typeof | Тип из значения | Тип из объекта-константы |
| 5 | Indexed Access | `T[K]`, `T[number]` | Union элементов кортежа |
| 7 | Conditional Types | `extends ? :`, `infer`, дистрибутивность, `[T] extends [U]` | Почему `IsNever<never>` = `never`? |
| 7 | Mapped Types | Модификаторы, key remapping через `as` | Напиши `MyOmit` без `Omit` |
| 7 | Template Literal Types | `infer` в шаблоне, intrinsic-утилиты | Вытащи `:id` из маршрута |

Лайв-кодинг: `DeepReadonly`, `DeepPartial`, `TupleToUnion`, `UnionToIntersection`, типизированный `get(obj, 'a.b.c')`, типобезопасный EventEmitter.

## Регион 6. Utility Types — готово

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

## Регион 8. Классы и модули — план

| Тема | Что знать | Вопрос на собесе |
| --- | --- | --- |
| Поля и конструкторы | `strictPropertyInitialization`, parameter properties | Что делает `constructor(private x: number)`? |
| `implements` и `extends` | `implements` только проверяет форму | Чем отличаются? |
| `private` и `#private` | TS-модификаторы стираются | В чём разница? |
| `abstract`, `this`-типы | `this is T` в методах | Абстрактный класс или интерфейс? |
| Модули | `import type` | Зачем `import type`? |
| Enums | Reverse mapping, `const enum` | Почему выбирают union + `as const`? |
| Declaration merging | Module augmentation | Как расширить тип библиотеки? |
| Decorators | Экспериментальные и стандартные (5.0+) | Где встречал? |

## Регион 9. tsconfig и strict — план

| Флаг | В `strict` | Что делает |
| --- | --- | --- |
| `noImplicitAny` | Да | Ошибка на неявный `any` |
| `strictNullChecks` | Да | `null`/`undefined` — отдельные типы |
| `strictFunctionTypes` | Да | Контравариантность параметров (кроме методов) |
| `strictBindCallApply` | Да | Типизация `bind`/`call`/`apply` |
| `strictPropertyInitialization` | Да | Инициализация полей класса |
| `noImplicitThis` | Да | Ошибка на `this: any` |
| `useUnknownInCatchVariables` | Да | `catch (e)` даёт `unknown` |
| `alwaysStrict` | Да | `"use strict"` |
| `noUncheckedIndexedAccess` | Нет | `arr[i]` → `T \| undefined` |
| `exactOptionalPropertyTypes` | Нет | `a?: T` не принимает явный `undefined` |
| `noImplicitOverride` | Нет | Требует `override` |
| `isolatedModules`, `verbatimModuleSyntax` | Нет | Поштучная компиляция, `import type` |

Состав `strict` указан по памяти на TS 5.x; сверить с [заметками к TS 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html).

Плюс отдельный блок «TS и React»: `ComponentProps`, `PropsWithChildren`, типизация хуков и `forwardRef`, polymorphic `as`-prop.

## Механики упражнений

| Механика | Как выглядит | Навык | Где |
| --- | --- | --- | --- |
| Сортировщик | Условия в `if`, значения катятся по веткам | Понимание сужения | Регион 2 |
| Предскажи тип | Код и 4 варианта; после ответа показывается тип от компилятора | Предсказывать систему типов | Все уроки |
| Почини код | Ошибки компиляции, убрать без `any` и `as` | Читать ошибки TS | Регион 1 |
| Напиши тип | Скрытые тесты `Expect<Equal<...>>` | Лайв-кодинг | Регионы 5–7, утилиты |

Урок: теория с примером → песочница → 2–4 упражнения → вопрос для ответа вслух.

## Порядок дальше

- [ ] Регион 2: уровни или уроки по equality narrowing, assignments, type predicates, assertion functions
- [ ] Регион 5: Generics, `keyof`, `typeof`, indexed access
- [ ] Регион 7: conditional, mapped, template literal types и задачи для лайв-кодинга
- [ ] Регионы 3 и 4: функции и объекты
- [ ] Регион 9: `satisfies`, guards, `strict`, API без `any`
- [ ] Регион 8: классы и модули
- [ ] Блок «TS и React»
