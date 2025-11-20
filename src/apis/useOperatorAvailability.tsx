import * as React from "react";
import { useRemediationTemplateInstances } from "./useRemediationTemplateInstances";

export function useOperatorAvailability(
  kind: string,
  apiVersion: string
): [boolean, boolean, Error | undefined] {
  const [, loaded, error] = useRemediationTemplateInstances(kind, apiVersion);

  const isAvailable = React.useMemo(() => {
    if (!kind || !apiVersion || !loaded) return false;
    if (error) return false;
    // If we can watch the resource, the operator is installed
    return true;
  }, [kind, apiVersion, loaded, error]);

  const errorResult: Error | undefined =
    error instanceof Error ? error : undefined;

  return [isAvailable, loaded, errorResult];
}
