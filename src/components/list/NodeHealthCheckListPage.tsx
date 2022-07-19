import * as React from "react";
import {
  ListPageHeader,
  ListPageBody,
  ListPageCreate,
  VirtualizedTable,
  useK8sWatchResource,
  TableData,
  RowProps,
  ResourceLink,
  TableColumn,
  useListPageFilter,
  ListPageFilter,
  //Timestamp,
} from "@openshift-console/dynamic-plugin-sdk";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import {
  nodeHealthCheckKind,
  NodeHealthCheckModel,
  nodeHealthCheckStringKind,
} from "data/model";
import { NodeHealthCheck } from "data/types";
import { getNodeHealthCheckRemediatorLabel } from "data/remediatorFormData";
import { ModalsContextProvider } from "components/modals/ModalsContext";
import "./list.css";
import NodeHealthCheckStatus from "../details/NodeHealthCheckStatus";
import NotAvailable from "./NotAvailable";
//import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import NodeHealthCheckActionsMenu from "components/actions/NodeHealthCheckActionsMenu";
import Modals from "components/modals/Modals";
import { withFallback } from "components/copiedFromConsole/error/error-boundary";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { Selector } from "@openshift-console/dynamic-plugin-sdk-internal/lib/api/common-types";
import { EmptyBox } from "components/copiedFromConsole/status-box";
import { Timestamp } from "components/copiedFromConsole/utils/timestamp";

const sortByRemediator = (
  nodeHealthChecks: NodeHealthCheck[],
  sortDirection: SortByDirection
) => {
  return nodeHealthChecks.sort(
    (nodeHealthCheck1: NodeHealthCheck, nodeHealthCheck2: NodeHealthCheck) => {
      const remediator1 = getNodeHealthCheckRemediatorLabel(nodeHealthCheck1);
      const remediator2 = getNodeHealthCheckRemediatorLabel(nodeHealthCheck2);
      if (remediator1 === remediator2) {
        return 0;
      }
      if (remediator1 > remediator2 && sortDirection === SortByDirection.asc) {
        return 1;
      }
      return -1;
    }
  );
};

const columns: TableColumn<NodeHealthCheck>[] = [
  {
    title: "Name",
    id: "name",
    sort: "metadata.name",
    transforms: [sortable],
  },
  {
    title: "Created",
    id: "created",
    sort: "metadata.creationTimestamp",
    transforms: [sortable],
  },
  {
    title: "Remediator",
    id: "remediator",
    sort: sortByRemediator,
    transforms: [sortable],
  },
  {
    title: "Status",
    id: "status",
    sort: "status.phase",
    transforms: [sortable],
  },
  { title: "", id: "kabab-menu" },
];

const Remediator = ({ obj }: { obj: NodeHealthCheck }) => {
  const remediatorLabel = getNodeHealthCheckRemediatorLabel(obj);
  if (!remediatorLabel) {
    return <NotAvailable />;
  }
  return <>{remediatorLabel}</>;
};

const NodeHealthcheckRow: React.FC<RowProps<NodeHealthCheck>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={nodeHealthCheckKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
        {/* {obj.metadata.creationTimestamp} */}
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <Remediator obj={obj} />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckStatus nodeHealthCheck={obj} withPopover={true} />
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckActionsMenu
          nodeHealthCheck={obj}
          isKababToggle={true}
        ></NodeHealthCheckActionsMenu>
      </TableData>
    </>
  );
};

type NodeHealthchecksTableProps = {
  data: NodeHealthCheck[];
  unfilteredData: NodeHealthCheck[];
  loaded: boolean;
  loadError: any;
};

const EmptyNodeHealthChecks: React.FC = () => {
  return <EmptyBox label={NodeHealthCheckModel.labelPlural}></EmptyBox>;
};

const NodeHealthchecksTable: React.FC<NodeHealthchecksTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
}) => {
  return (
    <VirtualizedTable<NodeHealthCheck>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={NodeHealthcheckRow}
      EmptyMsg={EmptyNodeHealthChecks}
    />
  );
};

type ListPageProps = {
  selector?: Selector;
};

const NodeHealthCheckListPage_: React.FC<ListPageProps> = ({ selector }) => {
  const [nodeHealthchecks, loaded, loadError] = useK8sWatchResource<
    NodeHealthCheck[]
  >({
    groupVersionKind: nodeHealthCheckKind,
    isList: true,
    namespaced: false,
    selector,
  });
  const [data, filteredData, onFilterChange] =
    useListPageFilter(nodeHealthchecks);
  const { t } = useNodeHealthCheckTranslation();

  return (
    <>
      <ModalsContextProvider>
        <ListPageHeader title={t("NodeHealthChecks")}>
          <ListPageCreate groupVersionKind={nodeHealthCheckStringKind}>
            {t("Create NodeHealthCheck")}
          </ListPageCreate>
        </ListPageHeader>
        <ListPageBody>
          <ListPageFilter
            data={data}
            loaded={loaded}
            onFilterChange={onFilterChange}
          />
          <NodeHealthchecksTable
            data={filteredData}
            unfilteredData={nodeHealthchecks}
            loaded={loaded}
            loadError={loadError}
          />
        </ListPageBody>
        <Modals />
      </ModalsContextProvider>
    </>
  );
};

const NodeHealthCheckListPage = withFallback(NodeHealthCheckListPage_);
export default NodeHealthCheckListPage;
