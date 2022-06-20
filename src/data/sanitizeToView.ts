import * as _ from "lodash";
import { getFormData, getInitialFormData } from "./formData";
import { formDataToNodeHealthCheckSpec } from "./toNodeHealthCheck";
import { NodeHealthCheckFormData, NodeHealthCheck } from "./types";
import { dump } from "js-yaml";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";

export const sanitizeToYaml = (
  formData: NodeHealthCheckFormData,
  existingNodeHealthCheck: NodeHealthCheck
): string => {
  if (formData === null) {
    return dump(existingNodeHealthCheck, "", {
      skipInvalid: true,
    });
  }
  const spec = formDataToNodeHealthCheckSpec(formData);
  const nodeHealthCheckObj = _.merge<{}, NodeHealthCheck, NodeHealthCheck>(
    {},
    initialNodeHealthCheckData,
    {
      ...existingNodeHealthCheck,
      metadata: {
        ...existingNodeHealthCheck?.metadata,
        name: formData.name,
      },
      spec: {
        ...existingNodeHealthCheck?.spec,
        ...spec,
      },
    }
  );
  return dump(nodeHealthCheckObj, "", {
    skipInvalid: true,
  });
};

export const sanitizeToForm = (
  existingFormData: NodeHealthCheckFormData,
  nodeHealthCheck: NodeHealthCheck,
  deleteInvalid: boolean
): NodeHealthCheckFormData => {
  const newFormData = getFormData(nodeHealthCheck, deleteInvalid);
  return _.merge({}, getInitialFormData(), existingFormData, newFormData);
};
