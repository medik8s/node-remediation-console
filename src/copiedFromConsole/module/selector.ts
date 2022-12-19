import {
  MatchExpression,
  MatchLabels,
  Selector,
} from "@openshift-console/dynamic-plugin-sdk";
import { requirementFromString } from "./selector-requirement";

export const fromRequirements = (requirements: MatchExpression[]): Selector => {
  const matchLabels = {};
  const matchExpressions = [];

  if (requirements.length === 0) {
    return;
  }

  requirements.forEach((r) => {
    if (r.operator === "Equals") {
      matchLabels[r.key] = r.values[0];
    } else {
      matchExpressions.push(r);
    }
  });

  return {
    matchLabels: Object.keys(matchLabels).length ? matchLabels : undefined,
    matchExpressions: matchExpressions.length ? matchExpressions : undefined,
  };
};

export const split = (str: string) =>
  str.trim() ? str.split(/,(?![^(]*\))/) : []; // [''] -> []

export const selectorFromStringArray = (strs: string[]) => {
  const requirements = [];
  for (const str of strs) {
    const requirement = requirementFromString(str);
    if (requirement) {
      requirements.push(requirement);
    }
  }
  return fromRequirements(requirements);
};
const isOldFormat = (selector: Selector | MatchLabels) =>
  !selector.matchLabels && !selector.matchExpressions;

export const createEquals = (key: string, value: string): MatchExpression => ({
  key,
  operator: "Equals",
  values: [value],
});

export const toRequirements = (selector: Selector = {}): MatchExpression[] => {
  const requirements = [];
  const matchLabels = isOldFormat(selector) ? selector : selector.matchLabels;
  const { matchExpressions } = selector;

  Object.keys(matchLabels || {})
    .sort()
    .forEach(function (k) {
      requirements.push(createEquals(k, matchLabels[k]));
    });

  (matchExpressions || []).forEach(function (me) {
    requirements.push(me);
  });

  return requirements;
};

const toArray = (value) => (Array.isArray(value) ? value : [value]);

export const requirementToString = (requirement: MatchExpression): string => {
  if (requirement.operator === "Equals") {
    return `${requirement.key}=${requirement.values[0]}`;
  }

  if (requirement.operator === "NotEquals") {
    return `${requirement.key}!=${requirement.values[0]}`;
  }

  if (requirement.operator === "Exists") {
    return requirement.key;
  }

  if (requirement.operator === "DoesNotExist") {
    return `!${requirement.key}`;
  }

  if (requirement.operator === "In") {
    return `${requirement.key} in (${toArray(requirement.values).join(",")})`;
  }

  if (requirement.operator === "NotIn") {
    return `${requirement.key} notin (${toArray(requirement.values).join(
      ","
    )})`;
  }

  if (requirement.operator === "GreaterThan") {
    return `${requirement.key} > ${requirement.values[0]}`;
  }

  if (requirement.operator === "LessThan") {
    return `${requirement.key} < ${requirement.values[0]}`;
  }

  return "";
};

export const selectorToStringArray = (selector: Selector): string[] => {
  const requirements = toRequirements(selector);
  return requirements.map(requirementToString);
};

export const selectorToString = (selector: Selector): string =>
  selectorToStringArray(selector).join(",");
