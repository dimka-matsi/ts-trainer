/// <reference lib="webworker" />
// Воркер, в котором выполняется код ученика: бесконечный цикл не повесит страницу, воркер просто остановят.
import { runOutput, runTests } from "./jsRunner";

type Request =
  | { kind: "output"; code: string }
  | { kind: "tests"; code: string; tests: [string, string][] };

self.onmessage = async (e: MessageEvent<Request>) => {
  const req = e.data;
  const result = req.kind === "output" ? await runOutput(req.code) : await runTests(req.code, req.tests);
  self.postMessage(result);
};
