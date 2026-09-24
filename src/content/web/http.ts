import type { HttpMessage } from "./types";

/**
 * HTTP-сообщение для вкладки «Сеть». Если есть тело, добавляет `Content-Type` и `Content-Length`
 * с настоящей длиной в байтах UTF-8, чтобы не считать её вручную.
 */
export function msg(line: string, headers: [string, string][], body?: { type: string; text: string }): HttpMessage {
  if (!body) return { line, headers };
  const h2 = !line.includes("HTTP/1");
  const name = (n: string) => (h2 ? n.toLowerCase() : n);
  return {
    line,
    headers: [...headers, [name("Content-Type"), body.type], [name("Content-Length"), String(new TextEncoder().encode(body.text).length)]],
    body: body.text,
  };
}

export const json = (text: string) => ({ type: "application/json", text });
