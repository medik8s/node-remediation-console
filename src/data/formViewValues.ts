import {
  selectorFromStringArray,
  selectorToStringArray,
} from "copiedFromConsole/module/selector";
import { defaultUnhealthyConditions, DEFAULT_MIN_HEALTHY } from "./defaults";
import { snrTemplateKind } from "./model";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  FormViewValues,
  RemediatorRadioOption,
  RemediationTemplate,
  Remediator,
  NodeHealthCheckSpec,
  EscalatingRemediator,
} from "./types";
import { MIN_HEALTHY_REGEX } from "./validationSchema";

const getRemediationTemplateFormValues = (
  template?: RemediationTemplate,
  timeout?: string,
  order?: number
): Remediator | undefined => {
  if (!template) {
    return undefined;
  }
  const radioOption =
    template.kind === snrTemplateKind.kind
      ? RemediatorRadioOption.SNR
      : RemediatorRadioOption.CUSTOM;
  return {
    radioOption,
    template,
    timeout,
    order,
  };
};

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

const getEscalatingRemediatorsFormValues = (
  escalatingRemediators?: EscalatingRemediator[]
): Remediator[] => {
  if (!escalatingRemediators) return [];
  const sortedEscalatingRemediators = escalatingRemediators.sort(
    (remediator1, remediator2) => remediator1.order - remediator2.order
  );
  return sortedEscalatingRemediators.map((remediator) => {
    return getRemediationTemplateFormValues(
      remediator.remediationTemplate,
      remediator.timeout,
      remediator.order
    );
  });
};

export const getFormViewValues = (
  nodeHealthCheck: NodeHealthCheck
): FormViewValues => {
  const useEscalating = !!nodeHealthCheck.spec?.escalatingRemediators;
  return {
    name: nodeHealthCheck.metadata?.name,
    nodeSelector: selectorToStringArray(nodeHealthCheck.spec?.selector || {}),
    minHealthy: (
      nodeHealthCheck.spec?.minHealthy ?? DEFAULT_MIN_HEALTHY
    ).toString(),
    unhealthyConditions: getUnhealthyConditionsValue(nodeHealthCheck),
    remediator: !useEscalating ? getRemediationTemplateFormValues() : undefined,
    escalatingRemediators: getEscalatingRemediatorsFormValues(
      nodeHealthCheck.spec?.escalatingRemediators
    ),
    useEscalating: !!nodeHealthCheck.spec?.escalatingRemediators,
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

export const getSpec = (
  formViewFields: FormViewValues
): NodeHealthCheckSpec => {
  const { nodeSelector, minHealthy, unhealthyConditions } = formViewFields;
  return {
    selector: selectorFromStringArray(nodeSelector),
    unhealthyConditions,
    minHealthy: getNodeHealthCheckMinHealthy(minHealthy),
    remediationTemplate: !formViewFields.useEscalating
      ? formViewFields.remediator?.template
      : undefined,
    escalatingRemediators: formViewFields.useEscalating
      ? formViewFields.escalatingRemediators?.map((remediator, _index) => ({
          remediationTemplate: remediator.template,
          order: remediator.order,
          timeout: remediator.timeout,
        }))
      : undefined,
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
