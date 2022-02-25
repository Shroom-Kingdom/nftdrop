import { DependencyList, useCallback, useRef } from "react";

export function removeQueryParams(): void {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, document.title, url.toString());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  debounceTime: number,
  deps: DependencyList
): () => void {
  const timeout = useRef<number | null>(null);
  return useCallback(() => {
    if (timeout.current != null) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }
    timeout.current = window.setTimeout(() => {
      timeout.current = null;
      callback();
    }, debounceTime) as unknown as number;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
