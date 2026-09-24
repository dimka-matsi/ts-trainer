import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

interface Item { id: number; msg: string }

const ToastContext = createContext<(msg: string) => void>(() => {});

/** Очередь коротких уведомлений: по одному за раз. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Item[]>([]);
  const [visible, setVisible] = useState(false);
  const nextId = useRef(0);
  const current = queue[0];

  const push = useCallback((msg: string) => {
    nextId.current += 1;
    const id = nextId.current;
    setQueue((q) => [...q, { id, msg }]);
  }, []);

  useEffect(() => {
    if (!current) return;
    setVisible(true);
    const hide = setTimeout(() => setVisible(false), 2600);
    const next = setTimeout(() => setQueue((q) => q.slice(1)), 2900);
    return () => { clearTimeout(hide); clearTimeout(next); };
  }, [current?.id]);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className={`toast${visible && current ? " show" : ""}`} role="status">{current?.msg}</div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
