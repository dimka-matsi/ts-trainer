import type { Lesson } from "../../types";

export const lesson: Lesson = {
  id: "tr6",
  region: 9,
  title: "useContext без undefined",
  q: "Как сделать контекст, который не нужно каждый раз проверять на `undefined`?",
  answer: "Контекст создают со значением по умолчанию `null`: `createContext<AuthValue | null>(null)`, — честно, потому что вне провайдера значения нет. А проверку делают один раз в своём хуке: `useAuth()` читает контекст, бросает понятную ошибку, если его нет, и возвращает `AuthValue` без `null`. Компоненты вызывают `useAuth()` и получают точный тип без проверок. Альтернатива — фальшивое значение по умолчанию или `{} as AuthValue`, но она прячет ошибку «забыли провайдер».",
  theory: {
    p: [
      "`createContext<T>(defaultValue)` требует значение по умолчанию — его получит компонент без провайдера над собой. Для темы оно имеет смысл: `createContext<\"light\" | \"dark\">(\"light\")`. Для пользователя или стора осмысленного значения нет.",
      "Плохие варианты: `createContext<AuthValue>({} as AuthValue)` — обман через `as`, без провайдера компонент упадёт на `undefined.name`; `createContext<AuthValue | undefined>(undefined)` без хука — проверка в каждом компоненте.",
      "Хороший вариант: `createContext<AuthValue | null>(null)` и свой хук. Внутри `const value = useContext(AuthContext); if (!value) throw new Error(\"useAuth нужно вызывать внутри AuthProvider\"); return value;`. После проверки тип сужен до `AuthValue`, и все пользователи хука получают его без `null`.",
      "Провайдер тоже типизирован: `<AuthContext value={…}>` в React 19 проверит, что значение подходит под `AuthValue | null`. Ещё одна частая форма — фабрика `createSafeContext<T>()`, которая возвращает пару «провайдер и хук» для любого типа.",
    ],
    example: `// @filename: App.tsx
import { createContext, useContext } from "react";

type AuthValue = { user: string; logout: () => void };
const AuthContext = createContext<AuthValue | null>(null);

function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth нужно вызывать внутри AuthProvider");
  return value;                                   // тип сужен до AuthValue
}

function Profile() {
  const { user } = useAuth();
  const raw = useContext(AuthContext);
  return <p>{user} {raw.user}</p>;                // ошибка: raw может быть null
}`,
    keys: ["Контекст без осмысленного значения по умолчанию создают с `null`: `createContext<T | null>(null)`.", "Проверку делают один раз в своём хуке: ошибка без провайдера, наружу — тип без `null`.", "`{} as T` по умолчанию прячет ошибку «забыли провайдер»."],
  },
  tasks: [
    {
      type: "predict",
      q: "Какой тип TypeScript выведет для `useAuth`?",
      probe: "useAuth",
      code: `// @filename: App.tsx
import { createContext, useContext } from "react";
type Auth = { user: string };
const Ctx = createContext<Auth | null>(null);
function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("Нет провайдера");
  return v;
}`,
      opts: ["function useAuth(): Auth", "function useAuth(): Auth | null", "function useAuth(): unknown", "function useAuth(): Auth | undefined"],
      a: 0,
      why: "После `if (!v) throw` компилятор знает, что `v` не `null`, и выводит результат `Auth`.",
    },
    {
      type: "quiz",
      q: "Чем плох `createContext<Auth>({} as Auth)`?",
      opts: ["Компонент без провайдера получит пустой объект, и ошибка всплывёт позже как `undefined`", "Он не компилируется", "Контекст перестанет обновляться", "Нельзя передать `value`"],
      a: 0,
      why: "`as` обманывает компилятор. С `null` и проверкой в хуке ошибка будет сразу и с понятным текстом.",
    },
    {
      type: "code",
      kind: "write",
      goal: "Допиши хук `useCart`: он должен возвращать `CartValue` без `null` и бросать ошибку, если провайдера нет.",
      code: `// @filename: App.tsx
import { createContext, useContext } from "react";

type CartValue = { items: string[]; add: (id: string) => void };
const CartContext = createContext<CartValue | null>(null);

function useCart() {
  return useContext(CartContext);
}`,
      tests: `function Badge() {
  const { items } = useCart();
  return <span>{items.length}</span>;
}`,
      forbid: ["any", "as", "nonnull", "ignore"],
      hint: "`const value = useContext(CartContext); if (!value) throw new Error(\"…\"); return value;`",
      solution: `// @filename: App.tsx
import { createContext, useContext } from "react";

type CartValue = { items: string[]; add: (id: string) => void };
const CartContext = createContext<CartValue | null>(null);

function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart нужно вызывать внутри CartProvider");
  return value;
}`,
    },
  ],
};
