/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import * as React from "react";
import { isPredefinedKind } from "../data/remediationTemplateKinds";

export type RemediationTemplateCRD = {
  kind: string;
  apiVersion: string;
  group: string;
  version: string;
  name: string;
};

/**
 * Checks if a CRD's OpenAPI schema has the spec.template.spec structure
 */
const hasTemplateSpecStructure = (crd: any): boolean => {
  try {
    const versions = crd?.spec?.versions || [];
    for (const crdVersion of versions) {
      const schema = crdVersion?.schema?.openAPIV3Schema;
      if (!schema) continue;

      // Check if schema has spec.template.spec structure
      const spec = schema.properties?.spec;
      if (spec?.properties?.template?.properties?.spec) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Extracts kind and apiVersion from a CRD
 */
const extractCRDInfo = (crd: any): RemediationTemplateCRD | null => {
  try {
    const kind = crd.spec?.names?.kind;
    if (!kind) return null;

    const group = crd.spec?.group || "";
    const versions = crd.spec?.versions || [];
    if (versions.length === 0) return null;

    // Use the first version (or the served version)
    const version =
      versions.find((v: any) => v.served !== false)?.name || versions[0]?.name;
    if (!version) return null;

    const apiVersion = group ? `${group}/${version}` : version;
    const name = crd.metadata?.name || "";

    return {
      kind,
      apiVersion,
      group,
      version,
      name,
    };
  } catch {
    return null;
  }
};

/**
 * Hook to fetch and filter CustomResourceDefinitions that have spec.template.spec structure
 */
export function useRemediationTemplateCRDs(): [
  RemediationTemplateCRD[],
  boolean,
  Error | undefined
] {
  const [crds, loaded, error] = useK8sWatchResource<unknown[]>({
    groupVersionKind: {
      group: "apiextensions.k8s.io",
      version: "v1",
      kind: "CustomResourceDefinition",
    },
    isList: true,
    namespaced: false,
  });

  const filteredCRDs = React.useMemo<RemediationTemplateCRD[]>(() => {
    if (!crds || !loaded || error) return [];

    return crds
      .filter(hasTemplateSpecStructure)
      .map(extractCRDInfo)
      .filter((crd): crd is RemediationTemplateCRD => crd !== null)
      .filter((crd) => !isPredefinedKind(crd.kind))
      .sort((a, b) => {
        // Sort by kind name alphabetically
        return a.kind.localeCompare(b.kind);
      });
  }, [crds, loaded, error]);

  return [filteredCRDs, loaded, error];
}
