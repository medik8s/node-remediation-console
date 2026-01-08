import { useRemediationTemplateInstances } from "./useRemediationTemplateInstances";

export function useOperatorAvailability(
  kind: string,
  apiVersion: string
): [boolean, boolean, Error | undefined] {
  const [, loaded, error] = useRemediationTemplateInstances(kind, apiVersion);

  const isAvailable = kind && apiVersion && loaded && !error;

  const errorResult: Error | undefined =
    error instanceof Error ? error : undefined;

  return [isAvailable, loaded, errorResult];
}
