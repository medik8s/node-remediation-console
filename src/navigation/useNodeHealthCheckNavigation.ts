import { nodeHealthCheckStringKind } from "data/model";
import { useHistory } from "react-router";

export type NavigationApi = {
  gotoList(): void;
  gotoDetails(name: string): void;
  gotoEditor(name: string): void;
  goBack(): void;
  getNodeHealthCheckUrl(name?: string): string;
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
  };
};
