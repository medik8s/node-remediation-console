import * as React from "react";
import {
  VirtualizedTable,
  TableData,
  RowProps,
  ResourceLink,
  TableColumn,
  Timestamp,
  //Timestamp,
} from "@openshift-console/dynamic-plugin-sdk";

import { nodeHealthCheckKind, NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import NodeHealthCheckStatus from "../details/NodeHealthCheckStatus";
import NotAvailable from "./NotAvailable";
//import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import NodeHealthCheckActionsMenu from "components/actions/NodeHealthCheckActionsMenu";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { getRemediatorLabel } from "data/remediator";
import { EmptyBox } from "copiedFromConsole/utils/status-box";
import { TFunction } from "i18next";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { RemediationTemplateLink } from "../shared/RemediationTemplateLink";

import "./nhc-list.css";

const getSortByRemediator = (t: TFunction) => {
  const sortByRemediator = (
    nodeHealthChecks: NodeHealthCheck[],
    sortDirection: SortByDirection
  ) => {
    return nodeHealthChecks.sort(
      (
        nodeHealthCheck1: NodeHealthCheck,
        nodeHealthCheck2: NodeHealthCheck
      ) => {
        const remediator1 = getRemediatorLabel(nodeHealthCheck1, t);
        const remediator2 = getRemediatorLabel(nodeHealthCheck2, t);
        return sortDirection === SortByDirection.asc
          ? remediator1.localeCompare(remediator2)
          : remediator2.localeCompare(remediator1);
      }
    );
  };
  return sortByRemediator;
};
const getTableColumns = (t: TFunction): TableColumn<NodeHealthCheck>[] => [
  {
    title: t("Name"),
    id: "name",
    sort: "metadata.name",
    transforms: [sortable],
  },
  {
    title: t("Status"),
    id: "status",
    sort: "status.phase",
    transforms: [sortable],
  },
  {
    title: t("Remediator"),
    id: "remediator",
    sort: getSortByRemediator(t),
    transforms: [sortable],
  },
  {
    title: t("Created"),
    id: "created",
    sort: "metadata.creationTimestamp",
    transforms: [sortable],
  },
  { title: "", id: "kabab-menu" },
];

const Remediator = ({ obj }: { obj: NodeHealthCheck }) => {
  const { t } = useNodeHealthCheckTranslation();
  const remediatorLabel = getRemediatorLabel(obj, t);
  if (!remediatorLabel) {
    return <NotAvailable />;
  }
  return (
    <span data-test="remediator-label">
      <RemediationTemplateLink nodeHealthCheck={obj} />
    </span>
  );
};

const getNodeHealthCheckRowComponent = (
  ids: string[]
): React.FC<RowProps<NodeHealthCheck>> => {
  const NodeHealthcheckRow: React.FC<RowProps<NodeHealthCheck>> = ({
    obj,
    activeColumnIDs,
  }) => {
    return (
      <>
        <TableData id={ids[0]} activeColumnIDs={activeColumnIDs}>
          <ResourceLink
            groupVersionKind={nodeHealthCheckKind}
            name={obj.metadata.name}
            namespace={obj.metadata.namespace}
          />
        </TableData>
        <TableData id={ids[1]} activeColumnIDs={activeColumnIDs}>
          <NodeHealthCheckStatus nodeHealthCheck={obj} withPopover={true} />
        </TableData>
        <TableData id={ids[2]} activeColumnIDs={activeColumnIDs}>
          <Remediator obj={obj} />
        </TableData>
        <TableData id={ids[3]} activeColumnIDs={activeColumnIDs}>
          <Timestamp timestamp={obj.metadata.creationTimestamp} />
        </TableData>
        <TableData
          id={ids[4]}
          activeColumnIDs={activeColumnIDs}
          className="nhc-list__kabab-menu"
        >
          <NodeHealthCheckActionsMenu
            nodeHealthCheck={obj}
            isKababToggle={true}
          />
        </TableData>
      </>
    );
  };
  return NodeHealthcheckRow;
};

type NodeHealthchecksTableProps = {
  data: NodeHealthCheck[];
  unfilteredData: NodeHealthCheck[];
  loaded: boolean;
  loadError: unknown;
};

const EmptyNodeHealthChecks: React.FC = () => {
  return <EmptyBox label={NodeHealthCheckModel.labelPlural} />;
};

export const NodeHealthchecksTable: React.FC<NodeHealthchecksTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const columns = React.useMemo(() => getTableColumns(t), [t]);
  return (
    <VirtualizedTable<NodeHealthCheck>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={getNodeHealthCheckRowComponent(columns.map((column) => column.id))}
      EmptyMsg={EmptyNodeHealthChecks}
    />
  );
};
