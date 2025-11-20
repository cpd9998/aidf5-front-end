import { useRef, useCallback } from "react";

export const useDebounce = (callback, delay = 300) => {
  const timeoutRef = useRef(null);

  const debouncedFn = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },

    [callback, delay]
  );

  return debouncedFn;
};
