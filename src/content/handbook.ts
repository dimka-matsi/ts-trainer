/**
 * Сверка с документацией TypeScript: каждый раздел Handbook и справочника привязан к уроку,
 * уровню сортировщика, теме плана на карте или помечен как пропущенный с причиной.
 * verify проверяет, что все ссылки существуют. Сверено с оглавлением сайта 24.09.2026.
 */

export type Coverage =
  | { lesson: string }
  | { level: number }
  /** Тема региона «скоро» из regions.ts: индекс региона и название темы. */
  | { topic: [region: number, title: string] }
  | { card: string }
  | { skip: string };

export interface HandbookSection {
  page: string;
  url: string;
  section: string;
  covered: Coverage[];
}

const H = "https://www.typescriptlang.org/docs/handbook/";

const sec = (page: string, url: string, rows: [section: string, ...covered: Coverage[]][]): HandbookSection[] =>
  rows.map(([section, ...covered]) => ({ page, url: H + url, section, covered }));

const L = (lesson: string): Coverage => ({ lesson });

export const HANDBOOK: HandbookSection[] = [
  ...sec("The Basics", "2/basic-types.html", [
    ["Static type-checking", L("b1")],
    ["Non-exception Failures", L("b1")],
    ["Types for Tooling", { card: "ts-why" }],
    ["tsc, the TypeScript compiler", L("b1")],
    ["Emitting with Errors", L("b1")],
    ["Explicit Types", L("b3")],
    ["Erased Types", L("b1")],
    ["Downleveling", L("pj3"), L("pj4")],
    ["Strictness", L("b1")],
    ["noImplicitAny", L("b2")],
    ["strictNullChecks", L("b9")],
  ]),
  ...sec("Everyday Types", "2/everyday-types.html", [
    ["The primitives: string, number, boolean", L("b2")],
    ["Arrays", L("b2")],
    ["any, noImplicitAny", L("b2")],
    ["Type Annotations on Variables", L("b3")],
    ["Functions: параметры, результат, Promise, анонимные функции", L("b3")],
    ["Object Types, Optional Properties", L("b4")],
    ["Union Types", L("b5")],
    ["Type Aliases", L("b4"), L("b6")],
    ["Interfaces, Differences Between Type Aliases and Interfaces", L("b6")],
    ["Type Assertions", L("b7")],
    ["Literal Types, Literal Inference", L("b8")],
    ["null and undefined, Non-null Assertion Operator", L("b9")],
    ["Enums", L("b8"), L("cl9")],
    ["Less Common Primitives: bigint, symbol", L("b2"), L("ob9")],
  ]),
  ...sec("Narrowing", "2/narrowing.html", [
    ["typeof type guards", { level: 0 }],
    ["Truthiness narrowing", { level: 1 }],
    ["Equality narrowing", L("n1")],
    ["The in operator narrowing", { level: 2 }],
    ["instanceof narrowing", { level: 2 }],
    ["Assignments", L("na")],
    ["Control flow analysis", L("na")],
    ["Using type predicates", L("n2")],
    ["Assertion functions", L("n3")],
    ["Discriminated unions", { level: 3 }, L("n4")],
    ["The never type, Exhaustiveness checking", { level: 3 }],
  ]),
  ...sec("More on Functions", "2/functions.html", [
    ["Function Type Expressions", L("f1")],
    ["Call Signatures", L("f1")],
    ["Construct Signatures", L("f1")],
    ["Generic Functions: Inference, Constraints, Specifying Type Arguments", L("fg")],
    ["Guidelines for Writing Good Generic Functions", L("fg"), { card: "generic-once" }],
    ["Optional Parameters, Optional Parameters in Callbacks", L("f2")],
    ["Function Overloads, Writing Good Overloads", L("f3")],
    ["Declaring this in a Function", L("f4")],
    ["Other Types: void, never", L("f5")],
    ["Other Types: object, Function", L("fo")],
    ["Other Types: unknown", L("b10")],
    ["Rest Parameters and Arguments", L("f7")],
    ["Parameter Destructuring", L("fd")],
    ["Assignability of Functions: Return type void", L("f5")],
  ]),
  ...sec("Object Types", "2/objects.html", [
    ["Optional Properties", L("b4")],
    ["readonly Properties, Index Signatures", L("ob2"), L("ob3")],
    ["Excess Property Checks", L("b10"), L("ob4")],
    ["Extending Types, Intersection Types, Interface Extension vs. Intersection", L("b6"), L("ob5")],
    ["Generic Object Types", L("g5"), L("ob6")],
    ["The Array Type", L("b2")],
    ["The ReadonlyArray Type, readonly Tuple Types", L("ob8")],
    ["Tuple Types", L("b2"), L("ob7")],
  ]),
  ...sec("Creating Types from Types", "2/types-from-types.html", [
    ["Обзор главы Type Manipulation", { skip: "обзорная страница, сами темы разобраны в главах ниже" }],
  ]),
  ...sec("Generics", "2/generics.html", [
    ["Hello World of Generics, Working with Generic Type Variables, Generic Types", L("fg")],
    ["Generic Classes", L("g5")],
    ["Generic Constraints, Using Type Parameters in Generic Constraints", L("fg"), L("g2")],
    ["Using Class Types in Generics", L("g7")],
    ["Generic Parameter Defaults", L("g4")],
    ["Variance Annotations", L("g7")],
  ]),
  ...sec("Keyof Type Operator", "2/keyof-types.html", [["keyof", L("g1")]]),
  ...sec("Typeof Type Operator", "2/typeof-types.html", [["typeof в позиции типа", L("g3")]]),
  ...sec("Indexed Access Types", "2/indexed-access-types.html", [["T[K], T[number]", L("g1")]]),
  ...sec("Conditional Types", "2/conditional-types.html", [
    ["Conditional Types, Conditional Type Constraints", L("tc1"), L("u4")],
    ["Inferring Within Conditional Types", L("tc3"), L("u5")],
    ["Distributive Conditional Types", L("tc2")],
  ]),
  ...sec("Mapped Types", "2/mapped-types.html", [
    ["Mapped Types, Mapping Modifiers", L("tc4"), L("u1")],
    ["Key Remapping via as", L("tc4")],
  ]),
  ...sec("Template Literal Types", "2/template-literal-types.html", [
    ["Template Literal Types, Inference with Template Literals", L("tc5")],
    ["Intrinsic String Manipulation Types", L("u8")],
  ]),
  ...sec("Classes", "2/classes.html", [
    ["Fields, strictPropertyInitialization, readonly, Constructors, Index Signatures", L("cl1")],
    ["Methods, Getters / Setters, Static Members, static Blocks", L("cl6")],
    ["implements Clauses, extends Clauses", L("cl2")],
    ["Overriding Methods, Initialization Order, Inheriting Built-in Types", L("cl3")],
    ["Member Visibility: public, protected, private", L("cl4")],
    ["Generic Classes", L("g5")],
    ["this at Runtime in Classes, Arrow Functions, this parameters", L("f4")],
    ["this Types, this-based type guards", L("cl7")],
    ["Parameter Properties, abstract Classes and Members", L("cl1"), L("cl5")],
    ["Class Expressions, Constructor Signatures, Abstract Construct Signatures", L("cl5")],
    ["Relationships Between Classes", L("b10")],
  ]),
  ...sec("Modules", "2/modules.html", [
    ["How JavaScript Modules are Defined, Non-modules, ES Module Syntax", L("cl10")],
    ["import type, Inline type imports", L("cl10")],
    ["CommonJS Syntax, CommonJS and ES Modules interop", L("pj4")],
    ["Module Resolution Options, Module Output Options", L("pj3"), L("pj4")],
    ["TypeScript namespaces", L("cl13")],
  ]),
  ...sec("Utility Types", "utility-types.html", [
    ["Partial, Required, Readonly", L("u1")],
    ["Record", L("u2")],
    ["Exclude, Extract, NonNullable", L("u4")],
    ["Pick, Omit", L("u3")],
    ["Parameters, ReturnType, ConstructorParameters, InstanceType", L("u5")],
    ["Awaited, NoInfer", L("u6")],
    ["ThisParameterType, OmitThisParameter, ThisType", L("u7")],
    ["Uppercase, Lowercase, Capitalize, Uncapitalize", L("u8")],
  ]),
  ...sec("Cheat Sheets", "cheatsheets.html", [["Шпаргалки", { skip: "краткий пересказ тем, новых тем нет" }]]),
  ...sec("Decorators", "decorators.html", [["Decorators", L("cl14")]]),
  ...sec("Declaration Merging", "declaration-merging.html", [["Declaration Merging", L("b6"), L("cl12")]]),
  ...sec("Enums", "enums.html", [["Numeric, string, const enums, reverse mappings", L("b8"), L("cl9")]]),
  ...sec("Iterators and Generators", "iterators-and-generators.html", [["Iterators and Generators", L("ob10")]]),
  ...sec("JSX", "jsx.html", [["JSX", L("tr1")]]),
  ...sec("Mixins", "mixins.html", [["Mixins", L("cl8")]]),
  ...sec("Namespaces", "namespaces.html", [["Namespaces", L("cl13")]]),
  ...sec("Namespaces and Modules", "namespaces-and-modules.html", [["Namespaces and Modules", L("cl13")]]),
  ...sec("Symbols", "symbols.html", [["Symbols, unique symbol", L("ob9")]]),
  ...sec("Triple-Slash Directives", "triple-slash-directives.html", [["Triple-Slash Directives", L("pj7")]]),
  ...sec("Type Compatibility", "type-compatibility.html", [["Type Compatibility", L("b10"), L("f8")]]),
  ...sec("Type Inference", "type-inference.html", [["Best common type, Contextual Typing", L("b3")]]),
  ...sec("Variable Declaration", "variable-declarations.html", [["let, const, деструктуризация", { skip: "это синтаксис JavaScript, а не TypeScript" }]]),
  ...sec("Modules Reference", "modules/introduction.html", [
    ["Theory, Guides, Reference", L("pj3"), L("pj4")],
    ["ESM/CJS Interoperability", L("pj4")],
  ]),
  ...sec("Declaration Files", "declaration-files/introduction.html", [
    ["Introduction, Declaration Reference, Library Structures, Templates", L("cl11")],
    ["Do's and Don'ts, Deep Dive, Publishing, Consumption", L("pj5")],
  ]),
  ...sec("JavaScript", "intro-to-js-ts.html", [
    ["JS Projects, Type Checking JavaScript Files, JSDoc Reference, .d.ts из .js", L("pj6")],
  ]),
  ...sec("Project Configuration", "tsconfig-json.html", [
    ["What is a tsconfig.json, TSConfig Reference, tsc CLI Options", L("pj8")],
    ["Project References", L("pj7")],
    ["Integrating with Build Tools", L("pj1")],
    ["Compiler Options in MSBuild, Configuring Watch, Nightly Builds", { skip: "настройка окружения, на собеседованиях не спрашивают" }],
  ]),
  ...sec("Get Started", "typescript-from-scratch.html", [
    ["TS для новичков и программистов на JS, Java/C#, функциональных языках", { skip: "вводные статьи, их темы покрыты регионом «Основы»" }],
  ]),
  ...sec("Tutorials", "migrating-from-javascript.html", [
    ["ASP.NET Core, Gulp, DOM Manipulation, Babel", { skip: "пошаговые инструкции по инструментам" }],
    ["Migrating from JavaScript", L("pj6")],
  ]),
  ...sec("What's New", "release-notes/overview.html", [
    ["satisfies (4.9)", L("b11")],
    ["const type parameters (5.0)", L("g6")],
    ["NoInfer (5.4)", L("u6")],
    ["Inferred type predicates (5.5)", L("n2")],
    ["erasableSyntaxOnly (5.8)", L("pj2")],
    ["Остальные заметки к версиям", { skip: "история изменений; важное для собеседований вынесено в уроки выше" }],
  ]),
];
