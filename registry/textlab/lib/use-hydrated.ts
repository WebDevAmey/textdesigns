import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;

/** False during server render and hydration, true after. Never causes a mismatch. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, client, server);
}
