import {
  K8sResourceCommon,
  useK8sWatchResource,
} from "@openshift-console/dynamic-plugin-sdk";
import * as React from "react";
import { RemediationTemplate } from "../data/types";
import { apiVersionToGroupVersionKind } from "../data/model";

export function useRemediationTemplateInstances(
  kind: string,
  apiVersion: string
): [RemediationTemplate[], boolean, unknown, RemediationTemplate | undefined] {
  const groupVersionKind = React.useMemo(
    () => apiVersionToGroupVersionKind(apiVersion, kind),
    [apiVersion, kind]
  );

  const [resources, loaded, error] = useK8sWatchResource<K8sResourceCommon[]>({
    groupVersionKind,
    isList: true,
    namespaced: true,
  });
  const instances = React.useMemo<RemediationTemplate[]>(() => {
    if (!resources || !kind) return [];
    return resources.map((resource) => ({
      apiVersion: resource.apiVersion,
      kind: resource.kind,
      name: resource.metadata?.name || "",
      namespace: resource.metadata?.namespace || "",
    }));
  }, [resources, kind]);

  const autoSelectInstance = React.useMemo<
    RemediationTemplate | undefined
  >(() => {
    if (instances.length === 1) {
      return instances[0];
    }
    return undefined;
  }, [instances]);

  return [instances, loaded, error, autoSelectInstance];
}
