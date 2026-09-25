import type { WebLesson } from "../../../course/types";

export const lesson: WebLesson = {
  id: "st6",
  region: 1,
  title: "Формы с React Hook Form и схемой zod",
  q: "Зачем нужна библиотека форм вроде React Hook Form? Как устроена валидация по схеме?",
  answer:
    "Большая форма на `useState` — это состояние на каждое поле, ререндер всей формы на каждый символ, ручные ошибки и флаги «поле трогали». React Hook Form хранит значения в неуправляемых полях через `ref` и перерисовывает только то, что подписано на изменения, поэтому форма из сотни полей не тормозит. Функция `register` подключает поле, `handleSubmit` проверяет данные и вызывает отправку, `formState.errors` даёт ошибки. Правила проверки удобно описать схемой zod: одна схема проверяет форму, даёт тип данных для TypeScript и может проверить тот же запрос на сервере.",
  theory: {
    p: [
      "Управляемая форма — значение каждого поля в состоянии, `onChange` на каждый символ перерисовывает компонент формы целиком. Для трёх полей это нормально. Для анкеты на пятьдесят полей с проверками, зависимыми полями и массивами появляется много кода и лишних ререндеров.",
      "React Hook Form делает поля неуправляемыми: `register(\"email\")` возвращает `name`, `ref`, `onChange` и `onBlur`, и библиотека читает значения прямо из DOM. Ререндер происходит только у того, что подписано на изменения, например у сообщения об ошибке. `handleSubmit(onValid)` собирает значения, проверяет и вызывает обработчик, только если всё верно. Для управляемых компонентов из UI-библиотек (выпадающие списки, календари) есть `Controller`.",
      "Схема zod описывает данные один раз: `z.object({ email: z.string().email(), age: z.number().min(18) })`. Резолвер подключает её к форме, и ошибки появляются в `formState.errors` с текстами из схемы. `z.infer<typeof schema>` даёт тип значений формы для TypeScript. Ту же схему можно использовать на сервере — проверка в браузере лишь удобство, а доверять можно только серверу.",
      "Альтернативы: Formik (устаревший, с управляемыми полями) и более новые библиотеки форм. В React 19 простые формы можно делать на Actions и `<form action>` без библиотек — об этом отдельный регион. Библиотеку берут, когда форм много, они большие или с динамическими полями.",
    ],
    code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Нужен email'),
  age: z.coerce.number().min(18, 'Только с 18 лет'),
});
type Values = z.infer<typeof schema>;

export function SignUp({ onSave }: { onSave: (v: Values) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
  });
  return (
    <form onSubmit={handleSubmit(onSave)}>
      <input {...register('email')} />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <input type="number" {...register('age')} />
      {errors.age && <p role="alert">{errors.age.message}</p>}
      <button disabled={isSubmitting}>Готово</button>
    </form>
  );
}`,
    flow: {
      actors: ["Поле email", "React Hook Form", "Схема zod", "Компонент"],
      steps: [
        { from: 0, to: 1, label: "ввод: значение остаётся в DOM", note: "компонент формы не перерисовывается на каждый символ" },
        { from: 1, to: 2, label: "отправка: handleSubmit проверяет по схеме" },
        { from: 2, to: 1, label: "ошибка: email — «Нужен email»" },
        { from: 1, to: 3, label: "ререндер только блока с ошибкой" },
      ],
    },
    keys: [
      "Большая управляемая форма — много состояния и ререндер всей формы на каждый символ.",
      "React Hook Form: неуправляемые поля через `register`, `handleSubmit`, `formState.errors`, `Controller` для UI-библиотек.",
      "Схема zod — одна на проверку, тип `z.infer` и проверку на сервере.",
    ],
  },
  tasks: [
    {
      type: "quiz",
      q: "Почему форма на React Hook Form из сотни полей не тормозит при вводе, а на `useState` — тормозит?",
      opts: [
        "Поля неуправляемые: значения живут в DOM, и ввод не перерисовывает форму целиком",
        "React Hook Form выполняет рендер в Web Worker",
        "React Hook Form отключает проверку ввода",
        "`useState` медленнее из-за копирования строк",
      ],
      a: 0,
      why: "С `useState` каждый символ меняет состояние компонента формы, и он перерисовывается со всеми полями. RHF подписывает на изменения только то, что нужно.",
    },
    {
      type: "match",
      q: "Сопоставь API React Hook Form и его роль.",
      pairs: [
        ["`register`", "подключить поле: `name`, `ref`, обработчики"],
        ["`handleSubmit`", "проверить значения и вызвать отправку только при успехе"],
        ["`formState.errors`", "ошибки проверки по полям"],
        ["`Controller`", "подключить управляемый компонент из UI-библиотеки"],
      ],
      why: "`Controller` нужен там, где поле не отдаёт `ref` на настоящий input, например у календаря из библиотеки.",
    },
    {
      type: "quiz",
      q: "Что даёт схема zod, кроме проверки формы?",
      code: `const schema = z.object({ email: z.string().email() });
type Values = z.infer<typeof schema>;`,
      opts: [
        "Тип данных для TypeScript и ту же проверку на сервере",
        "Автоматическую отправку формы",
        "Хранение значений в localStorage",
        "Стили для ошибок",
      ],
      a: 0,
      why: "Одна схема — один источник правды: тип, проверка в браузере и на сервере не разъедутся.",
    },
  ],
};
