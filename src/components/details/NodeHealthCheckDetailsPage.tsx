import {
  HorizontalNav,
  useK8sWatchResource,
} from "@openshift-console/dynamic-plugin-sdk";
import Modals from "components/modals/Modals";
import { ModalsContextProvider } from "components/modals/ModalsContext";
import { nodeHealthCheckKind } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import NodeHealthCheckDetailsHeading from "./NodeHealthCheckDetailsHeading";
import NodeHealthCheckDetailsTab from "./detailsTab/NodeHealthCheckDetailsTab";
import NodeHealthCheckYAMLTab from "./NodeHealthCheckYamlTab";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { withFallback } from "copiedFromConsole/error";
import { StatusBox } from "copiedFromConsole/utils/status-box";

export const useNodeHealthCheckTabs = () => {
  const { t } = useNodeHealthCheckTranslation();

  const tabs = React.useMemo(
    () => [
      {
        href: "",
        name: t("Details"),
        component: NodeHealthCheckDetailsTab,
      },
      {
        href: "yaml",
        name: t("Yaml"),
        component: NodeHealthCheckYAMLTab,
      },
    ],
    [t]
  );

  return tabs;
};

const NodeHealthCheckDetailsPage_ = ({ name }: { name: string }) => {
  const navigation = useNodeHealthCheckNavigation();
  const [nodeHealthCheck, loaded, loadError] =
    useK8sWatchResource<NodeHealthCheck>({
      groupVersionKind: nodeHealthCheckKind,
      name,
    });
  const tabs = useNodeHealthCheckTabs();
  return (
    <StatusBox loadError={loadError} data={nodeHealthCheck} loaded={loaded}>
      <ModalsContextProvider>
        <NodeHealthCheckDetailsHeading nodeHealthCheck={nodeHealthCheck} />
        <HorizontalNav pages={tabs} resource={nodeHealthCheck} />
        <Modals onDelete={() => navigation.gotoList()} />
      </ModalsContextProvider>
    </StatusBox>
  );
};

const NodeHealthCheckDetailsPage = withFallback(NodeHealthCheckDetailsPage_);

export default NodeHealthCheckDetailsPage;
