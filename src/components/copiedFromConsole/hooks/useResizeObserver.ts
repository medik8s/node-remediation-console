import * as React from "react";

interface ResizeObserverObserveOptions {
  /**
   * Sets which box model the observer will observe changes to. Possible values
   * are `content-box` (the default), and `border-box`.
   *
   * @default "content-box"
   */
  box?: "content-box" | "border-box";
}

export const useResizeObserver = (
  callback: ResizeObserverCallback,
  targetElement?: HTMLElement | null,
  observerOptions: ResizeObserverObserveOptions = undefined
): void => {
  const element = React.useMemo(
    () => targetElement ?? document.querySelector("body"),
    [targetElement]
  );
  React.useEffect(() => {
    const observer = new ResizeObserver(callback);
    observer.observe(element, observerOptions);
    return () => {
      observer.disconnect();
    };
  }, [callback, observerOptions, element]);
};
