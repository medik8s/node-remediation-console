import * as React from "react";
import {
  ListPageHeader,
  ListPageBody,
  ListPageCreate,
  useK8sWatchResource,
  useListPageFilter,
  ListPageFilter,
  //Timestamp,
} from "@openshift-console/dynamic-plugin-sdk";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { nodeHealthCheckKind, nodeHealthCheckStringKind } from "data/model";
import { NodeHealthCheck } from "data/types";
//import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import Modals from "components/modals/Modals";
import { Selector } from "@openshift-console/dynamic-plugin-sdk-internal/lib/api/common-types";
import { ModalsContextProvider } from "components/modals/ModalsContext";
import { NodeHealthchecksTable } from "./NodeHealthCheckTable";
import { withFallback } from "copiedFromConsole/error";
import "./nhc-list.css";

type ListPageProps = {
  selector?: Selector;
};

const NodeHealthCheckCreate = () => {
  const { t } = useNodeHealthCheckTranslation();
  const label = t("Create NodeHealthCheck");
  return (
    <ListPageCreate groupVersionKind={nodeHealthCheckStringKind}>
      {label}
    </ListPageCreate>
  );
};

const NodeHealthCheckListPage_: React.FC<ListPageProps> = ({ selector }) => {
  const [nodeHealthChecks, loaded, loadError] = useK8sWatchResource<
    NodeHealthCheck[]
  >({
    groupVersionKind: nodeHealthCheckKind,
    isList: true,
    namespaced: false,
    selector,
  });

  const [data, filteredData, onFilterChange] =
    useListPageFilter(nodeHealthChecks);
  const { t } = useNodeHealthCheckTranslation();
  return (
    <ModalsContextProvider>
      <ListPageHeader title={t("NodeHealthChecks")}>
        <NodeHealthCheckCreate />
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          onFilterChange={onFilterChange}
        />
        <NodeHealthchecksTable
          data={filteredData}
          unfilteredData={nodeHealthChecks}
          loaded={loaded}
          loadError={loadError}
        />
      </ListPageBody>
      <Modals />
    </ModalsContextProvider>
  );
};

const NodeHealthCheckListPage = withFallback(NodeHealthCheckListPage_);
export default NodeHealthCheckListPage;
