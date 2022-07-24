import * as _ from "lodash";
import {
  formDataToNodeHealthCheck,
  yamlTextToNodeHealthCheck,
} from "./toNodeHealthCheck";
import { NodeHealthCheckFormData, NodeHealthCheck } from "./types";
import { dump } from "js-yaml";

export const toYamlText = (
  formData: NodeHealthCheckFormData,
  existingNodeHealthCheck: NodeHealthCheck,
  yamlText: string
): string => {
  const yamlNodeHealthCheck = yamlTextToNodeHealthCheck(
    existingNodeHealthCheck,
    yamlText
  );
  return dump(formDataToNodeHealthCheck(formData, yamlNodeHealthCheck), "", {
    skipInvalid: true,
  });
};
