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
import "./list.css";
//import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import Modals from "components/modals/Modals";
import { Selector } from "@openshift-console/dynamic-plugin-sdk-internal/lib/api/common-types";
import { ModalsContextProvider } from "components/modals/ModalsContext";
import { Alert, Button } from "@patternfly/react-core";
import { useNodeHealthChecksDisabled } from "apis/nodeHealthCheckApis";
import { NodeHealthchecksTable } from "./NodeHealthCheckTable";
import { useTranslation } from "react-i18next";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import { withFallback } from "components/copiedFromConsole/error";
import { StatusBox } from "components/copiedFromConsole/utils/status-box";

type ListPageProps = {
  selector?: Selector;
};

const DisabledAlert: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNodeHealthCheckNavigation();
  return (
    <Alert variant="info" isInline title={"NodeHealthChecks is disabled"}>
      {t(
        "NodeHealthChecks is not available because MachineHealthChecks is already enabled. To make edits, go to"
      )}{" "}
      <Button
        variant="link"
        isInline
        onClick={() => navigation.gotoMachineHealthChecks()}
      >
        MachineHealthChecks page.
      </Button>
    </Alert>
  );
};

const NodeHealthCheckCreate: React.FC<{ isDisabled: boolean }> = ({
  isDisabled,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const label = t("Create NodeHealthCheck");
  return isDisabled ? (
    <div className="co-m-primary-action">
      <Button variant="primary" isDisabled>
        {label}
      </Button>
    </div>
  ) : (
    <ListPageCreate groupVersionKind={nodeHealthCheckStringKind}>
      {label}
    </ListPageCreate>
  );
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
  const [isDisabled, disabledLoaded, disabledError] =
    useNodeHealthChecksDisabled();

  const [data, filteredData, onFilterChange] =
    useListPageFilter(nodeHealthchecks);
  const { t } = useNodeHealthCheckTranslation();

  return (
    <StatusBox
      loaded={disabledLoaded}
      loadError={disabledError}
      data={{ isDisabled: isDisabled }}
    >
      <ModalsContextProvider>
        <ListPageHeader title={t("NodeHealthChecks")}>
          <NodeHealthCheckCreate isDisabled={isDisabled} />
        </ListPageHeader>
        <ListPageBody>
          {isDisabled && <DisabledAlert />}
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
    </StatusBox>
  );
};

const NodeHealthCheckListPage = withFallback(NodeHealthCheckListPage_);
export default NodeHealthCheckListPage;
