import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createEngine, type Engine, type TsApi } from "../engine/engine";

interface EngineState {
  engine: Engine | null;
  status: "loading" | "ready" | "error";
}

const EngineContext = createContext<EngineState>({ engine: null, status: "loading" });

/** Лениво грузит компилятор TypeScript (отдельный чанк ~3.5 МБ). */
export function EngineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EngineState>({ engine: null, status: "loading" });
  useEffect(() => {
    let alive = true;
    Promise.all([import("typescript"), import("../engine/libSources")])
      .then(([mod, { LIB }]) => {
        const ts = ((mod as { default?: TsApi }).default ?? mod) as TsApi;
        if (alive) setState({ engine: createEngine(ts, LIB), status: "ready" });
      })
      .catch((e: unknown) => {
        console.error("Не удалось загрузить компилятор", e);
        if (alive) setState({ engine: null, status: "error" });
      });
    return () => { alive = false; };
  }, []);
  return <EngineContext.Provider value={state}>{children}</EngineContext.Provider>;
}

export const useEngine = () => useContext(EngineContext);
