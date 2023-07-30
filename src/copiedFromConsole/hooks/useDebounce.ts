import * as React from "react";
import { debounce } from "lodash-es";

export const useDebounce = (callback: Function, delay: number) => {
  const callbackRef = React.useRef<Function>(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debounced = React.useMemo(() => {
    return debounce((...args) => callbackRef.current(...args), delay);
  }, [delay]);

  return debounced;
};
