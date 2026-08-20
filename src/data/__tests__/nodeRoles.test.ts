import { describe, it, expect } from "vitest";
import { getRoleLabel, getNodeRoles, getNodeRolesText } from "../nodeRoles";

describe("getRoleLabel", () => {
  it("prefixes role with node-role.kubernetes.io/", () => {
    expect(getRoleLabel("worker")).toBe("node-role.kubernetes.io/worker");
  });

  it("works with control-plane", () => {
    expect(getRoleLabel("control-plane")).toBe(
      "node-role.kubernetes.io/control-plane"
    );
  });
});

describe("getNodeRoles", () => {
  it("extracts roles from node labels", () => {
    const node = {
      metadata: {
        labels: {
          "node-role.kubernetes.io/worker": "",
          "node-role.kubernetes.io/infra": "",
          "kubernetes.io/hostname": "node1",
        },
      },
      spec: {},
    };
    expect(getNodeRoles(node)).toEqual(["worker", "infra"]);
  });

  it("maps master to control-plane", () => {
    const node = {
      metadata: {
        labels: {
          "node-role.kubernetes.io/master": "",
        },
      },
      spec: {},
    };
    expect(getNodeRoles(node)).toEqual(["control-plane"]);
  });

  it("returns empty array for node with no role labels", () => {
    const node = {
      metadata: {
        labels: {
          "kubernetes.io/hostname": "node1",
        },
      },
      spec: {},
    };
    expect(getNodeRoles(node)).toEqual([]);
  });

  it("skips empty role suffix", () => {
    const node = {
      metadata: {
        labels: {
          "node-role.kubernetes.io/": "",
        },
      },
      spec: {},
    };
    expect(getNodeRoles(node)).toEqual([]);
  });
});

describe("getNodeRolesText", () => {
  it("joins sorted unique roles", () => {
    const node = {
      metadata: {
        labels: {
          "node-role.kubernetes.io/worker": "",
          "node-role.kubernetes.io/infra": "",
        },
      },
      spec: {},
    };
    expect(getNodeRolesText(node)).toBe("infra, worker");
  });

  it("returns fallback when no roles exist", () => {
    const node = { metadata: { labels: {} }, spec: {} };
    expect(getNodeRolesText(node)).toBe("-");
  });

  it("deduplicates roles", () => {
    const node = {
      metadata: {
        labels: {
          "node-role.kubernetes.io/control-plane": "",
          "node-role.kubernetes.io/master": "",
        },
      },
      spec: {},
    };
    expect(getNodeRolesText(node)).toBe("control-plane");
  });
});
