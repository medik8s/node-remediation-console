import { NodeHealthCheck } from "./types";
import { load } from "js-yaml";

export const getNodeHealthCheck = (
  originalNodeHealthCheck: NodeHealthCheck,
  yamlText: string
): NodeHealthCheck => {
  let nodeHealthCheckYaml = load(yamlText) as NodeHealthCheck;
  let nodeHealthCheck = {
    ...originalNodeHealthCheck,
    metadata: nodeHealthCheckYaml.metadata,
    spec: nodeHealthCheckYaml.spec,
  };
  return nodeHealthCheck;
};
