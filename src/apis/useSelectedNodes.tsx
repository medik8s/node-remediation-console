import {
  useK8sWatchResource,
  WatchK8sResource,
} from "@openshift-console/dynamic-plugin-sdk";
import { selectorFromStringArray } from "copiedFromConsole/module/selector";
import { NodeKind } from "copiedFromConsole/types/node";
import { nodeKind } from "data/model";

const useSelectedNodes = (selectedLabels: string[]) => {
  const resource: WatchK8sResource | null =
    selectedLabels.length > 0
      ? {
          groupVersionKind: nodeKind,
          selector: selectorFromStringArray(selectedLabels),
          isList: true,
          namespaced: false,
        }
      : null;
  return useK8sWatchResource<NodeKind[]>(resource);
};

export default useSelectedNodes;
