import type { ReactNode } from "react";

export function DiagnosticItem({ code, msg, where }: { code: number; msg: string; where: ReactNode }) {
  return (
    <div className="err">
      <div className="err-msg"><span className="tscode">TS{code}</span>{msg}</div>
      <div className="where">{where}</div>
    </div>
  );
}
