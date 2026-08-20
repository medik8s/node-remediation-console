import { describe, it, expect } from "vitest";
import {
  getStringKind,
  getApiVersion,
  parseApiVersion,
  apiVersionToGroupVersionKind,
  getCreateInstanceUrl,
  nodeHealthCheckKind,
  nodeHealthCheckStringKind,
  NodeHealthCheckModel,
  getNodeHealthCheckApiVersion,
  nodeKind,
} from "../model";

describe("getStringKind", () => {
  it("joins group, version, and kind with tildes", () => {
    expect(
      getStringKind({ group: "apps", version: "v1", kind: "Deployment" })
    ).toBe("apps~v1~Deployment");
  });

  it("handles empty group", () => {
    expect(getStringKind({ group: "", version: "v1", kind: "Pod" })).toBe(
      "~v1~Pod"
    );
  });
});

describe("getApiVersion", () => {
  it("joins group and version with slash", () => {
    expect(
      getApiVersion({ group: "apps", version: "v1", kind: "Deployment" })
    ).toBe("apps/v1");
  });
});

describe("parseApiVersion", () => {
  it("parses valid apiVersion", () => {
    expect(parseApiVersion("apps/v1")).toEqual({
      group: "apps",
      version: "v1",
    });
  });

  it("returns undefined for empty string", () => {
    expect(parseApiVersion("")).toBeUndefined();
  });

  it("parses a core-group apiVersion", () => {
    expect(parseApiVersion("v1")).toEqual({ group: "", version: "v1" });
  });

  it("returns undefined for string with multiple slashes", () => {
    expect(parseApiVersion("a/b/c")).toBeUndefined();
  });

  it("returns undefined for slash-only parts", () => {
    expect(parseApiVersion("/v1")).toBeUndefined();
    expect(parseApiVersion("apps/")).toBeUndefined();
  });
});

describe("apiVersionToGroupVersionKind", () => {
  it("converts valid apiVersion and kind", () => {
    expect(apiVersionToGroupVersionKind("apps/v1", "Deployment")).toEqual({
      group: "apps",
      version: "v1",
      kind: "Deployment",
    });
  });

  it("returns undefined for empty apiVersion", () => {
    expect(apiVersionToGroupVersionKind("", "Pod")).toBeUndefined();
  });

  it("returns undefined for empty kind", () => {
    expect(apiVersionToGroupVersionKind("apps/v1", "")).toBeUndefined();
  });

  it("converts core-group apiVersion", () => {
    expect(apiVersionToGroupVersionKind("v1", "Pod")).toEqual({
      group: "",
      version: "v1",
      kind: "Pod",
    });
  });
});

describe("getCreateInstanceUrl", () => {
  it("builds correct URL", () => {
    expect(getCreateInstanceUrl("apps/v1", "Deployment")).toBe(
      "/k8s/cluster/apps~v1~Deployment/~new"
    );
  });

  it("returns undefined for empty inputs", () => {
    expect(getCreateInstanceUrl("", "Pod")).toBeUndefined();
    expect(getCreateInstanceUrl("apps/v1", "")).toBeUndefined();
  });
});

describe("NHC constants", () => {
  it("nodeHealthCheckKind has correct values", () => {
    expect(nodeHealthCheckKind).toEqual({
      kind: "NodeHealthCheck",
      group: "remediation.medik8s.io",
      version: "v1alpha1",
    });
  });

  it("nodeHealthCheckStringKind is derived correctly", () => {
    expect(nodeHealthCheckStringKind).toBe(
      "remediation.medik8s.io~v1alpha1~NodeHealthCheck"
    );
  });

  it("nodeKind has correct values", () => {
    expect(nodeKind).toEqual({ kind: "Node", version: "v1" });
  });

  it("NodeHealthCheckModel is consistent with nodeHealthCheckKind", () => {
    expect(NodeHealthCheckModel.kind).toBe(nodeHealthCheckKind.kind);
    expect(NodeHealthCheckModel.apiGroup).toBe(nodeHealthCheckKind.group);
    expect(NodeHealthCheckModel.apiVersion).toBe(nodeHealthCheckKind.version);
    expect(NodeHealthCheckModel.namespaced).toBe(false);
    expect(NodeHealthCheckModel.plural).toBe("nodehealthchecks");
  });

  it("getNodeHealthCheckApiVersion returns correct string", () => {
    expect(getNodeHealthCheckApiVersion()).toBe(
      "remediation.medik8s.io/v1alpha1"
    );
  });
});
