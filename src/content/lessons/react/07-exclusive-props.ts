import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr7",
  region: 9,
  title: "Взаимоисключающие пропсы",
  q: "Как запретить передать одновременно `href` и `onClick`? Как типизировать компонент, у которого разные наборы пропсов?",
  answer: "Варианты пропсов описывают union: «ссылка» — `{ href: string }`, «кнопка» — `{ onClick: () => void }`. Но union объектов сам по себе не запрещает лишнее поле: объект с обоими полями подходит под первый вариант. Запрет делают полем `never`: `{ href: string; onClick?: never } | { onClick: () => void; href?: never }` — теперь передать оба нельзя. Если у вариантов есть поле-метка, например `variant: \"link\" | \"button\"`, получается discriminated union, и внутри компонента проверка `props.variant` сужает остальные пропсы.",
  theory: {
    p: [
      "Задача: компонент `Action` — либо ссылка с `href`, либо кнопка с `onClick`, но не оба сразу. Наивный вариант `{ href?: string; onClick?: () => void }` разрешает и оба, и ни одного.",
      "Union `{ href: string } | { onClick: () => void }` ближе, но всё ещё пропускает объект с обоими полями: TypeScript проверяет лишние свойства у union мягко, достаточно совпасть с одним вариантом. Решение — явно запретить чужое поле: `onClick?: never` в варианте ссылки и `href?: never` в варианте кнопки. Необязательное поле типа `never` можно только не передавать.",
      "Поле-метка удобнее, когда вариантов много: `{ kind: \"link\"; href: string } | { kind: \"button\"; onClick: () => void }`. Внутри компонента `if (props.kind === \"link\")` сужает тип, и доступен `href`. Разбирать `props` в параметрах сразу нельзя — после разбора связь полей теряется.",
      "Такие типы часто выносят в хелпер `XOR<A, B>` — «ровно один из двух наборов». На собеседовании это популярный вопрос: он проверяет, понимаешь ли ты union, `never` и проверку лишних свойств.",
    ],
    example: `// @filename: App.tsx
type LinkProps = { href: string; onClick?: never };
type ButtonProps = { onClick: () => void; href?: never };
type ActionProps = (LinkProps | ButtonProps) & { label: string };

function Action(props: ActionProps) {
  return props.href ? <a href={props.href}>{props.label}</a> : <button onClick={props.onClick}>{props.label}</button>;
}

const a = <Action label="Открыть" href="/orders" />;
const b = <Action label="Удалить" onClick={() => {}} />;
const c = <Action label="Оба" href="/" onClick={() => {}} />;   // ошибка: нельзя оба сразу`,
    keys: ["Варианты пропсов — union объектов; сам по себе он не запрещает лишнее поле.", "Запрет — поле `never`: `{ href: string; onClick?: never } | { onClick: …; href?: never }`.", "С полем-меткой получается discriminated union: проверка метки сужает остальные пропсы."],
  },
  tasks: [
    {
      type: "quiz",
      q: "Зачем в варианте ссылки поле `onClick?: never`?",
      opts: ["Чтобы в этом варианте `onClick` нельзя было передать: `never` можно только не указать", "Чтобы `onClick` стал обязательным", "Чтобы отключить события", "Это ни на что не влияет"],
      a: 0,
      why: "Без него объект с `href` и `onClick` подойдёт под вариант ссылки, и запрета не будет.",
    },
    {
      type: "predict",
      q: "Какой тип будет у `h` внутри ветки `if (props.kind === \"link\")`?",
      probe: "h",
      code: `// @filename: App.tsx
type Props = { kind: "link"; href: string } | { kind: "button"; onClick: () => void };
function Action(props: Props) {
  if (props.kind === "link") {
    const h = props.href;
  }
  return null;
}`,
      opts: ["string", "string | undefined", "never", "unknown"],
      a: 0,
      why: "Метка `kind` сузила union до варианта ссылки, где `href` обязательный.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Опиши пропсы `Avatar`: либо `src` — ссылка на картинку, либо `initials` — буквы, но не оба сразу и не ни одного.",
      code: `// @filename: App.tsx
type AvatarProps = { src?: string; initials?: string };

function Avatar(props: AvatarProps) {
  return props.src ? <img src={props.src} /> : <span>{props.initials}</span>;
}`,
      tests: `const a = <Avatar src="/me.png" />;
const b = <Avatar initials="АК" />;
// @ts-expect-error — нельзя оба
const c = <Avatar src="/me.png" initials="АК" />;
// @ts-expect-error — нужен хотя бы один
const d = <Avatar />;`,
      forbid: ["any", "ignore"],
      hint: "`type AvatarProps = { src: string; initials?: never } | { initials: string; src?: never }`.",
      solution: `// @filename: App.tsx
type AvatarProps = { src: string; initials?: never } | { initials: string; src?: never };

function Avatar(props: AvatarProps) {
  return props.src ? <img src={props.src} /> : <span>{props.initials}</span>;
}`,
    },
  ],
};
