import {
  MatchExpression,
  MatchLabels,
  Selector,
} from "@openshift-console/dynamic-plugin-sdk";
import { requirementFromString } from "./selector-requirement";

type Options = { undefinedWhenEmpty?: boolean; basic?: boolean };

export const fromRequirements = (
  requirements: MatchExpression[],
  options = {} as Options
) => {
  options = options || {};
  const selector = {
    matchLabels: {},
    matchExpressions: [],
  };

  if (options.undefinedWhenEmpty && requirements.length === 0) {
    return;
  }

  requirements.forEach((r) => {
    if (r.operator === "Equals") {
      selector.matchLabels[r.key] = r.values[0];
    } else {
      selector.matchExpressions.push(r);
    }
  });

  // old selector format?
  if (options.basic) {
    return selector.matchLabels;
  }

  return selector;
};

export const split = (str: string) =>
  str.trim() ? str.split(/,(?![^(]*\))/) : []; // [''] -> []

export const selectorFromString = (str: string) => {
  const requirements = split(str || "").map(
    requirementFromString
  ) as MatchExpression[];
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

export const selectorToString = (selector: Selector): string => {
  const requirements = toRequirements(selector);
  return requirements.map(requirementToString).join(",");
};
