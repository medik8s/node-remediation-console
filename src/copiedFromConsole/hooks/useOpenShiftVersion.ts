import {
  useK8sWatchResource,
  WatchK8sResource,
} from "@openshift-console/dynamic-plugin-sdk";
import { ClusterVersionKind } from "copiedFromConsole/types/clusterVersion";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as semver from "semver";

const useClusterVersion = () => {
  const resource: WatchK8sResource = {
    groupVersionKind: {
      group: "config.openshift.io",
      version: "v1",
      kind: "ClusterVersion",
    },
    name: "version",
    namespaced: false,
  };

  return useK8sWatchResource<ClusterVersionKind>(resource);
};

export const useOpenShiftVersion = (): [string, boolean, unknown] => {
  const { t } = useNodeHealthCheckTranslation();
  const [clusterVersion, loaded, error] = useClusterVersion();
  if (!loaded) {
    return [null, loaded, null];
  }
  if (error) {
    return [null, true, error];
  }
  const version = clusterVersion?.status?.history?.[0]?.version;
  if (!version) {
    return [
      null,
      false,
      `${t(
        "Failed to retreive the OCP version from the ClusterVersion resorce"
      )} ${version}`,
    ];
  }
  const parsed = semver.parse(version);
  if (!parsed) {
    return [null, false, `${t("Failed to parse version")} ${version}`];
  }
  const majorMinor = `${parsed.major}.${parsed.minor}`;
  return [majorMinor, true, null];
};
