import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr5",
  region: 9,
  title: "useRef",
  q: "Почему `useRef<HTMLInputElement>(null)` и `useRef<number>(0)` ведут себя по-разному? Что изменилось в React 19?",
  answer: "`useRef` для DOM-элемента создают с `null`: `useRef<HTMLInputElement>(null)` даёт `RefObject<HTMLInputElement | null>` — до монтирования и после размонтирования там `null`, поэтому при обращении нужна проверка `ref.current?.focus()`. Ref для значения создают с начальным значением: `useRef<number>(0)` — `RefObject<number>`, и `ref.current` всегда число. В React 19 у `useRef` обязателен аргумент, а `current` всегда можно изменить; в React 18 объект для DOM был только для чтения, и это часто спрашивают.",
  theory: {
    p: [
      "Ref на DOM-элемент: `const inputRef = useRef<HTMLInputElement>(null)`. Тип — `RefObject<HTMLInputElement | null>`: пока элемент не отрисован, в `current` лежит `null`. Поэтому обращаются через проверку: `inputRef.current?.focus()` или `if (inputRef.current) …`.",
      "Ref на значение: `const timerRef = useRef<number>(0)` или `useRef<number | undefined>(undefined)`. Это «ящик» для данных между рендерами, который не вызывает ререндер: id таймера, прошлое значение, флаг. Тип `current` — ровно то, что указано.",
      "React 19 упростил типы: аргумент у `useRef` обязателен (`useRef()` без него — ошибка), а `current` у всех ref изменяемый. В React 18 были перегрузки: `useRef<T>(null)` давал объект с `current` только для чтения. На собеседовании могут спросить «почему `ref.current` иногда readonly» — ответ: так было в типах React 18 для DOM-ref.",
      "Передача ref в свой компонент: в React 19 `ref` — обычный проп, его тип берут из `ComponentProps<\"input\">` или пишут `ref?: Ref<HTMLInputElement>`. `forwardRef` для этого больше не нужен.",
    ],
    example: `// @filename: App.tsx
import { useRef } from "react";

function Search() {
  const inputRef = useRef<HTMLInputElement>(null);   // RefObject<HTMLInputElement | null>
  const renders = useRef<number>(0);                 // RefObject<number>

  function focus() {
    inputRef.current.focus();                        // ошибка: может быть null
    inputRef.current?.focus();
  }
  renders.current += 1;
  return <input ref={inputRef} onClick={focus} />;
}`,
    keys: ["DOM-ref создают с `null`: тип `RefObject<T | null>`, при обращении нужна проверка.", "Ref для значения — с начальным значением, тип `current` ровно указанный.", "React 19: аргумент `useRef` обязателен, `current` изменяемый; readonly DOM-ref — это типы React 18."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип будет у `r` внутри компонента?",
      probe: "r",
      code: `// @filename: App.tsx
import { useRef } from "react";
function C() {
  const r = useRef<HTMLInputElement>(null);
  return <input ref={r} />;
}`,
      opts: ["React.RefObject<HTMLInputElement | null>", "React.RefObject<HTMLInputElement>", "React.MutableRefObject<HTMLInputElement>", "HTMLInputElement | null"],
      a: 0,
      why: "Начальное значение `null`, поэтому в `current` бывает и элемент, и `null`.",
    },
    {
      type: "quiz",
      q: "Почему к `inputRef.current` обращаются через `?.`?",
      opts: ["До монтирования и после размонтирования там `null`", "Так быстрее", "Ref всегда пустой", "Иначе компонент перерисуется"],
      a: 0,
      why: "React кладёт узел в `current` только после коммита, а при размонтировании возвращает `null`.",
    },
    {
      type: "code",
      kind: "fix",
      goal: "Функция фокуса не компилируется: `current` может быть `null`. Исправь без `!` и `as`.",
      code: `// @filename: App.tsx
import { useRef } from "react";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  function focusEmail() {
    emailRef.current.focus();
  }
  return <input ref={emailRef} onFocus={focusEmail} />;
}`,
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "`emailRef.current?.focus();`",
      solution: `// @filename: App.tsx
import { useRef } from "react";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  function focusEmail() {
    emailRef.current?.focus();
  }
  return <input ref={emailRef} onFocus={focusEmail} />;
}`,
    },
  ],
};
