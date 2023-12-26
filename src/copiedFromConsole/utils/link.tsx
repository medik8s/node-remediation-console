import * as React from "react";
import Linkify from "react-linkify";
const ALL_NAMESPACES_KEY = "#ALL_NS#";
// Kubernetes "dns-friendly" names match
// [a-z0-9]([-a-z0-9]*[a-z0-9])?  and are 63 or fewer characters
// long. This pattern checks the pattern but not the length.
//
// Don't capture anything in legalNamePattern, since it's used
// in expressions like
//
//    new RegExp("PREFIX" + legalNamePattern.source + "(SUFFIX)")
//
// And it's ok for users to make assumptions about capturing groups.

export const legalNamePattern = /[a-z0-9](?:[-a-z0-9]*[a-z0-9])?/;

const basePathPattern = new RegExp(`^/?${window.SERVER_FLAGS.basePath}`);

export const namespacedPrefixes = [
  "/api-resource",
  "/k8s",
  "/operatorhub",
  "/operatormanagement",
  "/operators",
  "/details",
  "/search",
  "/status",
];

export const stripBasePath = (path: string): string =>
  path.replace(basePathPattern, "/");

export const getNamespace = (path: string): string => {
  path = stripBasePath(path);
  const split = path.split("/").filter((x) => x);

  if (split[1] === "all-namespaces") {
    return ALL_NAMESPACES_KEY;
  }

  let ns: string;
  if (
    split[1] === "cluster" &&
    ["namespaces", "projects"].includes(split[2]) &&
    split[3]
  ) {
    ns = split[3];
  } else if (split[1] === "ns" && split[2]) {
    ns = split[2];
  } else {
    return;
  }

  const match = ns.match(legalNamePattern);
  return match && match.length > 0 && match[0];
};

export const getURLSearchParams = () => {
  const all: unknown = {};
  const params = new URLSearchParams(window.location.search);
  params.forEach((v, k) => {
    all[k] = v;
  });

  return all;
};

// Open links in a new window and set noopener/noreferrer.
export const LinkifyExternal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Linkify properties={{ target: "_blank", rel: "noopener noreferrer" }}>
    {children}
  </Linkify>
);
LinkifyExternal.displayName = "LinkifyExternal";
