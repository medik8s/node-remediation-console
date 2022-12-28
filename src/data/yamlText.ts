import { NodeHealthCheck } from "./types";
import { load } from "js-yaml";

export const getNodeHealthCheck = (
  originalNodeHealthCheck: NodeHealthCheck,
  yamlText: string
): NodeHealthCheck => {
  try {
    let nodeHealthCheckYaml = load(yamlText) as NodeHealthCheck;
    return {
      ...originalNodeHealthCheck,
      metadata: nodeHealthCheckYaml.metadata,
      spec: nodeHealthCheckYaml.spec,
    };
  } catch (err) {
    return originalNodeHealthCheck;
  }
};
