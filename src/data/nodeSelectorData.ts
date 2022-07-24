import {
  K8sResourceCommon,
  MatchLabels,
} from "@openshift-console/dynamic-plugin-sdk";
import * as _ from "lodash";
import { isParseError, ParseErrorCode, throwParseError } from "./parseErrors";
import {
  MatchExpression,
  MatchExpressionOperator,
  NodeSelector,
} from "./types";

const LABEL_DISPLAY_NAME_SEPARATOR = "=";

export const getLabelDisplayName = (key: string, value: string) => {
  if (!value) {
    return key;
  }
  return `${key}${LABEL_DISPLAY_NAME_SEPARATOR}${value}`;
};

const getMatchExpressionLabelDisplayNames = (
  matchExpressions: MatchExpression[] | undefined
): string[] => {
  if (!matchExpressions) {
    return [];
  }
  const ret: string[] = [];
  for (const expression of matchExpressions) {
    if (expression.operator === MatchExpressionOperator.Exists) {
      ret.push(expression.key);
    } else {
      continue;
    }
  }
  return ret;
};

const getMatchLabelsDisplayNames = (matchLabels: MatchLabels | undefined) => {
  if (!matchLabels) {
    return [];
  }
  return Object.entries(matchLabels).map(([key, value]) =>
    getLabelDisplayName(key, value)
  );
};

export const getNodeSelectorLabelDisplayNames = (
  selector: NodeSelector,
  deleteInvalid: boolean
): string[] => {
  try {
    return [
      ...getMatchLabelsDisplayNames(selector.matchLabels),
      ...getMatchExpressionLabelDisplayNames(selector.matchExpressions),
    ];
  } catch (err) {
    if (deleteInvalid) {
      return [];
    }
    if (isParseError(err)) {
      throw err;
    }
    throwParseError(
      ParseErrorCode.INVALID_NODE_SELECTOR,
      "Failed to parse node selector"
    );
  }
};

export const getNodeSelector = (
  labelDisplayNames: string[]
): NodeSelector | undefined => {
  if (labelDisplayNames.length === 0) {
    return undefined;
  }
  const matchExpressions: MatchExpression[] = [];
  const matchLabels: MatchLabels = {};
  for (const labelDisplayName of labelDisplayNames) {
    const [key, value] = labelDisplayName.split(LABEL_DISPLAY_NAME_SEPARATOR);
    if (!value) {
      matchExpressions.push({
        operator: MatchExpressionOperator.Exists,
        key,
      });
    } else {
      matchLabels[key] = value;
    }
  }
  return { matchLabels, matchExpressions };
};

export const getObjectLabelDisplayNames = (object: K8sResourceCommon) => {
  if (object.metadata?.labels)
    return Object.entries(object.metadata?.labels).map(([key, value]) =>
      getLabelDisplayName(key, value)
    );
  return [];
};
