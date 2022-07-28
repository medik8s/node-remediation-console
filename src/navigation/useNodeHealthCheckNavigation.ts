import { nodeHealthCheckStringKind } from "data/model";
import { useHistory } from "react-router";

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
  const history = useHistory();
  return {
    getNodeHealthCheckUrl,
    gotoList: () => history.push(getNodeHealthCheckUrl()),
    gotoDetails: (name: string) => history.push(getNodeHealthCheckUrl(name)),
    gotoEditor: (name: string) =>
      history.push(`${getNodeHealthCheckUrl(name)}/edit`),
    goBack: history.goBack,
    gotoMachineHealthChecks: () => history.push(MACHINE_HEALTHCHECKS_URL),
  };
};
