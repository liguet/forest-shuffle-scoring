import { deflate, inflate } from "pako";

export const encode = (data: unknown): string => {
  const compressed = deflate(JSON.stringify(data));
  return btoa(String.fromCharCode(...compressed));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decode = (data: string): any => {
  const compressed = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  return JSON.parse(inflate(compressed, { to: "string" }));
};
