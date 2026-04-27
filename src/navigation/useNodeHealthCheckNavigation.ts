import { nodeHealthCheckStringKind } from "data/model";
import * as React from "react";
import { useNavigate } from "react-router";

const MACHINE_HEALTHCHECKS_URL =
  "/k8s/ns/openshift-machine-api/machine.openshift.io~v1beta1~MachineHealthCheck";

export type NavigationApi = {
  gotoList(): void;
  gotoDetails(name: string): void;
  gotoEditor(name: string): void;
  goBack(): void;
  getNodeHealthCheckUrl(name?: string): string;
  gotoMachineHealthChecks(): void;
};

const getNodeHealthCheckUrl = (name?: string) => {
  const path = `/k8s/cluster/${nodeHealthCheckStringKind}`;
  if (name) {
    return `${path}/${name}`;
  }
  return path;
};

export const useNodeHealthCheckNavigation = (): NavigationApi => {
  const navigate = useNavigate();
  return React.useMemo(
    () => ({
      getNodeHealthCheckUrl,
      gotoList: () => navigate(getNodeHealthCheckUrl()),
      gotoDetails: (name: string) => navigate(getNodeHealthCheckUrl(name)),
      gotoEditor: (name: string) =>
        navigate(`${getNodeHealthCheckUrl(name)}/edit`),
      goBack: () => navigate(-1),
      gotoMachineHealthChecks: () => navigate(MACHINE_HEALTHCHECKS_URL),
    }),
    [navigate]
  );
};
