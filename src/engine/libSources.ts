// Исходники lib-файлов для браузера: Vite подключает их как строки через ?raw.
import decorators from "typescript/lib/lib.decorators.d.ts?raw";
import decoratorsLegacy from "typescript/lib/lib.decorators.legacy.d.ts?raw";
import es5 from "typescript/lib/lib.es5.d.ts?raw";
import symbol from "typescript/lib/lib.es2015.symbol.d.ts?raw";
import symbolWellknown from "typescript/lib/lib.es2015.symbol.wellknown.d.ts?raw";
import iterable from "typescript/lib/lib.es2015.iterable.d.ts?raw";
import generator from "typescript/lib/lib.es2015.generator.d.ts?raw";
import core from "typescript/lib/lib.es2015.core.d.ts?raw";
import collection from "typescript/lib/lib.es2015.collection.d.ts?raw";
import promise from "typescript/lib/lib.es2015.promise.d.ts?raw";
import arrayInclude from "typescript/lib/lib.es2016.array.include.d.ts?raw";
import object2017 from "typescript/lib/lib.es2017.object.d.ts?raw";
import string2017 from "typescript/lib/lib.es2017.string.d.ts?raw";
import reactIndex from "/node_modules/@types/react/index.d.ts?raw";
import reactGlobal from "/node_modules/@types/react/global.d.ts?raw";
import reactJsxRuntime from "/node_modules/@types/react/jsx-runtime.d.ts?raw";
import { buildLib, reactExtras } from "./lib";

// Порядок совпадает с LIB_FILES в lib.ts.
export const LIB = buildLib([
  decorators, decoratorsLegacy, es5, symbol, symbolWellknown, iterable, generator,
  core, collection, promise, arrayInclude, object2017, string2017,
]);

/** Типы React для уроков «TS и React»: читаются только при импорте `react` или JSX. */
export const REACT_EXTRAS = reactExtras((f) => (f === "index.d.ts" ? reactIndex : f === "global.d.ts" ? reactGlobal : reactJsxRuntime));
