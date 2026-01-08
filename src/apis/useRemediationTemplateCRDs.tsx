import {
  K8sResourceCommon,
  useK8sWatchResource,
} from "@openshift-console/dynamic-plugin-sdk";
import * as React from "react";
import { isPredefinedKind } from "../data/remediationTemplateKinds";
import { getApiVersion } from "../data/model";

type CrdInfo = {
  kind: string;
  apiVersion: string;
};

type OpenAPIV3Schema = {
  properties?: Record<string, OpenAPIV3Schema>;
  type?: string;
};

type CRDVersion = {
  name: string;
  served: boolean;
  schema?: {
    openAPIV3Schema?: OpenAPIV3Schema;
  };
};

type CRDSpec = {
  versions: CRDVersion[];
  names: {
    kind: string;
  };
  scope: "Cluster" | "Namespaced";
  group: string;
};

type CustomResourceDefinition = K8sResourceCommon & {
  spec?: CRDSpec;
};

const hasTemplateSpecStructure = (version: CRDVersion): boolean => {
  try {
    const schema = version.schema?.openAPIV3Schema;
    if (!schema) return false;
    const spec = schema.properties?.spec;
    return spec?.properties?.template?.properties?.spec !== undefined;
  } catch {
    return false;
  }
};

// Get kind and apiVersion for custom remediation template CRDs, if the CRD is not a custom remediation template CRD, return undefined
const getCustomRemediationTemplateCrdInfo = (
  crd: CustomResourceDefinition
): CrdInfo | undefined => {
  try {
    const kind = crd.spec.names.kind;
    if (!kind || isPredefinedKind(kind) || crd.spec.scope === "Cluster")
      return undefined;
    const versions = crd.spec.versions;
    if (versions.length === 0) return undefined;
    const version = versions.find((v) => !!v.served) || versions[0];
    if (!version) return undefined;
    if (!hasTemplateSpecStructure(version)) return undefined;
    return {
      kind,
      apiVersion: getApiVersion({
        kind: kind,
        group: crd.spec.group,
        version: version.name,
      }),
    };
  } catch {
    return undefined;
  }
};

/**
 * Hook to fetch and filter CustomResourceDefinitions that are cluster scoped, not predefined and have spec.template.spec structure
 */
export function useRemediationTemplateCRDs(): [CrdInfo[], boolean, unknown] {
  const [crds, loaded, error] = useK8sWatchResource<CustomResourceDefinition[]>(
    {
      groupVersionKind: {
        group: "apiextensions.k8s.io",
        version: "v1",
        kind: "CustomResourceDefinition",
      },
      isList: true,
    }
  );

  const filteredCRDs = React.useMemo<
    { kind: string; apiVersion: string }[]
  >(() => {
    if (!crds || !loaded || error) return [];

    return crds
      .reduce<CrdInfo[]>((acc, crd) => {
        const info = getCustomRemediationTemplateCrdInfo(crd);
        if (!info) return acc;
        return [...acc, info];
      }, [])
      .sort((a, b) => {
        return a.kind.localeCompare(b.kind);
      });
  }, [crds, loaded, error]);

  return [filteredCRDs, loaded, error];
}
