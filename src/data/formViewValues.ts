import {
  selectorFromStringArray,
  selectorToStringArray,
} from "copiedFromConsole/module/selector";
import { defaultUnhealthyConditions, DEFAULT_MIN_HEALTHY } from "./defaults";
import { snrTemplateKind } from "./model";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getEmptyRemediationTemplate } from "./remediator";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  FormViewValues,
  RemediatorRadioOption,
} from "./types";
import { MIN_HEALTHY_REGEX } from "./validationSchema";

export const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?)(ns|us|µs|ms|s|m|h)$/;

const getUnhealthyConditionsValue = (
  nodeHealthCheck: NodeHealthCheck
): UnhealthyCondition[] => {
  try {
    return nodeHealthCheck.spec?.unhealthyConditions &&
      nodeHealthCheck.spec.unhealthyConditions.length > 0
      ? nodeHealthCheck.spec?.unhealthyConditions
      : defaultUnhealthyConditions;
  } catch (err) {
    throwParseError(
      ParseErrorCode.INVALID_UNHEALTHY_CONDITIONS,
      "Unhealthy conditions field isn't an array"
    );
  }
};

export const getFormViewValues = (
  nodeHealthCheck: NodeHealthCheck
): FormViewValues => {
  const remediationTemplate =
    nodeHealthCheck.spec?.remediationTemplate || getEmptyRemediationTemplate();
  return {
    name: nodeHealthCheck.metadata?.name,
    nodeSelector: selectorToStringArray(nodeHealthCheck.spec?.selector || {}),
    minHealthy: (
      nodeHealthCheck.spec?.minHealthy ?? DEFAULT_MIN_HEALTHY
    ).toString(),
    unhealthyConditions: getUnhealthyConditionsValue(nodeHealthCheck),
    remediator: {
      radioOption:
        remediationTemplate.kind === snrTemplateKind.kind
          ? RemediatorRadioOption.SNR
          : RemediatorRadioOption.CUSTOM,
      template: remediationTemplate,
    },
  };
};

export const getNodeHealthCheckMinHealthy = (minHealthy: string) => {
  let minHealthyVal: string | number = minHealthy;
  if (
    minHealthy &&
    minHealthy.match(MIN_HEALTHY_REGEX) &&
    !minHealthy.endsWith("%")
  ) {
    minHealthyVal = parseInt(minHealthy);
  }
  return minHealthyVal;
};

export const getSpec = (formViewFields: FormViewValues) => {
  const { nodeSelector, minHealthy, unhealthyConditions } = formViewFields;

  return {
    selector: selectorFromStringArray(nodeSelector),
    unhealthyConditions,
    minHealthy: getNodeHealthCheckMinHealthy(minHealthy),
    remediationTemplate: formViewFields.remediator.template,
  };
};

export const getNodeHealthCheck = (
  formViewValues: FormViewValues,
  yamlNodeHealthCheck: NodeHealthCheck
): NodeHealthCheck => {
  const formViewSpec = getSpec(formViewValues);
  const merged = {
    ...yamlNodeHealthCheck,
    metadata: {
      ...yamlNodeHealthCheck.metadata,
      name: formViewValues.name,
    },
    spec: {
      ...yamlNodeHealthCheck.spec,
      ...formViewSpec,
    },
  };
  return merged;
};
