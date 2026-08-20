import { describe, it, expect } from "vitest";
import {
  getEmptyRemediationTemplate,
  getSortedRemediators,
  isRemediationTemplateSelected,
} from "../remediator";
import {
  getKindInfo,
  isPredefinedKind,
  getOperatorDetailsItem,
  PREDEFINED_REMEDIATION_TEMPLATE_KINDS,
} from "../remediationTemplateKinds";

describe("getEmptyRemediationTemplate", () => {
  it("returns template with all empty strings", () => {
    const template = getEmptyRemediationTemplate();
    expect(template).toEqual({
      apiVersion: "",
      kind: "",
      name: "",
      namespace: "",
    });
  });
});

describe("getSortedRemediators", () => {
  it("sorts by order ascending", () => {
    const remediators = [
      {
        order: 3,
        remediationTemplate: {
          apiVersion: "",
          kind: "",
          name: "c",
          namespace: "",
        },
      },
      {
        order: 1,
        remediationTemplate: {
          apiVersion: "",
          kind: "",
          name: "a",
          namespace: "",
        },
      },
      {
        order: 2,
        remediationTemplate: {
          apiVersion: "",
          kind: "",
          name: "b",
          namespace: "",
        },
      },
    ];
    const sorted = getSortedRemediators(remediators);
    expect(sorted.map((r) => r.remediationTemplate.name)).toEqual([
      "a",
      "b",
      "c",
    ]);
  });

  it("does not mutate original array", () => {
    const remediators = [
      {
        order: 2,
        remediationTemplate: {
          apiVersion: "",
          kind: "",
          name: "b",
          namespace: "",
        },
      },
      {
        order: 1,
        remediationTemplate: {
          apiVersion: "",
          kind: "",
          name: "a",
          namespace: "",
        },
      },
    ];
    getSortedRemediators(remediators);
    expect(remediators[0].remediationTemplate.name).toBe("b");
  });
});

describe("isRemediationTemplateSelected", () => {
  it("returns true when template has name", () => {
    expect(
      isRemediationTemplateSelected({
        apiVersion: "v1",
        kind: "SNRTemplate",
        name: "self-node-remediation-automatic-strategy-template",
        namespace: "openshift-operators",
      })
    ).toBe(true);
  });

  it("returns false when template has empty name", () => {
    expect(
      isRemediationTemplateSelected({
        apiVersion: "v1",
        kind: "SNRTemplate",
        name: "",
        namespace: "",
      })
    ).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isRemediationTemplateSelected(undefined)).toBe(false);
  });
});

describe("remediationTemplateKinds", () => {
  it("has three predefined kinds", () => {
    expect(PREDEFINED_REMEDIATION_TEMPLATE_KINDS).toHaveLength(3);
    expect(PREDEFINED_REMEDIATION_TEMPLATE_KINDS).toContain(
      "SelfNodeRemediationTemplate"
    );
    expect(PREDEFINED_REMEDIATION_TEMPLATE_KINDS).toContain(
      "FenceAgentsRemediationTemplate"
    );
    expect(PREDEFINED_REMEDIATION_TEMPLATE_KINDS).toContain(
      "MachineDeletionRemediationTemplate"
    );
  });

  it("getKindInfo returns info for predefined kinds", () => {
    const info = getKindInfo("SelfNodeRemediationTemplate");
    expect(info).toBeDefined();
    expect(info.groupVersionKind.group).toBe(
      "self-node-remediation.medik8s.io"
    );
    expect(info.groupVersionKind.version).toBe("v1alpha1");
  });

  it("getKindInfo returns undefined for unknown kinds", () => {
    expect(getKindInfo("UnknownTemplate")).toBeUndefined();
  });

  it("isPredefinedKind identifies known kinds", () => {
    expect(isPredefinedKind("SelfNodeRemediationTemplate")).toBe(true);
    expect(isPredefinedKind("UnknownTemplate")).toBe(false);
  });

  it("getOperatorDetailsItem builds correct string", () => {
    const info = getKindInfo("SelfNodeRemediationTemplate");
    expect(getOperatorDetailsItem(info)).toBe(
      "self-node-remediation-redhat-operators-openshift-marketplace"
    );
  });
});
