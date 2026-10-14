const noop = () => undefined;
const chain: unknown = new Proxy(noop, { get: () => chain, apply: () => chain });

export const expect = chain as (value: unknown) => never;
export const userEvent = chain as Record<string, (...args: unknown[]) => Promise<void>>;
export const waitFor = async (callback: () => unknown) => callback;
export const within = (_element: unknown) => chain as Record<string, (...args: unknown[]) => never>;
export const screen = chain as Record<string, (...args: unknown[]) => never>;
export const fn = () => noop;
