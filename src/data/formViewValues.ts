import {
  selectorFromStringArray,
  selectorToStringArray,
} from "copiedFromConsole/module/selector";
import { defaultUnhealthyConditions, DEFAULT_MIN_HEALTHY } from "./defaults";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getSortedRemediators } from "./remediator";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  FormViewValues,
  RemediationTemplate,
  Remediator,
  NodeHealthCheckSpec,
  EscalatingRemediator,
} from "./types";
import { HEALTH_THRESHOLD_REGEX } from "./validationSchema";

const getRemediationTemplateFormValues = (
  template?: RemediationTemplate,
  timeout?: string,
  order?: number
): Remediator | undefined => {
  if (!template) {
    return undefined;
  }
  return {
    template,
    timeout,
    order: order ?? "",
    id: Math.random(),
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

const getescalatingRemediationsFormValues = (
  escalatingRemediations?: EscalatingRemediator[]
): Remediator[] => {
  if (!escalatingRemediations) return [];
  const sortedescalatingRemediations = getSortedRemediators(
    escalatingRemediations
  );
  return sortedescalatingRemediations.map((remediator) => {
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
  const useEscalating = !!nodeHealthCheck.spec?.escalatingRemediations;
  const spec = nodeHealthCheck.spec;

  // Determine mode and value based on existing spec
  let healthThresholdMode: "minHealthy" | "maxUnhealthy";
  let healthThresholdValue: string;

  if (spec?.maxUnhealthy !== undefined) {
    healthThresholdMode = "maxUnhealthy";
    healthThresholdValue = spec.maxUnhealthy.toString();
  } else {
    healthThresholdMode = "minHealthy";
    healthThresholdValue = (spec?.minHealthy ?? DEFAULT_MIN_HEALTHY).toString();
  }
  return {
    name: nodeHealthCheck.metadata?.name,
    nodeSelector: selectorToStringArray(spec?.selector || {}),
    healthThresholdMode,
    healthThresholdValue,
    unhealthyConditions: getUnhealthyConditionsValue(nodeHealthCheck),
    remediator: !useEscalating
      ? getRemediationTemplateFormValues(
          nodeHealthCheck?.spec?.remediationTemplate
        )
      : undefined,
    escalatingRemediations: getescalatingRemediationsFormValues(
      nodeHealthCheck.spec?.escalatingRemediations
    ),
    useEscalating: !!nodeHealthCheck.spec?.escalatingRemediations,
  };
};

export const getNodeHealthCheckThresholdValue = (
  thresholdValue: string
): string | number => {
  let thresholdVal: string | number = thresholdValue;
  if (
    thresholdValue &&
    thresholdValue.match(HEALTH_THRESHOLD_REGEX) &&
    !thresholdValue.endsWith("%")
  ) {
    thresholdVal = parseInt(thresholdValue);
  }
  return thresholdVal;
};

export const getSpec = (
  formViewFields: FormViewValues
): NodeHealthCheckSpec => {
  const {
    nodeSelector,
    healthThresholdMode,
    healthThresholdValue,
    unhealthyConditions,
  } = formViewFields;

  const thresholdValue = getNodeHealthCheckThresholdValue(healthThresholdValue);

  const spec: NodeHealthCheckSpec = {
    selector: selectorFromStringArray(nodeSelector),
    unhealthyConditions,
    remediationTemplate: !formViewFields.useEscalating
      ? formViewFields.remediator?.template
      : undefined,
    escalatingRemediations: formViewFields.useEscalating
      ? formViewFields.escalatingRemediations?.map((remediator) => ({
          remediationTemplate: remediator.template,
          order: remediator.order === "" ? undefined : remediator.order,
          timeout: remediator.timeout,
        }))
      : undefined,
  };

  // Only include the threshold field matching the selected mode
  if (healthThresholdMode === "minHealthy") {
    spec.minHealthy = thresholdValue;
  } else {
    spec.maxUnhealthy = thresholdValue;
  }

  return spec;
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

  // Explicitly remove the opposite threshold field to ensure mutual exclusivity
  if (formViewValues.healthThresholdMode === "minHealthy") {
    delete merged.spec.maxUnhealthy;
  } else {
    delete merged.spec.minHealthy;
  }

  return merged;
};
