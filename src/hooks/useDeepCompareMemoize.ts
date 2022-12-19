import * as React from "react";
import { isEqual } from "lodash-es";

const useDeepCompareMemoize = <T>(value: T): T => {
  const ref = React.useRef<T>(value);

  React.useEffect(() => {
    if (!isEqual(value, ref.current)) {
      ref.current = value;
    }
  }, [value]);

  return ref.current;
};

export default useDeepCompareMemoize;
